import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpMemberUserDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  async signUp(@Body() singUpMemberUser: SignUpMemberUserDto) {
    return this.userService.create(singUpMemberUser);
  }
}
