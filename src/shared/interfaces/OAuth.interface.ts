import { SiteType } from '@prisma/client';
import { Request } from 'express';
import { ValidateUserInfo } from './common.interface';

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
export interface AuthenticatedRequest extends Request {
  user: ValidateUserInfo;
}
