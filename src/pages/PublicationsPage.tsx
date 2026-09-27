import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { PublicationYearSection } from '@/components/organisms/PublicationYearSection';
import { Container } from '@/components/atoms/Container';
import { publicationData, type PublicationCategory } from '@/data/publicationData';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Publication } from '@/types';

// URL slug를 실제 카테고리 값으로 변환하는 매핑
const slugToCategoryMap: Record<string, PublicationCategory> = {
  'scie': 'SCIE',
  'kci': 'KCI',
  'international-conference': 'International Conference',
  'domestic-conference': 'Domestic Conference',
  'scopus': 'SCOPUS',
};

// 카테고리별 표시 이름
const categoryDisplayNames: Record<PublicationCategory, string> = {
  'SCIE': 'SCIE',
  'KCI': 'KCI',
  'International Conference': 'International Conference',
  'Domestic Conference': 'Domestic Conference',
  'SCOPUS': 'SCOPUS',
};

export function PublicationsPage() {
  const { t } = useLanguage();
  const { category: categorySlug } = useParams<{ category?: string }>();

  // 필터링 및 정렬된 데이터를 연도별로 그룹화
  const publicationsByYear = useMemo(() => {
    // 카테고리 매핑
    const targetCategory = categorySlug ? slugToCategoryMap[categorySlug] : undefined;

    // 필터링 (카테고리가 없으면 전체 데이터)
    const filteredData = targetCategory
      ? publicationData.filter((pub) => pub.category === targetCategory)
      : publicationData;

    // PublicationData를 Publication 타입으로 변환
    const convertedData: Publication[] = filteredData.map((pub) => ({
      id: pub.id,
      year: parseInt(pub.year, 10),
      authors: pub.authors,
      title: pub.title,
      journal: pub.volume && pub.pages
        ? `${pub.journal}, ${pub.volume}, ${pub.pages}`
        : pub.volume
        ? `${pub.journal}, ${pub.volume}`
        : pub.journal,
      link: pub.link || pub.doi,
    }));

    // year 기준 내림차순 정렬
    const sortedData = convertedData.sort((a, b) => b.year - a.year);

    // 연도별 그룹화
    const groupedByYear = sortedData.reduce<Record<number, Publication[]>>((acc, pub) => {
      if (!acc[pub.year]) {
        acc[pub.year] = [];
      }
      acc[pub.year].push(pub);
      return acc;
    }, {});

    // 연도 내림차순으로 정렬된 배열로 변환
    return Object.entries(groupedByYear)
      .map(([year, publications]) => ({
        year: parseInt(year, 10),
        publications,
      }))
      .sort((a, b) => b.year - a.year);
  }, [categorySlug]);

  // 동적 타이틀 생성
  const pageTitle = useMemo(() => {
    if (!categorySlug) {
      return t('publications.title');
    }
    const category = slugToCategoryMap[categorySlug];
    if (category) {
      return `${t('publications.title')} > ${categoryDisplayNames[category]}`;
    }
    return t('publications.title');
  }, [categorySlug, t]);

  return (
    <DetailPageLayout
      title={pageTitle}
      subtitle={t('publications.subtitle')}
      heroImage="/images/leeseunglab/publications-hero.jpg"
    >
      <div style={{ height: 60 }} />
      <ContentSection background="white" padding="lg">
        <Container maxWidth="none" className="max-w-[920px]">
          {publicationsByYear.length > 0 ? (
            publicationsByYear.map(({ year, publications: pubs }, groupIndex) => (
              <PublicationYearSection
                key={year}
                year={year}
                publications={pubs}
                style={groupIndex > 0 ? { marginTop: 30 } : undefined}
                baseIndex={groupIndex * 10}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              {t('publications.noResults') || 'No publications found.'}
            </div>
          )}
          <div style={{ height: 60 }} />
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
