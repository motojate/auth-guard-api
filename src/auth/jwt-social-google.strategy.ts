import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ExpressRequest } from 'src/shared/interfaces/common.interface';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
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
      const { name, emails, photos } = profile;
      const site = req.query.state;

      const user = {
        email: emails[0].value,
        name: name,
        picture: photos[0].value,
        site
      };

      done(null, user);
    } catch (e) {
      done(e);
    }
  }
}
