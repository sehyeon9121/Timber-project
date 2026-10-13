import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { GridSection } from '@/components/templates/GridSection';
import { ContentSection } from '@/components/templates/ContentSection';
import { ResearchThemeCard } from '@/components/organisms/ResearchThemeCard';
import { Paragraph } from '@/components/atoms/Paragraph';
import { researchThemes } from '@/data/researchThemes';
import { useLanguage } from '@/contexts/LanguageContext';

export function ResearchPage() {
  const { t } = useLanguage();
  const themeKeys: Record<string, string> = {
    'terrestrial-carbon': 'terrestrialCarbon',
    'natural-climate': 'naturalClimate',
    'smart-construction': 'smartConstruction',
    'energy-performance': 'energyPerformance',
  };

  // 번역된 연구 주제 데이터
  const translatedResearchThemes = researchThemes.map((theme) => ({
    ...theme,
    title: t(`research.${themeKeys[theme.id]}.title`),
    description: t(`research.${themeKeys[theme.id]}.description`),
  }));

  return (
    <DetailPageLayout
      title={t('research.title')}
      subtitle={t('research.subtitle')}
    >
      {/* Introduction */}
      <ContentSection background="white" padding="md">
        <div className="max-w-3xl">
          <Paragraph color="light" size="lg" className="leading-relaxed">
            {t('research.intro')}
          </Paragraph>
        </div>
      </ContentSection>

      {/* Research Themes */}
      <GridSection
        title={t('research.themesTitle')}
        columns={2}
        gap="lg"
        background="light"
        padding="lg"
      >
        {translatedResearchThemes.map((theme, index) => (
          <ResearchThemeCard
            key={theme.id}
            {...theme}
            index={index}
          />
        ))}
      </GridSection>

    </DetailPageLayout>
  );
}
