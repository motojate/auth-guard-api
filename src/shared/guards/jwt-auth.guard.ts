import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import {
  BlackListTokenException,
  ExpiredTokenException,
  InvalidTokenException,
  NullTokenException,
} from 'src/shared/exceptions/token.exception';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ModuleRef } from '@nestjs/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const prisma = this.moduleRef.get(PrismaService, { strict: false });
    const accessToken = request.cookies['access_token'];
    if (!accessToken) {
      throw new NullTokenException();
    }
    request.headers.authorization = `Bearer ${accessToken}`;

    return from(
      prisma.tokenBlackList.findUnique({
        where: { token: accessToken },
      }),
    ).pipe(
      switchMap((tokenInBlacklist) => {
        if (tokenInBlacklist)
          return throwError(() => new BlackListTokenException());

        return super.canActivate(context) as Observable<boolean>;
      }),
      catchError((error) => throwError(() => error)),
    );
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
      else if (info && info.name === 'JsonWebTokenError')
        throw new InvalidTokenException();
    }

    return super.handleRequest(err, user, info, context);
  }
}
