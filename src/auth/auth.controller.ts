import {
  Controller,
  HttpCode,
  Response,
  Body,
  Post,
  Get,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthWithPasswordDto } from './dtos/auth.dto';

import { SiteType } from '@prisma/client';
import {
  IOAuthGoogleUser,
  IOAuthNaverUser,
} from 'src/shared/interfaces/OAuth.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { AuthGuard } from '@nestjs/passport';
import {
  ExpressRequest,
  ExpressResponse,
} from 'src/shared/interfaces/common.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @HttpCode(201)
  async login(
    @Body() loginAuthDto: LoginAuthWithPasswordDto,
    @Response() res: ExpressResponse,
  ) {
    const command = new LoginCommand(loginAuthDto);
    const tokens = await this.commandBus.execute(command);
    res.cookie('access_token', tokens.accessToken, { httpOnly: true });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
    });
    res.send();
  }

  @Post('logout')
  @HttpCode(201)
  async logout(@Req() req: ExpressRequest, @Response() res: ExpressResponse) {
    res.cookie('access_token', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refresh_token', '', { httpOnly: true, expires: new Date(0) });
    res.send();
  }

  @Get('login/kakao')
  // UseGuards(AuthGuard('kakao'))
  async loginKakao(@Query('site') site: SiteType, @Res() res: ExpressResponse) {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}&response_type=code&state=${site}`;
    res.redirect(url);
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(
    @Req() req: ExpressRequest & { user: IOAuthGoogleUser },
    @Response() res: ExpressResponse,
  ) {
    const { user } = req;
    try {
      const { accessToken, refreshToken, url } =
        await this.authService.loginWithSocial(user, 'KAKAO');
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
      });
      res.redirect(url);
    } catch (e) {
      res.redirect('/api/invalid-access');
    }
  }

  @Get('login/naver')
  // @UseGuards(AuthGuard('naver'))
  async loginNaver(@Query('site') site: SiteType, @Res() res: ExpressResponse) {
    const state = encodeURIComponent(site);
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&state=${state}&redirect_uri=${process.env.NAVER_CALLBACK_URL}`;
    res.redirect(url);
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(
    @Req() req: ExpressRequest & { user: IOAuthNaverUser },
    @Response() res: ExpressResponse,
  ) {
    const { user } = req;
    try {
      const { accessToken, refreshToken, url } =
        await this.authService.loginWithSocial(user, 'NAVER');
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
      });
      res.redirect(url);
    } catch (e) {
      res.redirect('/api/invalid-access');
    }
  }

  @Get('login/google')
  loginGoogle(@Query('site') site: SiteType, @Res() res: ExpressResponse) {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email profile&state=${site}`;
    res.redirect(url);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: ExpressRequest & { user: IOAuthGoogleUser },
    @Response() res: ExpressResponse,
  ) {
    const { user } = req;
    try {
      const { accessToken, refreshToken, url } =
        await this.authService.loginWithSocial(user, 'GOOGLE');
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
      });
      res.redirect(url);
    } catch (e) {
      res.redirect('/api/invalid-access');
    }
  }

  @Get('refresh')
  async refresh(@Req() req: ExpressRequest, @Response() res: ExpressResponse) {
    const { refresh_token: refreshToken } = req.cookies;
    const tokens = await this.authService.refreshToken(refreshToken);
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
    });
    res.send();
  }
}
