import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from 'src/user/profile.entity';
import { User } from 'src/user/user.entity';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'testdb',
  entities: [User, Profile, Logs, Roles],
  // 同步本地schema与数据库 -> 初始化的时候去使用
  synchronize: true,
  logging: false, //process.env.NODE_ENV === 'development',
} as TypeOrmModuleOptions;
