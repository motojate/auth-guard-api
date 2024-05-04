import { PrismaClient } from '@prisma/client';
import { SITE_DATA } from '../src/shared/constants/db.constant';

const prisma = new PrismaClient();

async function main() {
  await prisma.site.createMany({
    data: SITE_DATA.map(({ siteType, name, redirectUrl }) => ({
      siteType,
      name,
      redirectUrl,
    })),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
