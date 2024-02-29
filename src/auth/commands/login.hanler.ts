import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { AuthService } from 'src/auth/auth.service';
import { HeaderToken } from 'src/shared/interfaces/common.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand): Promise<HeaderToken> {
    const tokens = await this.authService.login(command);

    // 로그인 히스토리 저장
    return tokens;
  }
}
