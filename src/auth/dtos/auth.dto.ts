import { AuthProvider, SiteType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SITE_DATA, SOCIAL_DATA } from 'src/shared/constants/db.constant';

export class LoginAuthDto {
  @IsString()
  readonly type: 'password' | 'social';

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsIn(SITE_DATA.map((item) => item.siteType))
  @IsNotEmpty()
  readonly siteType: SiteType;

  @IsIn(SOCIAL_DATA)
  @IsNotEmpty()
  readonly loginProvider: AuthProvider;
}

export class LoginAuthWithPasswordDto extends LoginAuthDto {
  @IsString()
  readonly type = 'password';

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginAuthWithSocialDto extends LoginAuthDto {
  @IsString()
  readonly type = 'social';
}
