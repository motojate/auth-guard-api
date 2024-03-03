import { Module } from '@nestjs/common';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtGoogleStrategy } from './jwt-social-google.strategy';
import { RedisCacheModule } from 'src/shared/redis/redis-cache.module';
import { LoginHandler } from './commands/login.hanler';

@Module({
  imports: [
    JwtModule.register({
      privateKey: process.env.JWT_PRIVATE_SECRET,
      signOptions: { algorithm: 'RS256', expiresIn: '1000m' },
    }),
    UserModule,
    EmailVerificationModule,
    RedisCacheModule,
  ],
  providers: [AuthService, JwtGoogleStrategy, LoginHandler],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtGoogleStrategy],
})
export class AuthModule {}
