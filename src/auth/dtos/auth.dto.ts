import { AuthProvider, SiteType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SITE_DATA, SOCIAL_DATA } from 'src/shared/constants/db.constant';

export class LoginAuthDto {
  readonly type?: 'password' | 'social';

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsIn(SITE_DATA.map((item) => item.name))
  @IsNotEmpty()
  readonly siteType: SiteType;

  @IsIn(SOCIAL_DATA)
  @IsNotEmpty()
  readonly loginProvider: AuthProvider;
}

export class LoginAuthWithPasswordDto extends LoginAuthDto {
  readonly type? = 'password';

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginAuthWithSocialDto extends LoginAuthDto {
  readonly type? = 'social';
}
