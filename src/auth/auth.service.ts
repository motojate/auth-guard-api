import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto, LoginAuthWithSocialDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';
import { IOAuthGoogleUser } from 'src/shared/interfaces/OAuth.interface';
import {
  HeaderToken,
  ValidateUserInfo,
} from 'src/shared/interfaces/common.interface';
import { RedisCacheService } from 'src/shared/redis/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly redisService: RedisCacheService,
  ) {}

  private createToken(userSeq: string, option?: { expiresIn: string }) {
    const payload = { userSeq };
    return this.jwtService.sign(payload, option);
  }

  private async validateUser(loginAuthDto: LoginAuthDto): Promise<string> {
    const { password, ...dto } = loginAuthDto;
    const user = await this.userService.findByUserForLogin(dto);
    const isValidPassword = await bcrypt.compare(password, user.user.password);
    if (!isValidPassword) throw new InvalidUserException();
    return user.userSeq;
  }

  async login(dto: LoginAuthDto): Promise<HeaderToken> {
    const userSeq = await this.validateUser(dto);
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken(userSeq),
      this.createRefreshToken(userSeq),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async createRefreshToken(userSeq: string) {
    const token = this.createToken(userSeq, { expiresIn: '30d' });
    const ttl = 30 * 24 * 60 * 60;
    await this.redisService.set<string>(`refresh-token:${userSeq}`, token, ttl);
    return token;
  }

  verifyToken(token: string) {
    return this.jwtService.verify<ValidateUserInfo>(token);
  }

  OAuthLogin(googleOAuthUser: IOAuthGoogleUser) {
    const dto: LoginAuthWithSocialDto = {
      userId: googleOAuthUser.email,
      siteType: googleOAuthUser.site,
      loginProvider: 'GOOGLE',
    };
    return 1;
  }
}
