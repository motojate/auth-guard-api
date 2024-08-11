import { SiteType } from '@prisma/client';
import { Request } from 'express';
import { ValidateUserInfo } from './common.interface';

export interface PayloadInterface {
  userSeq: string;
  iat: number;
  exp: number;
}
interface IOAuthBaseUser {
  name: string;
  email: string;
  site: SiteType;
}
export interface IOAuthGoogleUser extends IOAuthBaseUser {
  picture: string;
}
export type IOAuthNaverUser = IOAuthBaseUser;
export type IOAuthKakaoUser = IOAuthBaseUser;
export type IOAuthSocialUser = IOAuthGoogleUser | IOAuthNaverUser | IOAuthKakaoUser;
export interface AuthenticatedRequest extends Request {
  user: ValidateUserInfo;
}
