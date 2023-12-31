import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import {
  ExpiredTokenException,
  NullTokenException,
} from '../exceptions/token.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | any {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token'];
    request.headers.authorization = `Bearer ${accessToken}`;
    if (accessToken) request.headers.authorization = `Bearer ${accessToken}`;
    else throw new NullTokenException();

    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: User | null | boolean,
    info: any,
    context: ExecutionContext,
  ) {
    if (!user) {
      if (info && info.name === 'TokenExpiredError')
        throw new ExpiredTokenException();
    }

    return super.handleRequest(err, user, info, context);
  }
}
