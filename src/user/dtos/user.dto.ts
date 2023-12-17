import { AuthProvider, SiteType } from '@prisma/client';
import { IsEmpty, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SITE_DATA, SOCIAL_DATA } from 'src/shared/constants/db.constant';

export class FindMemberUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
export class SignUpMemberUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsIn(SITE_DATA.map((item) => item.name))
  readonly siteType: SiteType;
}

export class SignUpSocialUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsIn(SITE_DATA.map((item) => item.name))
  readonly siteType: SiteType;

  @IsIn(SOCIAL_DATA)
  readonly loginProvider: AuthProvider;
}
export class UpdateMemberUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
