import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  HeaderToken,
  ValidateUserInfo,
} from 'src/shared/interfaces/common.interface';
import { RedisCacheService } from 'src/shared/redis/redis-cache.service';
import { ExpiredRefreshTokenException } from 'src/shared/exceptions/token.exception';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { LoginEvent } from './events/login.event';
import { LoginStrategyFactory } from './stategies/login-strategy.factory';
import { LoginAuthDtoType } from './stategies/login-strategy.inteface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisCacheService,
    private readonly eventBus: EventBus,
    private readonly loginStrategyFactory: LoginStrategyFactory,
  ) {}

  private createToken(userSeq: string, option?: { expiresIn: string }) {
    const payload = { userSeq };
    const token = this.jwtService.sign(payload, option);
    return token;
  }

  private async createRefreshToken(userSeq: string) {
    const token = this.createToken(userSeq, { expiresIn: '30d' });
    const ttl = 30 * 24 * 60 * 60;
    await this.redisService.set<string>(`refresh-token:${userSeq}`, token, ttl);
    return token;
  }

  async login(dto: LoginAuthDtoType): Promise<HeaderToken> {
    const strategy = this.loginStrategyFactory.getStrategy(dto);
    const userSeq = await strategy.authenticate(dto);
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken(userSeq),
      this.createRefreshToken(userSeq),
    ]);
    await this.eventBus.publish(new LoginEvent(userSeq));
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verify<ValidateUserInfo>(token);
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
