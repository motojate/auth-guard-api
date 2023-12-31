import { AuthProvider, SiteType } from '@prisma/client';

export interface PayloadInterface {
  userSeq: string;
  iat: number;
  exp: number;
}
export interface IOAuthGoogleUser {
  name: string;
  email: string;
  picture: string;
  site: SiteType;
}
