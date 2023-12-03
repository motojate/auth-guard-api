import { SiteType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SITE_DATA } from 'src/shared/constants/db.constant';

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
export class UpdateMemberUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
