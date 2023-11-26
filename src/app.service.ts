import { Injectable } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { PrismaException } from './shared/exceptions/prisma.exception';
import { SITE_DATA } from './shared/constants/db.constant';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDataBySite() {
    try {
      const count = await this.prisma.site.count();
      if (count === 0)
        return await this.prisma.site.createMany({ data: SITE_DATA });
      else return;
    } catch (e) {
      throw new PrismaException();
    }
  }
}
