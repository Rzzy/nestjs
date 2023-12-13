import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {
    // private userService:UserService： 这个是 this.userService = userService 的语法糖
    this.logger.log('UserController init');
  }
  @Get()
  getUsers(): any {
    const data = this.configService.get('db');
    this.logger.log('请求用户成功');
    const user = { isAdmin: false };
    if (!user.isAdmin) {
      // throw new HttpException('用户没有访问权限', HttpStatus.FORBIDDEN);
      throw new BadRequestException('访问报错');
    }

    return this.userService.findAll();
  }
  @Post()
  addUser(): any {
    const user = {
      username: 'rain',
      password: '123456',
    } as User;
    return this.userService.create(user);
  }

  @Get('/profile')
  getUserProfile() {
    return this.userService.findProfile(1);
  }

  @Get('/logs')
  getLogs() {
    return this.userService.findLogs(1);
  }
  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    return res.map((el) => ({
      result: el.result,
      count: el.count,
    }));
  }
}
