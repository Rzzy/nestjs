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
// const envFilePath = `.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      // ignoreEnvFile: true, // 忽略默认配置文件，否则无法使用自定义的配置文件
      isGlobal: true, // 设置此参数为true， 则全局可用，否则只能在app模块中使用
      // envFilePath: envFilePath, // 设置配置文件的路径,
      load: [/*() => dotenv.config({ path: '.env' })*/ Configuration], // 使用load配置和dotenv加载公共配置并合并配置
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
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [],
          // 同步本地schema与数据库 -> 初始化的时候去使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: [configService.get(ConfigEnum.DB_LOGGING)],
        } as TypeOrmModuleOptions),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
