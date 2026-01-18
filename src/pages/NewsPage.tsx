import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { DecoratedSectionHeader } from '@/components/organisms/DecoratedSectionHeader';
import { NewsCard } from '@/components/molecules/NewsCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsItems } from '@/data/news';

export function NewsPage() {
  const { t } = useLanguage();

  return (
    <DetailPageLayout
      title={t('news.title')}
      subtitle={t('news.subtitle')}
      heroImage="/images/leeseunglab/hero-background.jpg"
    >
      {/* Latest News Header */}
      <ContentSection background="white" padding="lg" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <Container maxWidth="none" className="max-w-[840px]">
          <DecoratedSectionHeader title={t('news.latestNews')} subtitle="TERRER LAB" />
        </Container>
      </ContentSection>

      {/* News List */}
      <ContentSection background="white" padding="lg" style={{ paddingBottom: 120 }}>
        <Container maxWidth="none" className="max-w-[1100px]">
          <div className="flex flex-col" style={{ gap: 52 }}>
            {newsItems.map((news, index) => (
              <NewsCard
                key={news.id}
                {...news}
                index={index}
              />
            ))}
          </div>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
