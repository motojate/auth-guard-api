import { Module } from '@nestjs/common';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtGoogleStrategy } from './jwt-social-google.strategy';
import { RedisCacheModule } from 'src/shared/redis/redis-cache.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1m' },
    }),
    UserModule,
    EmailVerificationModule,
    RedisCacheModule,
  ],
  providers: [AuthService, JwtStrategy, JwtGoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtGoogleStrategy, JwtStrategy],
})
export class AuthModule {}
