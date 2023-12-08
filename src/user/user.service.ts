import { Injectable } from '@nestjs/common';
import { SignUpMemberUserDto, UpdateMemberUserDto } from './dtos/user.dto';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PrismaException } from 'src/shared/exceptions/prisma.exception';
import { $Enums, User } from '@prisma/client';
import {
  CrudService,
  QueryFilter,
} from 'src/shared/interfaces/factory.interface';
import { LoginAuthDto, LoginAuthWithSocialDto } from 'src/auth/dtos/auth.dto';

@Injectable()
export class UserService
  implements CrudService<User, SignUpMemberUserDto, UpdateMemberUserDto>
{
  constructor(private readonly prisma: PrismaService) {}
  findAll(): Promise<
    {
      userSeq: string;
      userId: string;
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
    password: string;
    status: $Enums.Status;
    authProvider: $Enums.AuthProvider;
    createdAt: Date;
    updatedAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }

  async create(dto: SignUpMemberUserDto) {
    try {
      const hashedPassword = await generateHashedPassword(dto.password);
      const user = await this.prisma.user.create({
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
      });
      return user;
    } catch (e) {
      console.log(e);
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

  async findUniqueByUserIdAndSiteType(dto: LoginAuthDto) {
    try {
      const user = await this.prisma.userSiteMapping.findUnique({
        where: {
          siteUserId: {
            userId: dto.userId,
            siteName: dto.siteType,
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
}
