import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpMemberUserDto } from './dtos/user.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  test() {
    this.userService.test();
    return 1;
  }

  // @EventPattern('create_user')
  async signUp(@Payload() singUpMemberUser: SignUpMemberUserDto) {
    console.log('동작한다');
    return this.userService.create(singUpMemberUser);
  }
}
