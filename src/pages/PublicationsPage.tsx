import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { PublicationYearSection } from '@/components/organisms/PublicationYearSection';
import { Container } from '@/components/atoms/Container';
import { getPublicationsByYear } from '@/data/publications';
import { useLanguage } from '@/contexts/LanguageContext';

export function PublicationsPage() {
  const { t } = useLanguage();
  // YAML 파일에서 연도별 출판물 데이터 로드
  const publicationsByYear = getPublicationsByYear();

  return (
    <DetailPageLayout
      title={t('publications.title')}
      subtitle={t('publications.subtitle')}
      heroImage="/images/leeseunglab/publications-hero.jpg"
    >
      <div style={{ height: 60 }} />
      <ContentSection background="white" padding="lg">
        <Container maxWidth="none" className="max-w-[920px]">
          {publicationsByYear.map(({ year, publications: pubs }, groupIndex) => (
            <PublicationYearSection
              key={year}
              year={year}
              publications={pubs}
              style={groupIndex > 0 ? { marginTop: 30 } : undefined}
              baseIndex={groupIndex * 10}
            />
          ))}
          <div style={{ height: 60 }} />
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
