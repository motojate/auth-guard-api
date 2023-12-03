import { Controller, HttpCode, Response, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dtos/auth.dto';
import { Response as ExpressResponse } from 'express';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Response() res: ExpressResponse,
  ) {
    const user = await this.authService.validateUser(loginAuthDto);
    const tokens = await this.authService.login(user.userSeq);
    res.cookie('access_token', tokens.access_token, { httpOnly: true });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
    res.send();
  }
}
