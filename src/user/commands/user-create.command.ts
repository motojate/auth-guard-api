import { ICommand } from '@nestjs/cqrs';
import { AuthProvider, SiteType } from '@prisma/client';

interface IUSerCreateDtoInterface {
  userId: string;
  password: string | null;
  siteType: SiteType;
  loginProvider: AuthProvider;
}

export class UserCreateCommand implements ICommand {
  constructor(public readonly userCreateDto: IUSerCreateDtoInterface) {}
}
