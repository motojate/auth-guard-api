import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserQuery) {
    const whereCondition = this.buildWhereCondition(query);
    console.log(whereCondition);
    return this.prisma.user.findUnique({ where: whereCondition });
  }

  private buildWhereCondition(
    query: GetUserQuery,
  ): Prisma.UserWhereUniqueInput {
    const conditions: {
      [key in keyof GetUserQuery]: () => Prisma.UserWhereUniqueInput;
    } = {
      userSeq: () => ({ userSeq: query.userSeq }),
      loginAuthDto: () => ({
        userIdSiteType: {
          userId: query.loginAuthDto.userId,
          siteType: query.loginAuthDto.siteType,
        },
      }),
    };

    const key = Object.keys(query).find((k) => query[k] !== undefined);

    return conditions[key]();
  }
}
