import { PageLayout } from '@/components/templates/PageLayout';
import { GridSection } from '@/components/templates/GridSection';
import { LandingHero } from '@/components/organisms/LandingHero';
import { AboutContent } from '@/components/organisms/AboutContent';
import { ResearchCard } from '@/components/organisms/ResearchCard';
import { ShowcaseSection } from '@/components/organisms/ShowcaseSection';
import { AffiliationsSection } from '@/components/organisms/AffiliationsSection';
import { Spacer } from '@/components/atoms/Spacer';
import { researchThemes } from '@/data/researchThemes';
import { useLanguage } from '@/contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();

  // 번역된 연구 주제 데이터
  const themeKeyMap: Record<string, string> = {
    'terrestrial-carbon': 'terrestrialCarbon',
    'natural-climate': 'naturalClimate',
    'smart-construction': 'smartConstruction',
    'energy-performance': 'energyPerformance',
  };

  const translatedResearchThemes = researchThemes.map((theme) => ({
    ...theme,
    title: t(`research.${themeKeyMap[theme.id] || theme.id}.title`),
    description: t(`research.${themeKeyMap[theme.id] || theme.id}.description`),
  }));

  return (
    <PageLayout>
      {/* Hero Section */}
      <LandingHero />

      <Spacer size="4xl" />

      {/* About Section - Lab Introduction */}
      <section id="about" className="bg-white py-24 md:py-32">
        <AboutContent
          image="/images/leeseunglab/test-homepage.jpg"
          imageAlt="Terrer Lab"
          imageTitle={t('home.about.imageTitle')}
          title={t('home.about.title')}
          description={t('home.about.description')}
        />
      </section>

      <Spacer size="4xl" />

      {/* Research Themes Section */}
      <GridSection
        id="research"
        title={t('home.research.title')}
        subtitle={t('home.research.subtitle')}
        columns={2}
        customGap={40}
        background="white"
        padding="xl"
        containerMaxWidth={1153}
      >
        {translatedResearchThemes.map((theme, index) => (
          <ResearchCard
            key={theme.id}
            id={theme.id}
            title={theme.title}
            description={theme.description}
            backgroundImage={theme.backgroundImage || '/images/leeseunglab/hero-background.jpg'}
            href={theme.href}
            index={index}
          />
        ))}
      </GridSection>


      <Spacer size="4xl" />

      {/* Showcase Section */}
      <ShowcaseSection
        title={t('home.showcase.title')}
        subtitle={t('home.showcase.subtitle')}
        image="/images/leeseunglab/hero-background.jpg"
        imageAlt="Showcase"
        boxTitle={t('home.showcase.boxTitle')}
        boxDescription={t('home.showcase.boxDesc')}
      />

      {/* Affiliations Section */}
      <AffiliationsSection />
    </PageLayout>
  );
}
