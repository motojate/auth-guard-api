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
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dtos/auth.dto';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SiteType } from '@prisma/client';
import { IOAuthGoogleUser } from 'src/shared/interfaces/OAuth.interface';
import {
  InvalidTokenException,
  NullTokenException,
} from 'src/shared/exceptions/token.exception';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(201)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Response() res: ExpressResponse,
  ) {
    const user = await this.authService.validateUser(loginAuthDto);
    const tokens = await this.authService.login(user.userSeq);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
    });
    res.send();
  }

  @Post('logout')
  @HttpCode(201)
  async logout(@Req() req: ExpressRequest, @Response() res: ExpressResponse) {
    const { access_token: accessToken, refresh_token: refreshToken } =
      req.cookies;
    if (accessToken && refreshToken)
      await Promise.all([
        this.authService.registBlackListToken(accessToken),
        this.authService.registBlackListToken(refreshToken),
      ]);
    res.cookie('access_token', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refresh_token', '', { httpOnly: true, expires: new Date(0) });
    res.send();
  }

  @Get('login/google')
  async loginGoogle(
    @Query('site') site: SiteType,
    @Res() res: ExpressResponse,
  ) {
    const state = encodeURIComponent(JSON.stringify({ site }));
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email profile&state=${state}`;
    res.redirect(url);
  }

  @Get('google/callback')
  @HttpCode(201)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: ExpressRequest & { user: IOAuthGoogleUser },
    @Response() res: ExpressResponse,
  ) {
    const googleOAuthUser = req.user;
    const user = await this.authService.OAuthLogin(googleOAuthUser);
    const tokens = await this.authService.login(user.userSeq);
    res.cookie('access_token', tokens.access_token, { httpOnly: true });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
    switch (user.authProvider) {
      case 'LOCAL':
        res.redirect('http://localhost:3000');
      case 'KAKAO':
        res.redirect('http://localhost:3000');
      case 'NAVER':
        res.redirect('http://localhost:3000');
      case 'GOOGLE':
        res.redirect('http://localhost:3000');
    }
  }

  @Get('jwt/check')
  @UseGuards(JwtAuthGuard)
  async jwtCookieCheck() {
    return true;
  }

  @Get('refresh')
  async refresh(@Req() req: ExpressRequest, @Response() res: ExpressResponse) {
    const { access_token: accessToken, refresh_token: refreshToken } =
      req.cookies;
    if (!accessToken || !refreshToken) throw new NullTokenException();

    const payload = await this.authService.decodeToken(accessToken);
    const userSeq = payload['userSeq'];
    const isValidRefreshToken = await this.authService.verifyRefreshToken(
      refreshToken,
      userSeq,
    );
    if (!isValidRefreshToken) throw new InvalidTokenException();
    const tokens = await this.authService.login(userSeq);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
    });
    res.send();
  }
}
