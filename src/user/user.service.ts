import { Injectable } from '@nestjs/common';
import {
  SignUpMemberUserDto,
  SignUpSocialUserDto,
  UpdateMemberUserDto,
} from './dtos/user.dto';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PrismaException } from 'src/shared/exceptions/prisma.exception';
import { $Enums, User } from '@prisma/client';
import {
  CrudService,
  QueryFilter,
} from 'src/shared/interfaces/factory.interface';
import { LoginAuthDto, LoginAuthWithSocialDto } from 'src/auth/dtos/auth.dto';
import axios from 'axios';
import { from, mergeMap, throwError, catchError, Observable, map } from 'rxjs';

@Injectable()
export class UserService
  implements CrudService<User, SignUpMemberUserDto, UpdateMemberUserDto>
{
  constructor(private readonly prisma: PrismaService) {}
  findAll(): Promise<
    {
      userSeq: string;
      userId: string;
      name: string;
      password: string;
      status: $Enums.Status;
      authProvider: $Enums.AuthProvider;
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    throw new Error('Method not implemented.');
  }
  findByFilter(
    filter: QueryFilter<{
      userSeq: string;
      userId: string;
      name: string;
      password: string;
      status: $Enums.Status;
      authProvider: $Enums.AuthProvider;
      createdAt: Date;
      updatedAt: Date;
    }>,
  ): Promise<
    {
      userSeq: string;
      userId: string;
      name: string;
      password: string;
      status: $Enums.Status;
      authProvider: $Enums.AuthProvider;
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    throw new Error('Method not implemented.');
  }
  update(
    id: string | number,
    dto: UpdateMemberUserDto,
  ): Promise<{
    userSeq: string;
    userId: string;
    name: string;
    password: string;
    status: $Enums.Status;
    authProvider: $Enums.AuthProvider;
    createdAt: Date;
    updatedAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Promise<{
    userSeq: string;
    userId: string;
    name: string;
    password: string;
    status: $Enums.Status;
    authProvider: $Enums.AuthProvider;
    createdAt: Date;
    updatedAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }

  create(dto: SignUpMemberUserDto): any {
    return from(generateHashedPassword(dto.password)).pipe(
      mergeMap((hashedPassword) =>
        this.prisma.user.create({
          data: {
            userId: dto.userId,
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
      mergeMap((user) =>
        from(
          axios.post('http://localhost:3500/api/user/sign-up', {
            uesrSeq: user.userSeq,
          }),
        ).pipe(
          map(() => user),
          catchError(() => this.handleUserCreationError(user.userSeq)),
        ),
      ),
      catchError(() => throwError(() => new PrismaException())),
    );
  }

  private handleUserCreationError(userSeq: string): Observable<never> {
    return from(this.prisma.user.delete({ where: { userSeq } })).pipe(
      mergeMap(() => throwError(() => new PrismaException())),
    );
  }

  async createBySocial(dto: SignUpSocialUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          userId: dto.userId,
          password: null,
          authProvider: dto.loginProvider,
          sites: {
            create: {
              userId: dto.userId,
              siteName: dto.siteType,
              authProvider: dto.loginProvider,
            },
          },
        },
      });
      return user;
    } catch (e) {
      throw new PrismaException();
    }
  }

  // async createWithSocial()

  async findUnique(userSeq: string) {
    try {
      return await this.prisma.user.findUnique({ where: { userSeq: userSeq } });
    } catch (e) {
      throw new PrismaException();
    }
  }

  async findUniqueByUserIdAndSiteType(dto: LoginAuthWithSocialDto) {
    try {
      const user = await this.prisma.userSiteMapping.findUnique({
        where: {
          siteUserId: {
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
      });

      return user;
    } catch (e) {
      throw new PrismaException();
    }
  }

  async findUniqueByUserIdAndSiteTypeAndAuthProvider(
    dto: LoginAuthWithSocialDto,
  ) {
    try {
      const user = await this.prisma.userSiteMapping.findUnique({
        where: {
          siteUserId: {
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
      });

      return user;
    } catch (e) {
      throw new PrismaException();
    }
  }

  async findUserInfo(userSeq: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userSeq },
        select: {
          name: true,
          userId: true,
        },
      });

      return user;
    } catch (e) {
      throw new PrismaException();
    }
  }
}
