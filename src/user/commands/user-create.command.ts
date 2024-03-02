import { ICommand } from '@nestjs/cqrs';
import { AuthProvider, SiteType } from '@prisma/client';

export class UserCreateCommand implements ICommand {
  readonly userId: string;
  readonly password: string;
  readonly siteType: SiteType;
  readonly loginProvider: AuthProvider;
}
