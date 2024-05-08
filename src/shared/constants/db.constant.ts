import { AuthProvider, SiteType } from '@prisma/client';

interface ISiteData {
  siteType: SiteType;
  name: string;
  redirectUrl: string;
}

export const SITE_DATA: ISiteData[] = [
  {
    siteType: SiteType.HEAL_GUARD,
    name: '운동 지킴이',
    redirectUrl: '',
  },
  {
    siteType: SiteType.MEAL_GUARD,
    name: '식사 지킴이',
    redirectUrl: '',
  },
  {
    siteType: SiteType.MYEONJEOB_BOKKA,
    name: '면접보까',
    redirectUrl: '',
  },
  {
    siteType: SiteType.PILL_GUARD,
    name: '영양 지킴이',
    redirectUrl: '',
  },
  {
    siteType: SiteType.STUDY_DIARY,
    name: '공부 일기',
    redirectUrl: '',
  },
];

export const SOCIAL_DATA: AuthProvider[] = [
  AuthProvider.GOOGLE,
  AuthProvider.KAKAO,
  AuthProvider.LOCAL,
  AuthProvider.NAVER,
];
