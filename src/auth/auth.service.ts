import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) { }
  async signin(username:string, password:string) {
    
    return await this.userService.find(username)
  }
  signup(username:string, password:string) {
    return 'fronm signup ' + username + password;
  }
}
