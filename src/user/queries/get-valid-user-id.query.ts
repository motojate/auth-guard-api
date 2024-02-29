import { IQuery } from '@nestjs/cqrs';
import { AuthProvider, SiteType } from '@prisma/client';

export class GetValidUserIdQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly siteName: SiteType,
    public readonly authProvider: AuthProvider,
  ) {}
}
