/**
 * 출판물 데이터 로더
 * /content/publications/ 폴더의 YAML 파일들을 로드합니다.
 */

import type { Publication } from '@/types';

// YAML 파일 동적 import
import publications2024 from '@content/publications/2024.yaml';
import publications2023 from '@content/publications/2023.yaml';
import publications2022 from '@content/publications/2022.yaml';
import publications2021 from '@content/publications/2021.yaml';

// YAML에서 로드된 데이터의 raw 타입
interface RawPublication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  link?: string;
  abstract?: string;
}

// Raw 데이터를 Publication 타입으로 변환
function transformPublications(raw: RawPublication[]): Publication[] {
  return raw.map((pub) => ({
    id: pub.id,
    title: pub.title,
    authors: pub.authors,
    journal: pub.journal,
    year: pub.year,
    link: pub.link,
    abstract: pub.abstract,
  }));
}

// 모든 출판물 데이터 병합 및 정렬
export const publications: Publication[] = [
  ...transformPublications(publications2024 as RawPublication[]),
  ...transformPublications(publications2023 as RawPublication[]),
  ...transformPublications(publications2022 as RawPublication[]),
  ...transformPublications(publications2021 as RawPublication[]),
].sort((a, b) => b.year - a.year);

// 연도별로 그룹화된 출판물
export function getPublicationsByYear(): { year: number; publications: Publication[] }[] {
  const grouped = publications.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = [];
    }
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  // 연도 내림차순 정렬
  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return sortedYears.map((year) => ({
    year,
    publications: grouped[year],
  }));
}
