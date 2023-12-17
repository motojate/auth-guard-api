import { AuthProvider, SiteType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SITE_DATA, SOCIAL_DATA } from 'src/shared/constants/db.constant';

class BaseLoginAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsIn(SITE_DATA.map((item) => item.name))
  readonly siteType: SiteType;

  @IsIn(SOCIAL_DATA)
  readonly loginProvider: AuthProvider;
}

export class LoginAuthDto extends BaseLoginAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginAuthWithSocialDto extends BaseLoginAuthDto {}
