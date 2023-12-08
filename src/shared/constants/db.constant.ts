import { AuthProvider, SiteType } from '@prisma/client';

export const SITE_DATA = [
  {
    name: SiteType.HEAL_GUARD,
  },
  {
    name: SiteType.MEAL_GUARD,
  },
  {
    name: SiteType.MYEONJEOB_BOKKA,
  },
  {
    name: SiteType.PILL_GUARD,
  },
];

export const SOCIAL_DATA: AuthProvider[] = [
  AuthProvider.GOOGLE,
  AuthProvider.KAKAO,
  AuthProvider.LOCAL,
  AuthProvider.NAVER,
];
