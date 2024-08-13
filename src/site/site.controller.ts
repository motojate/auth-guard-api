import { Body, Controller, Post } from '@nestjs/common';
import { CreateSiteDto } from './dtos/site.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SiteCreateCommand } from './commands/site-create.command';

@Controller('site')
export class SiteController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async createSite(@Body() createSiteDto: CreateSiteDto) {
    const handler = new SiteCreateCommand(createSiteDto);
    await this.commandBus.execute(handler);
  }
}
