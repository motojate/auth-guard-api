import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SiteCreateCommand } from './site-create.command';
import { SiteType } from '@prisma/client';

@CommandHandler(SiteCreateCommand)
export class SiteCreateHandler implements ICommandHandler<SiteCreateCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: SiteCreateCommand): Promise<SiteType> {
    const { siteType, name, redirectUrl } = command.siteCreateDto;

    const site = await this.prisma.site.create({
      data: {
        siteType,
        name,
        redirectUrl
      }
    });

    return site.siteType;
  }
}
