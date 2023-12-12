import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
  logger.log(`App run in port 3000`);
  logger.warn(`App run in port 3000`);
  logger.error(`App run in port 3000`);
}
bootstrap();
