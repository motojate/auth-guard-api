import { IQuery } from '@nestjs/cqrs';
import { AuthProvider, SiteType } from '@prisma/client';

export class GetUserQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly siteName: SiteType,
    public readonly authProvider: AuthProvider,
  ) {}
}
