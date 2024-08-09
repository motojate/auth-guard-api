import { ICommand } from '@nestjs/cqrs';
import { SiteType } from '@prisma/client';

interface ISiteCreateDtoInterface {
  siteType: SiteType;
  name: string;
  redirectUrl: string;
}

export class SiteCreateCommand implements ICommand {
  constructor(public readonly siteCreateDto: ISiteCreateDtoInterface) {}
}
