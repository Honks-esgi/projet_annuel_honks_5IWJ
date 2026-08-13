import './tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
        }),
        new LokiTransport({
          host: 'http://loki:3100',
          labels: { app: 'honks-api' },
          json: true,
          onConnectionError: (err) => console.error('Loki connection error', err),
        }),
      ],
    }),
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  new Logger('Bootstrap').log(`API started on port ${port}`);
}
bootstrap();
