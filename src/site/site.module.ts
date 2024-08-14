import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteCreateHandler } from './commands/site-create.handler';

@Module({
  controllers: [SiteController],
  providers: [SiteCreateHandler]
})
export class SiteModule {}
