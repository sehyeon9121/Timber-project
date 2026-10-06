import type { LocalizedText } from '@/types';

export interface ResultTarget {
  id: string;
  label: LocalizedText;
  first: number;
  second: number;
  weight: number;
}

// Targets from the supplied table. Row weights total 110%; the source total says 100%.
export const resultTargetGroups: { id: string; title: LocalizedText; description: LocalizedText; items: ResultTarget[] }[] = [
  {
    id: 'registered',
    title: { ko: '전담기관 등록·기탁 지표', en: 'Registered and Deposited Research Outputs' },
    description: { ko: '학술 발표, 지식재산, 연구자료 등 연구개발 결과를 공유하고 축적하기 위한 목표입니다.', en: 'Targets for sharing and preserving research outputs through publications, intellectual property, and research materials.' },
    items: [
      { id: 'scie', label: { ko: '논문(SCIE)', en: 'SCIE Papers' }, first: 31, second: 36, weight: 10 },
      { id: 'non-scie', label: { ko: '논문(비SCIE)', en: 'Non-SCIE Papers' }, first: 57, second: 27, weight: 8 },
      { id: 'presentations', label: { ko: '학술발표', en: 'Academic Presentations' }, first: 100, second: 67, weight: 3 },
      { id: 'patent-applications', label: { ko: '특허 출원', en: 'Patent Applications' }, first: 23, second: 8, weight: 6 },
      { id: 'patent-registrations', label: { ko: '특허 등록', en: 'Patent Registrations' }, first: 1, second: 16, weight: 10 },
      { id: 'reports', label: { ko: '보고서 원문', en: 'Full-text Reports' }, first: 55, second: 31, weight: 10 },
      { id: 'software', label: { ko: '소프트웨어', en: 'Software' }, first: 6, second: 5, weight: 8 },
      { id: 'standards', label: { ko: '표준화', en: 'Standardization' }, first: 5, second: 9, weight: 10 },
      { id: 'other', label: { ko: '기타', en: 'Other Outputs' }, first: 13, second: 15, weight: 10 },
    ],
  },
  {
    id: 'project',
    title: { ko: '연구개발과제 특성 반영 지표', en: 'Project-specific Performance Indicators' },
    description: { ko: '기술 활용과 인증, 전문인력 양성을 통해 연구성과의 현장 적용과 지속적인 발전을 추진합니다.', en: 'Support practical application and continued development through technology use, certification, and researcher training.' },
    items: [
      { id: 'technology-use', label: { ko: '기술실시', en: 'Technology Utilization' }, first: 1, second: 1, weight: 10 },
      { id: 'certifications', label: { ko: '기술인증', en: 'Technology Certifications' }, first: 4, second: 0, weight: 10 },
      { id: 'training', label: { ko: '인력양성', en: 'Researcher Training' }, first: 17, second: 9, weight: 5 },
    ],
  },
];

export const resultTargets = resultTargetGroups.flatMap(group => group.items);
export const resultTargetTotals = resultTargets.reduce((total, item) => ({
  first: total.first + item.first,
  second: total.second + item.second,
}), { first: 0, second: 0 });
