import { ICommand } from '@nestjs/cqrs';
import { AuthProvider, SiteType } from '@prisma/client';
import { LoginAuthDto } from '../dtos/auth.dto';

export class LoginCommand implements ICommand {
  readonly userId: string;
  readonly password: string;
  readonly siteType: SiteType;
  readonly loginProvider: AuthProvider;
  readonly type: 'password' | 'social';

  constructor(loginAuthDto: LoginAuthDto) {
    Object.assign(this, loginAuthDto);
  }
}
