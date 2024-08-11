import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { VerifyCallback } from 'passport-oauth2';
import { ExpressRequest } from 'src/shared/interfaces/common.interface';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email'],
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
      const jsonToUser = profile._json;
      const user = {
        email: jsonToUser.kakao_account.email ?? jsonToUser.id,
        name: profile.name,
        site: req.query.state
      };

      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }
}
