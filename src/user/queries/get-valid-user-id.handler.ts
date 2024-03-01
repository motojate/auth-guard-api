import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetValidUserIdQuery } from './get-valid-user-id.query';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { InUsedUserException } from 'src/shared/exceptions/user.exception';

@QueryHandler(GetValidUserIdQuery)
export class GetValidUserIDHandler
  implements IQueryHandler<GetValidUserIdQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetValidUserIdQuery): Promise<boolean> {
    const userConut = await this.prisma.userSiteMapping.count({
      where: {
        userId: query.userId,
        authProvider: query.authProvider,
        siteName: query.siteName,
      },
    });
    if (userConut > 0) throw new InUsedUserException();
    else return true;
  }
}
