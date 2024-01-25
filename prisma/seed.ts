import { PrismaClient } from '@prisma/client';
import { catchError, finalize, from, throwError } from 'rxjs';
import { SITE_DATA } from '../src/shared/constants/db.constant';
import { PrismaException } from '../src/shared/exceptions/prisma.exception';

const prisma = new PrismaClient();

const main = () => {
  return from(
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
