import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LogEnum } from '../enum/config.enum';

function createDailyRotateFile(level: string, file: string) {
  return new winston.transports.DailyRotateFile({
    level: 'warn',
    dirname: 'logs',
    filename: `${file}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      // 字符串的拼接
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransPorts = new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            // 字符串的拼接
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });

        //TODO 此处读取的配置为字符串类型，需要转化为需要的布尔类型
        console.log(
          configService.get(LogEnum.LOG_ON),
          typeof configService.get(LogEnum.LOG_ON),
        );
        return {
          transports: [
            consoleTransPorts,
            ...(configService.get(LogEnum.LOG_ON) === 'true'
              ? [
                  createDailyRotateFile('warn', 'application'),
                  createDailyRotateFile('info', 'info'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
