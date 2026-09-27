/**
 * ACE Center 조직도 데이터
 * 데이터와 UI를 분리하여, 특정 부서 수정 시 이 파일만 변경하면 됩니다.
 */

export interface OrganizationMember {
  name: string;
  profileUrl?: string;
}

export interface DivisionData {
  id: string;
  label: string;
  title: string;
  members: OrganizationMember[];
}

export interface DirectorData {
  title: string;
  name: string;
  profileUrl?: string;
}

export const director: DirectorData = {
  title: 'Director',
  name: '이승재',
};

export const divisions: DivisionData[] = [
  {
    id: 'a-division',
    label: 'A Division',
    title: 'AI-Based Carbon Neutral Design',
    members: [
      { name: '이승재' },
      { name: '이진강' },
    ],
  },
  {
    id: 'c-division',
    label: 'C- Division',
    title: 'Carbon Reduction & Decarbonization Systems',
    members: [
      { name: '곽병창' },
      { name: '박수완' },
    ],
  },
  {
    id: 'e-division',
    label: 'E+ Division',
    title: 'Energy Positive & Sustainable Systems',
    members: [
      { name: '김태용' },
      { name: '배진우' },
    ],
  },
];
