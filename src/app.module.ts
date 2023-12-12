import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import Configuration from './configuration';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
const envFilePath = `.env.${process.env.NODE_ENV}`;
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      // ignoreEnvFile: true, // 忽略默认配置文件，否则无法使用自定义的配置文件
      isGlobal: true, // 设置此参数为true， 则全局可用，否则只能在app模块中使用
      envFilePath: envFilePath, // 设置配置文件的路径,
      load: [() => dotenv.config({ path: '.env' }) /* Configuration*/], // 使用load配置和dotenv加载公共配置并合并配置
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        db: Joi.object().valid({
          mysql1: Joi.string(),
        }),
      }),
    }),
    /*
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'example',
      database: 'testdb',
      entities: [],
      // 同步本地schema与数据库 -> 初始化的时候去使用
      synchronize: true,
      logging: ['error'],
    }),
    */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          // 同步本地schema与数据库 -> 初始化的时候去使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: false, //process.env.NODE_ENV === 'development',
        } as TypeOrmModuleOptions;
      },
    }),
    UserModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              level: 'info',
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
            {
              level: 'info',
              target: 'pino-roll',
              options: {
                file: join('logs', 'log.txt'),
                frequency: 'daily',
                // size: '0.1k', // 设置日志文件大小
                mkdir: true,
              },
            },
          ],
        },
        /* 正常配置方式
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              }
            : {
                target: 'pino-roll',
                options: {
                  file: 'log.txt',
                  frequency: 'daily',
                  mkdir: true,
                },
              },
              */
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
