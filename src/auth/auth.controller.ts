import {
  Controller,
  HttpCode,
  Response,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dtos/auth.dto';
import { Response as ExpressResponse } from 'express';
import { BaseResponse } from 'src/shared/responses/base.response';
import { AuthGuard } from '@nestjs/passport';
import { SiteType } from '@prisma/client';

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

  @Get('/login/google') //restAPI만들기. 엔드포인트는 /login/google.
  @UseGuards(AuthGuard('google')) //인증과정을 거쳐야하기때문에 UseGuards를 써주고 passport인증으로 AuthGuard를 써준다. 이름은 google로
  async loginGoogle(@Query('site') site: SiteType, @Res() res) {
    const state = encodeURIComponent(JSON.stringify({ site }));

    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email profile&state=${state}`;
    res.redirect(url);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    switch (user.site as SiteType) {
      case 'HEAL_GUARD':

      case 'MEAL_GUARD':

      case 'MYEONJEOB_BOKKA':

      case 'PILL_GUARD':
    }
  }
}
