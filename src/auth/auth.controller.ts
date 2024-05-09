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
import {
  LoginAuthWithPasswordDto,
  LoginAuthWithSocialDto,
} from './dtos/auth.dto';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { SiteType } from '@prisma/client';
import {
  IOAuthGoogleUser,
  IOAuthNaverUser,
} from 'src/shared/interfaces/OAuth.interface';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  @HttpCode(201)
  async login(
    @Body() loginAuthDto: LoginAuthWithPasswordDto,
    @Response() res: ExpressResponse,
  ) {
    console.log(loginAuthDto);
    const tokens = await this.commandBus.execute(
      new LoginCommand(loginAuthDto),
    );
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
    const dto: LoginAuthWithSocialDto = {
      userId: user.email,
      siteType: user.site,
      loginProvider: 'NAVER',
      type: 'social',
    };

    if (user.site in SiteType) {
      const tokens = await this.authService.login(dto);
      console.log(tokens);
    } else return res.send('<div>잘못된 접근입니다.</div>');
  }

  @Get('login/google')
  loginGoogle(@Query('site') site: SiteType, @Res() res: ExpressResponse) {
    const state = encodeURIComponent(JSON.stringify({ site }));
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email profile&state=${state}`;
    res.redirect(url);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: ExpressRequest & { user: IOAuthGoogleUser },
    @Response() res: ExpressResponse,
  ) {
    const { user } = req;
    const dto: LoginAuthWithSocialDto = {
      userId: user.email,
      siteType: user.site,
      loginProvider: 'GOOGLE',
      type: 'social',
    };

    if (user.site in SiteType) {
      const tokens = await this.authService.login(dto);
      console.log(tokens);
    } else return res.send('<div>잘못된 접근입니다.</div>');
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
