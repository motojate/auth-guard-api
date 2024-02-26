import { ICommand } from '@nestjs/cqrs';
import { AuthProvider, SiteType } from '@prisma/client';

export class LoginCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly password: string,
    public readonly siteType: SiteType,
    public readonly loginProvider: AuthProvider,
  ) {}
}
