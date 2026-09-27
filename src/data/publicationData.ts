// 타입 re-export
export type { PublicationCategory, PublicationData } from './publications/types';

// 개별 데이터 import
import { scieData } from './publications/scie';
import { scopusData } from './publications/scopus';
import { kciData } from './publications/kci';
import { internationalData } from './publications/international';
import { domesticData } from './publications/domestic';

// 모든 데이터를 하나로 합쳐서 export
export const publicationData = [
  ...scieData,
  ...scopusData,
  ...kciData,
  ...internationalData,
  ...domesticData,
];

// 개별 데이터도 re-export (필요시 사용)
export { scieData, scopusData, kciData, internationalData, domesticData };
