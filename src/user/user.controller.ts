import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { query } from 'express';
import { getUserDto } from './dto/get-user.dto';
// import { Logger } from 'nestjs-pino';
@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // private userService:UserService： 这个是 this.userService = userService 的语法糖
    this.logger.log('UserController init');
  }
  @Get()
  getUsers(@Query() query: getUserDto): any {
    console.log(
      '🚀 ~ file: user.controller.ts:41 ~ UserController ~ getUsers ~ query:',
      query,
    );
    const data = this.configService.get('db');
    return this.userService.findAll(query);
  }
  @Get('/:id')
  getUser(): any {
    return 'hellow ';
  }
  @Post()
  addUser(@Body() dto: any): any {
    console.log('----------------', dto);
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('/profile')
  getUserProfile() {
    return this.userService.findProfile(1);
  }
  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number) {
    console.log(
      '🚀 ~ file: user.controller.ts:61 ~ UserController ~ updateUser ~ dto:',
      dto,
    );
    const user = dto as User;
    return this.userService.update(id, user);
  }
  @Delete('/:id')
  deletUser(@Param('id') id: number) {
    return this.userService.remove(id);
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
