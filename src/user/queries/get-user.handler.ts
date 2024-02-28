import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserSiteMapping } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute(query: GetUserQuery): Promise<UserSiteMapping> {
    return this.prisma.userSiteMapping.findUnique({
      where: {
        userSiteAuthProvider: {
          userId: query.userId,
          siteName: query.siteName,
          authProvider: query.authProvider,
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
  }
}
