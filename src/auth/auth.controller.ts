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
    console.log(req.user.site);
    // Google 로그인 후 콜백. 사용자 정보를 처리합니다.
    // 예를 들어, 사용자 정보를 데이터베이스에 저장하거나 JWT 토큰을 생성할 수 있습니다.
    const user = req.user; // Google 전략에서 반환한 사용자 정보
    // 사용자 정보 처리 로직...
    console.log('11', user);
  }
}
