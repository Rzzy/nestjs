import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signin(username: string, password: string) {
    return await this.userService.find(username);
  }
  async signup(username: string, password: string) {
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', 400);
    }
    const res = await this.userService.create({
      username,
      password,
    });
    return res;
  }
}
