import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { TextBlock } from '@/components/atoms/TextBlock';
import { ClimateSnacksCard } from '@/components/molecules/ClimateSnacksCard';
import { climateSnacksSessions } from '@/data/climateSnacks';
import { useLanguage } from '@/contexts/LanguageContext';

export function ClimateSnacksPage() {
  const { t } = useLanguage();

  return (
    <DetailPageLayout
      title={t('climateSnacks.title')}
      subtitle={t('climateSnacks.subtitle')}
    >
      {/* Section Header */}
      <ContentSection background="white" padding="lg" style={{ paddingTop: 100, paddingBottom: 0 }}>
        <Container maxWidth="none" className="max-w-[1000px]">
          <SectionHeader title={t('climateSnacks.title')} style={{ marginBottom: 36 }} />
          <TextBlock>
            {t('climateSnacks.description')}
          </TextBlock>
        </Container>
      </ContentSection>

      {/* Sessions Card List */}
      <ContentSection background="white" padding="lg" style={{ paddingTop: 60, paddingBottom: 120 }}>
        <Container maxWidth="none" className="max-w-[1100px]">
          <div className="flex flex-col items-center" style={{ gap: 52 }}>
            {climateSnacksSessions.map((session, index) => (
              <ClimateSnacksCard
                key={session.id}
                {...session}
                index={index}
              />
            ))}
          </div>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
