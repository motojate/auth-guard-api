import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { from } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('test')
  async test() {
    await this.prisma.refreshToken.findMany({
      include: {
        user: true,
      },
    });

    await this.prisma.$queryRaw(
      Prisma.sql`SELECT *
      FROM AT_MB_USER a
      LEFT JOIN AT_MB_USER_SITE_MAPPING b ON b.user_seq = a.user_seq
      WHERE a.user_seq LIKE '%a%';`,
    );

    // console.log(query1);
    // console.log(query2);

    //
    /**LEFT JOIN AT_MB_USER_SITE_MAPPING b ON b.user_seq = a.user_seq
    WHERE a.user_seq="51a6a563-7e50-4ba2-83aa-d53b36d9cfc8";`); */
    //
    // console.log(query1);
    // console.log(query2);
    return 1;
  }
}
