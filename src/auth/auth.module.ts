import { Module } from '@nestjs/common';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtGoogleStrategy } from './jwt-social-google.strategy';
import { RedisCacheModule } from 'src/shared/redis/redis-cache.module';
import { LoginHandler } from './commands/login.hanler';
import { LoginEventHandler } from './events/login.event.handler';
import { GetUserHandler } from 'src/user/queries/get-user.handler';
import { PasswordLoginStrategy, SocialLoginStrategy } from './stategies';
import { LoginStrategyFactory } from './stategies/login-strategy.factory';
import { UserCreateHandler } from 'src/user/commands/user-create.handler';
import { JwtNaverStrategy } from './jwt-social-naver.strategy';
import { JwtKakaoStrategy } from './jwt-social-kakao.strategy';
import { GetSiteRedirectUrlHandler } from 'src/site/queries/get-site-redirect-url.handler';

@Module({
  imports: [
    JwtModule.register({
      privateKey: process.env.JWT_PRIVATE_SECRET,
      signOptions: { algorithm: 'RS256', expiresIn: '15m' },
    }),
    UserModule,
    EmailVerificationModule,
    RedisCacheModule,
  ],
  providers: [
    AuthService,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
    LoginHandler,
    LoginEventHandler,
    GetUserHandler,
    UserCreateHandler,
    PasswordLoginStrategy,
    SocialLoginStrategy,
    LoginStrategyFactory,
    GetSiteRedirectUrlHandler,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
