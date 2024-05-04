import { Injectable } from '@nestjs/common';
import { SignUpMemberUserDto, SignUpSocialUserDto } from './dtos/user.dto';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PrismaException } from 'src/shared/exceptions/prisma.exception';
import { from, throwError, catchError, map } from 'rxjs';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: SignUpMemberUserDto) {
    return from(generateHashedPassword(dto.password)).pipe(
      map((hashedPassword) =>
        this.prisma.user.create({
          data: {
            userId: dto.userId,
            password: hashedPassword,
            siteType: dto.siteType,
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
          userId: dto.userId,
          password: null,
          siteType: dto.siteType,
          authProvider: dto.loginProvider,
        },
      }),
    ).pipe(
      map((user) => user.userSeq),
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
        return throwError(() => new PrismaException(e));
      }),
    );
  }
}
