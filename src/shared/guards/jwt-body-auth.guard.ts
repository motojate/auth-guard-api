import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HeaderToken } from '../interfaces/common.interface';
import {
  BlackListTokenException,
  ExpiredTokenException,
  InvalidTokenException,
  NullTokenException,
} from '../exceptions/token.exception';
import { AuthService } from 'src/auth/auth.service';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';

@Injectable()
export class JwtBodyAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens: HeaderToken = request.body.tokens;
    if (!tokens?.accessToken) throw new NullTokenException();

    return this.authService.findBlackListToken(tokens.accessToken).pipe(
      switchMap((isBlackList) => {
        if (isBlackList) return throwError(() => new BlackListTokenException());
        else return from(this.authService.verifyToken(tokens.accessToken));
      }),
      map((decodedToken) => {
        console.log(decodedToken);
        return true;
      }),
      catchError((err) => {
        switch (err.name) {
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
