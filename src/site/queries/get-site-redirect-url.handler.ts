import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GetSiteRedirectUrlQuery } from './get-site-redirect-url.query';

@QueryHandler(GetSiteRedirectUrlQuery)
export class GetSiteRedirectUrlHandler implements IQueryHandler<GetSiteRedirectUrlQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetSiteRedirectUrlQuery): Promise<string> {
    const { redirectUrl } = await this.prisma.site.findUnique({
      where: {
        siteType: query.siteType
      },
      select: {
        redirectUrl: true
      }
    });
    return redirectUrl;
  }
}
