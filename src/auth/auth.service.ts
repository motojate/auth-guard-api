import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto, LoginAuthWithSocialDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';
import { IOAuthGoogleUser } from 'src/shared/interfaces/OAuth.interface';
import { decode } from 'jsonwebtoken';
import { InvalidTokenException } from 'src/shared/exceptions/token.exception';
import { PrismaException } from 'src/shared/exceptions/prisma.exception';
import {
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  of,
  throwError,
} from 'rxjs';
import { ValidateUserInfo } from 'src/shared/interfaces/common.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async decodeToken(token: string) {
    try {
      const decoded = decode(token, { complete: false });
      return decoded;
    } catch (e) {
      return null;
    }
  }

  private createToken(userSeq: string, option?: { expiresIn: string }) {
    const payload = { userSeq };
    return this.jwtService.sign(payload, option);
  }

  private getNewLoginTokens(userSeq: string) {
    return this.createRefreshToken(userSeq).pipe(
      map((refreshToken) => {
        const accessToken = this.createToken(userSeq);
        return { access_token: accessToken, refresh_token: refreshToken };
      }),
    );
  }

  private validateUser(loginAuthDto: LoginAuthDto) {
    const { password, ...dto } = loginAuthDto;
    return this.userService.findByUserForLogin(dto).pipe(
      mergeMap((data) => {
        return from(bcrypt.compare(password, data.user.password)).pipe(
          map((isValidPassword) => {
            if (!isValidPassword) throw new InvalidUserException();
            else return data.userSeq;
          }),
        );
      }),
    );
  }

  login(dto: LoginAuthDto) {
    return this.validateUser(dto).pipe(
      mergeMap((userSeq) => this.getNewLoginTokens(userSeq)),
    );
  }

  private createRefreshToken(userSeq: string) {
    const token = this.createToken(userSeq, { expiresIn: '30d' });
    return from(
      this.prisma.refreshToken.upsert({
        where: {
          userSeq: userSeq,
        },
        create: {
          token,
          userSeq,
        },
        update: {
          token,
        },
      }),
    ).pipe(
      map((refreshToken) => refreshToken.token),
      catchError((e) => throwError(() => new PrismaException(e))),
    );
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  verifyToken(token: string) {
    return this.jwtService.verify<ValidateUserInfo>(token);
  }

  verifyRefreshToken(token: string) {
    return of(this.verifyToken(token)).pipe(
      mergeMap((payload) => {
        return from(
          this.prisma.refreshToken.findUnique({
            where: { userSeq: payload.userSeq },
          }),
        ).pipe(map((data) => data));
      }),
      catchError((e) => e),
    );
  }

  OAuthLogin(googleOAuthUser: IOAuthGoogleUser) {
    const dto: LoginAuthWithSocialDto = {
      userId: googleOAuthUser.email,
      siteType: googleOAuthUser.site,
      loginProvider: 'GOOGLE',
    };
    return this.userService.findByUserForLogin(dto).pipe(
      mergeMap((user) =>
        user ? of(user.userSeq) : this.userService.createBySocial(dto),
      ),
      mergeMap((userSeq) => this.getNewLoginTokens(userSeq)),
    );
  }

  registBlackListToken(token: string) {
    return from(
      this.prisma.tokenBlackList.create({
        data: {
          token,
        },
      }),
    ).pipe(catchError((e) => throwError(() => new PrismaException(e))));
  }

  findBlackListToken(token: string): Observable<boolean> {
    return from(
      this.prisma.tokenBlackList.findUnique({
        where: {
          token,
        },
      }),
    ).pipe(
      map((token) => {
        if (token) return true;
        else return false;
      }),
      catchError((e) => throwError(() => new PrismaException(e))),
    );
  }
}
