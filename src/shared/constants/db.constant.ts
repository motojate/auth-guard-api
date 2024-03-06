import { AuthProvider, SiteType } from '@prisma/client';

export const SITE_DATA = [
  {
    siteType: SiteType.HEAL_GUARD,
  },
  {
    siteType: SiteType.MEAL_GUARD,
  },
  {
    siteType: SiteType.MYEONJEOB_BOKKA,
  },
  {
    siteType: SiteType.PILL_GUARD,
  },
];

export const SOCIAL_DATA: AuthProvider[] = [
  AuthProvider.GOOGLE,
  AuthProvider.KAKAO,
  AuthProvider.LOCAL,
  AuthProvider.NAVER,
];
