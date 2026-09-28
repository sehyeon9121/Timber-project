import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { AboutContent } from '@/components/organisms/AboutContent';
import { useLanguage } from '@/contexts/LanguageContext';

export function OverviewPage() {
  const { language, t } = useLanguage();
  return (
    <DetailPageLayout title={language === 'KO' ? '연구단 개요' : 'Project Overview'} noHeroImage>
      <AboutContent
        image="/images/leeseunglab/test-homepage.jpg"
        imageAlt={t('home.hero.title')}
        title={t('home.about.title')}
        description={t('home.about.description')}
      />
    </DetailPageLayout>
  );
}
