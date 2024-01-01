import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpMemberUserDto } from './dtos/user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Request as ExpressRequest } from 'express';
import { BaseResponse } from 'src/shared/responses/base.response';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() singUpMemberUser: SignUpMemberUserDto) {
    return this.userService.create(singUpMemberUser);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: ExpressRequest) {
    const { access_token: accessToken } = req.cookies;
    const payload = await this.authService.decodeToken(accessToken);
    const userSeq = payload['userSeq'];
    const data = await this.userService.findUserInfo(userSeq);
    return new BaseResponse(data, 1000);
  }
}
