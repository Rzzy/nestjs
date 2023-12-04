import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    // private userService:UserService： 这个是 this.userService = userService 的语法糖
  }
  @Get()
  getUsers(): any {
    const data = this.configService.get('db');
    console.log('configns:', data);
    return this.userService.getUsers();
  }
  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}
