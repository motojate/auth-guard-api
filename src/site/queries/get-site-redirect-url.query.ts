import { IQuery } from '@nestjs/cqrs';
import { SiteType } from '@prisma/client';

export class GetSiteRedirectUrlQuery implements IQuery {
  constructor(public readonly siteType: SiteType) {}
}
