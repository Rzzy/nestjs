import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  // const logger = new Logger();
  const instance = createLogger({
    // options of Winston
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          // 字符串的拼接
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          // 字符串的拼接
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'info',
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          // 字符串的拼接
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  app.setGlobalPrefix('api/v1');
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(3000);
  // logger.log(`App run in port 3000`);
  // logger.warn(`App run in port 3000`);
  // logger.error(`App run in port 3000`);
}
bootstrap();
