import { Prisma, PrismaClient, UserSiteMapping } from '@prisma/client';
import { catchError, finalize, from, merge, mergeMap, throwError } from 'rxjs';
import { SITE_DATA } from '../src/shared/constants/db.constant';
import { PrismaException } from '../src/shared/exceptions/prisma.exception';

const prisma = new PrismaClient();
const USERS_COUNT = 30000;
const USERS_DATA = [];

for (let i = 0; i < USERS_COUNT; i++) {
  USERS_DATA.push({
    password: 'qwer1234',
    sites: {
      create: {
        userId: `test${i + 1060000}`,
        siteName: 'MYEONJEOB_BOKKA',
      },
    },
  });
}
const main = () => {
  Promise.all(USERS_DATA.map((data) => prisma.user.create({ data })));
  return merge(
    prisma.site.createMany({
      data: SITE_DATA,
      skipDuplicates: true,
    }),
  ).pipe(
    catchError((e) => throwError(() => new PrismaException(e))),
    finalize(async () => {
      await prisma.$disconnect();
    }),
  );
};

main().subscribe({
  error: (err) => console.error('An error occurred:', err),
  complete: () => console.log('Operation completed successfully'),
});
