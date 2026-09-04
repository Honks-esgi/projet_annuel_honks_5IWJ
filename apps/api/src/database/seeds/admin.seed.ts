import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { UserService } from '../../user/user.service';
import { UserRole } from '../../user/user-role.enum';

const logger = new Logger('AdminSeed');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const userService = app.get(UserService);

    const username = process.env.ADMIN_USERNAME ?? 'admin';
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      throw new Error('ADMIN_PASSWORD must be set to seed the admin user');
    }

    const existing = await userService.findOneBy({ username });
    if (existing) {
      logger.log(`Admin user "${username}" already exists, skipping.`);
      return;
    }

    await userService.create(username, password, UserRole.ADMIN);
    logger.log(`Admin user "${username}" created.`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((err) => {
  logger.error('Failed to seed admin user', err);
  process.exit(1);
});
