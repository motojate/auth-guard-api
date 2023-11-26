import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpMemberUser {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
