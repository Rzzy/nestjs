import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logs } from './src/logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { Profile } from './src/user/profile.entity';
import { User } from './src/user/user.entity';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './src/enum/config.enum';

// ToDo: 使用entitysDir代替实体类的引入
const entitysDir =
  process.env.NODE_ENV === 'development'
    ? [__dirname + '/**/*.entity.ts']
    : [__dirname + '/**/*.entity{.js, .ts}'];
console.log(entitysDir);

// 通过环境变量读取不同的.env文件
function getEnv(env: string) {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }

  return {};
}

// 通过dotENV来解析不同的配置
function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV}`);
  const config = { ...defaultConfig, ...envConfig };
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: [User, Profile, Logs, Roles],
    // 同步本地schema与数据库 -> 初始化的时候去使用
    synchronize: config[ConfigEnum.DB_SYNC],
    logging: false, //process.env.NODE_ENV === 'development',} as TypeOrmModuleOptions;
  } as unknown as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migration/**'],
  subscribers: [],
} as DataSourceOptions);
