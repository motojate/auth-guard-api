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
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtBodyAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens: HeaderToken = request.body.tokens;

    if (!tokens?.accessToken) throw new NullTokenException();

    return of(this.authService.verifyToken(tokens.accessToken)).pipe(
      mergeMap((payload) => {
        return this.userService.findUnique(payload.userSeq).pipe(
          map((user) => {
            if (!user) throw new InvalidTokenException();
            request.user = payload;
            return true;
          }),
        );
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
