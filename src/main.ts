import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { createLogger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(3000);
  // logger.log(`App run in port 3000`);
  // logger.warn(`App run in port 3000`);
  // logger.error(`App run in port 3000`);
}
bootstrap();
