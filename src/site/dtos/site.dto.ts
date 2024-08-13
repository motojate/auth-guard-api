import { SiteType } from '@prisma/client';

export class CreateSiteDto {
  siteType: SiteType;
  name: string;
  redirectUrl: string;
}
