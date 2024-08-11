import { LoginAuthWithPasswordDto, LoginAuthWithSocialDto } from '../dtos/auth.dto';

export type LoginAuthDtoType = LoginAuthWithPasswordDto | LoginAuthWithSocialDto;

export interface ILoginStrategy {
  authenticate(loginAuthDto: LoginAuthDtoType): Promise<string>;
}
