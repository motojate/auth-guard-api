import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HeaderToken } from 'src/shared/interfaces/common.interface';
import {
  BlackListTokenException,
  ExpiredTokenException,
  InvalidTokenException,
  NullTokenException,
} from 'src/shared/exceptions/token.exception';
import { AuthService } from 'src/auth/auth.service';
import { Observable, catchError, map, mergeMap, of, throwError } from 'rxjs';

@Injectable()
export class JwtBodyAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens: HeaderToken = request.body.tokens;

    if (!tokens?.accessToken) throw new NullTokenException();

    return this.authService.findBlackListToken(tokens.accessToken).pipe(
      mergeMap((isBlackList) => {
        if (isBlackList) throw new BlackListTokenException();
        return of(this.authService.verifyToken(tokens.accessToken));
      }),
      map((payload) => {
        request.user = payload;
        return true;
      }),
      catchError((err) => {
        switch (err.name) {
          case 'BlackListTokenException':
            return throwError(() => new BlackListTokenException());
          case 'TokenExpiredError':
            return throwError(() => new ExpiredTokenException());
          case 'JsonWebTokenError':
          default:
            return throwError(() => new InvalidTokenException());
        }
      }),
    );
  }
}
