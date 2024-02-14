import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpMemberUserDto } from './dtos/user.dto';
import { Payload } from '@nestjs/microservices';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async signUp(@Payload() singUpMemberUser: SignUpMemberUserDto) {
    console.log('동작한다');
    return this.userService.create(singUpMemberUser);
  }
}
