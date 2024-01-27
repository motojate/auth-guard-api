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
import {
  AuthenticatedRequest,
  IOAuthGoogleUser,
} from 'src/shared/interfaces/OAuth.interface';
import { JwtBodyAuthGuard } from 'src/shared/guards/jwt-body-auth.guard';
import { map } from 'rxjs';
import { BaseResponse } from 'src/shared/responses/base.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() loginAuthDto: LoginAuthDto, @Response() res: ExpressResponse) {
    return this.authService.login(loginAuthDto).pipe(
      map((tokens) => {
        res.cookie('access_token', tokens.access_token, { httpOnly: true });
        res.cookie('refresh_token', tokens.refresh_token, {
          httpOnly: true,
        });
        const response = BaseResponse.success(null);
        res.json(response);
      }),
    );
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
  loginGoogle(@Query('site') site: SiteType, @Res() res: ExpressResponse) {
    const state = encodeURIComponent(JSON.stringify({ site }));
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email profile&state=${state}`;
    res.redirect(url);
  }

  @Get('google/callback')
  @HttpCode(201)
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: ExpressRequest & { user: IOAuthGoogleUser },
    @Response() res: ExpressResponse,
  ) {
    const googleOAuthUser = req.user;
    return this.authService.OAuthLogin(googleOAuthUser).pipe(
      map((tokens) => {
        res.cookie('access_token', tokens.access_token, { httpOnly: true });
        res.cookie('refresh_token', tokens.refresh_token, {
          httpOnly: true,
        });
        const response = BaseResponse.success(null);
        res.json(response);
        res.redirect('http://localhost:3000');
      }),
    );
  }

  @Post('jwt/check')
  @UseGuards(JwtBodyAuthGuard)
  jwtCookieCheck(@Req() req: AuthenticatedRequest): string {
    return req.user.userSeq;
  }

  @Get('refresh')
  refresh(@Req() req: ExpressRequest, @Response() res: ExpressResponse) {
    const { refresh_token: refreshToken } = req.cookies;

    return this.authService.verifyRefreshToken(refreshToken);
    // const tokens = await this.authService.login(userSeq);
    // res.cookie('access_token', tokens.access_token, {
    //   httpOnly: true,
    // });
    // res.cookie('refresh_token', tokens.refresh_token, {
    //   httpOnly: true,
    // });
    // res.send();
  }
}
