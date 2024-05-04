import { Injectable } from '@nestjs/common';
import { PasswordLoginStrategy } from './password-login.strategy';
import { SocialLoginStrategy } from './social-login.strategy';
import { LoginAuthDto } from '../dtos/auth.dto';
import { ILoginStrategy } from './login-strategy.inteface';

@Injectable()
export class LoginStrategyFactory {
  constructor(
    private readonly passwordLoginStrategy: PasswordLoginStrategy,
    private readonly socialLoginStrategy: SocialLoginStrategy,
  ) {}

  getStrategy(dto: LoginAuthDto): ILoginStrategy {
    console.log(dto);
    switch (dto.type) {
      case 'password':
        return this.passwordLoginStrategy;
      case 'social':
        return this.socialLoginStrategy;
      default:
        throw new Error('잘못된 접근입니다.'); // TODO
    }
  }
}
