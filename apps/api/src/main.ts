import './tracing';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { AppModule } from './app.module';
import { Public } from './auth/public.decorator';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

Public()(PrometheusController);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
        new LokiTransport({
          host: 'http://loki:3100',
          labels: { app: 'honks-api' },
          json: true,
          onConnectionError: (err) =>
            console.error('Loki connection error', err),
        }),
      ],
    }),
  });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(helmet());

  const corsOrigins = (config.get<string>('CORS_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  app.enableCors({ origin: corsOrigins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // health unprefixed
  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`API listening on port ${port}`);
}
void bootstrap();
