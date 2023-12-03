import { IsNotEmpty, IsString } from 'class-validator';

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
}
export class UpdateMemberUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
