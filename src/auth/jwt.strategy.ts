import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';
import { PayloadInterface } from 'src/shared/interfaces/OAuth.interface';
import { ValidateUserInfo } from 'src/shared/interfaces/common.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_PRIVATE_SECRET,
    });
  }

  async validate(payload: PayloadInterface): Promise<ValidateUserInfo> {
    const user = await firstValueFrom(
      this.userService.findUnique(payload.userSeq),
    );
    return {
      userSeq: user.userSeq,
    };
  }
}
