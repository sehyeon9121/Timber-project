// 카테고리 타입 정의 (오타 방지)
export type PublicationCategory = 'SCIE' | 'KCI' | 'International Conference' | 'Domestic Conference' | 'SCOPUS';

// 데이터 인터페이스 정의
export interface PublicationData {
  id: string;
  year: string;
  category: PublicationCategory;
  title: string;
  authors: string;
  journal: string;
  volume?: string;
  pages?: string;
  doi?: string;
  link?: string;
}
