import { Injectable } from '@nestjs/common';
import { SignUpMemberUserDto, SignUpSocialUserDto } from './dtos/user.dto';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PrismaException } from 'src/shared/exceptions/prisma.exception';

import {
  BaseLoginAuthDto,
  LoginAuthWithSocialDto,
} from 'src/auth/dtos/auth.dto';
import { from, throwError, catchError, map } from 'rxjs';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: SignUpMemberUserDto): any {
    return from(generateHashedPassword(dto.password)).pipe(
      map((hashedPassword) =>
        this.prisma.user.create({
          data: {
            password: hashedPassword,
            sites: {
              create: {
                userId: dto.userId,
                siteName: dto.siteType,
              },
            },
          },
        }),
      ),
      catchError((e) => throwError(() => new PrismaException(e))),
    );
  }

  createBySocial(dto: SignUpSocialUserDto) {
    return from(
      this.prisma.user.create({
        data: {
          password: null,
          sites: {
            create: {
              userId: dto.userId,
              authProvider: dto.loginProvider,
              siteName: dto.siteType,
            },
          },
        },
      }),
    ).pipe(
      map((user) => user.userSeq),
      catchError((e) => throwError(() => new PrismaException(e))),
    );
  }

  findByUserForLogin(dto: BaseLoginAuthDto) {
    return from(
      this.prisma.userSiteMapping.findUnique({
        where: {
          userSiteAuthProvider: {
            userId: dto.userId,
            siteName: dto.siteType,
            authProvider: dto.loginProvider,
          },
        },
        include: {
          user: {
            select: {
              password: true,
            },
          },
        },
      }),
    ).pipe(
      map((user) => {
        if (!user && user.authProvider === 'LOCAL')
          throwError(() => new InvalidUserException());
        return user;
      }),
      catchError((e) => throwError(() => new PrismaException(e))),
    );
  }

  findUnique(userSeq: string) {
    return from(
      this.prisma.user.findUnique({
        where: {
          userSeq,
        },
      }),
    ).pipe(
      map((user) => {
        if (!user) throw new InvalidUserException();
        return user;
      }),
      catchError((e) => {
        console.log(e);
        return throwError(() => new PrismaException(e));
      }),
    );
  }

  async findUniqueByUserIdAndSiteTypeAndAuthProvider(
    dto: LoginAuthWithSocialDto,
  ) {
    try {
      const user = await this.prisma.userSiteMapping.findUnique({
        where: {
          userSiteAuthProvider: {
            userId: dto.userId,
            siteName: dto.siteType,
            authProvider: dto.loginProvider,
          },
        },
        include: {
          user: {
            select: {
              password: true,
              userSeq: true,
            },
          },
        },
      });

      return user;
    } catch (e) {
      throw new PrismaException(e);
    }
  }
}
