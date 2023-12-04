import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  addUser(): any {
    return {
      code: 0,
      data: [],
      messge: '添加用户成功',
    };
  }
  getUsers(): any {
    return {
      code: 0,
      data: [],
      messge: '请求用户列表成功',
    };
  }
}
