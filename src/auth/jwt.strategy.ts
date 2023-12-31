import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PayloadInterface } from 'src/shared/interfaces/OAuth.interface';
import { UserService } from 'src/user/user.service';
import { InvalidTokenException } from 'src/shared/exceptions/token.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.userService.findUnique(payload.userSeq);
    if (!user) throw new InvalidTokenException();
    return user.userId;
  }
}
