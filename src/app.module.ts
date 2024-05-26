import { Global, Logger, Module } from '@nestjs/common';
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
// import { Logger, LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { LogsModule } from './logs/logs.module';
import { connectionParams } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
@Global()
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
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
