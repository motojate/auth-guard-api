import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto, LoginAuthWithSocialDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';
import { IOAuthGoogleUser } from 'src/shared/interfaces/OAuth.interface';
import {
  HeaderToken,
  ValidateUserInfo,
} from 'src/shared/interfaces/common.interface';
import { RedisCacheService } from 'src/shared/redis/redis-cache.service';
import { ExpiredRefreshTokenException } from 'src/shared/exceptions/token.exception';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from 'src/user/queries/get-user.query';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisCacheService,
    private readonly queryBus: QueryBus,
  ) {}

  private createToken(userSeq: string, option?: { expiresIn: string }) {
    const payload = { userSeq };
    return this.jwtService.sign(payload, option);
  }

  private async validateUser(loginAuthDto: LoginAuthDto): Promise<string> {
    const { password, ...dto } = loginAuthDto;
    const user = await this.queryBus.execute(
      new GetUserQuery(dto.userId, dto.siteType, dto.loginProvider),
    );
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

  async verifyToken(token: string) {
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

  async refreshToken(token: string): Promise<HeaderToken> {
    const payload = await this.verifyToken(token);
    const redisToken = await this.redisService.get<string>(
      `refresh-token:${payload.userSeq}`,
    );

    if (redisToken !== token) throw new ExpiredRefreshTokenException();
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken(payload.userSeq),
      this.createRefreshToken(payload.userSeq),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
