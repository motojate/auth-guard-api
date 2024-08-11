import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';
import { VerifyCallback } from 'passport-oauth2';
import { ExpressRequest } from 'src/shared/interfaces/common.interface';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
      passReqToCallback: true
    });
  }

  async validate(
    req: ExpressRequest,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    try {
      const user = {
        email: profile.email,
        name: profile.name,
        site: req.query.state
      };
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }
}
