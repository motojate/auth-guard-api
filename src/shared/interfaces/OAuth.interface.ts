import { SiteType } from '@prisma/client';

export interface IOAuthGoogleUser {
  name: string;
  email: string;
  picture: string;
  site: SiteType;
}
