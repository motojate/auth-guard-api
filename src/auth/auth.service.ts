import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  HeaderToken,
  ValidateUserInfo,
} from 'src/shared/interfaces/common.interface';
import { RedisCacheService } from 'src/shared/redis/redis-cache.service';
import { ExpiredRefreshTokenException } from 'src/shared/exceptions/token.exception';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { LoginEvent } from './events/login.event';
import { LoginStrategyFactory } from './stategies/login-strategy.factory';
import { LoginAuthDtoType } from './stategies/login-strategy.inteface';
import { IOAuthSocialUser } from 'src/shared/interfaces/OAuth.interface';
import { LoginAuthWithSocialDto } from './dtos/auth.dto';
import { AuthProvider, SiteType } from '@prisma/client';
import { LoginCommand } from './commands/login.command';
import { GetSiteRedirectUrlQuery } from 'src/site/queries/get-site-redirect-url.query';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisCacheService,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
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
    const event = new LoginEvent(userSeq);
    await this.eventBus.publish(event);
    return {
      accessToken,
      refreshToken,
    };
  }

  async loginWithSocial(user: IOAuthSocialUser, loginProvider: AuthProvider) {
    const dto: LoginAuthWithSocialDto = {
      userId: user.email,
      siteType: user.site,
      loginProvider,
      type: 'social',
    };
    if (!Object.keys(SiteType).includes(user.site))
      throw new Error('Invalid Site Type'); // TODO

    const command = new LoginCommand(dto);
    const tokens = await this.commandBus.execute<LoginCommand, HeaderToken>(
      command,
    );
    const urlQuery = new GetSiteRedirectUrlQuery(user.site);
    const url = await this.queryBus.execute<GetSiteRedirectUrlQuery, string>(
      urlQuery,
    );
    const { accessToken, refreshToken } = tokens;
    return { accessToken, refreshToken, url };
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
