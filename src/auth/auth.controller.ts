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
import { SiteType } from '@prisma/client';
import { AuthenticatedRequest } from 'src/shared/interfaces/OAuth.interface';
import { JwtBodyAuthGuard } from 'src/shared/guards/jwt-body-auth.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  @HttpCode(201)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Response() res: ExpressResponse,
  ) {
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

  @Get('login/google')
  loginGoogle(@Query('site') site: SiteType, @Res() res: ExpressResponse) {
    const state = encodeURIComponent(JSON.stringify({ site }));
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email profile&state=${state}`;
    res.redirect(url);
  }

  // @Get('google/callback')
  // @HttpCode(201)
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(
  //   @Req() req: ExpressRequest & { user: IOAuthGoogleUser },
  //   @Response() res: ExpressResponse,
  // ) {
  //   const googleOAuthUser = req.user;
  //   return this.authService.OAuthLogin(googleOAuthUser).pipe(
  //     map((tokens) => {
  //       res.cookie('access_token', tokens.access_token, { httpOnly: true });
  //       res.cookie('refresh_token', tokens.refresh_token, {
  //         httpOnly: true,
  //       });
  //       const response = BaseResponse.success(null);
  //       res.json(response);
  //       res.redirect('http://localhost:3000');
  //     }),
  //   );
  // }

  @Get('jwt/check')
  @UseGuards(JwtAuthGuard)
  getJwtCookieCheck(@Req() req: AuthenticatedRequest): string {
    return req.user.userSeq;
  }

  @Post('jwt/check')
  @UseGuards(JwtBodyAuthGuard)
  postJwtCookieCheck(@Req() req: AuthenticatedRequest): string {
    return req.user.userSeq;
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
