import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { Spacer } from '@/components/atoms/Spacer';
import { ShowcaseBlock } from '@/components/molecules/ShowcaseBlock';
import { useLanguage } from '@/contexts/LanguageContext';

export function ShowcasePage() {
  const { t } = useLanguage();

  const blocks = [
    {
      image: '/images/leeseunglab/hero-background.jpg',
      imageAlt: t('showcase.block1Title'),
      title: t('showcase.block1Title'),
      description: t('showcase.block1Desc'),
    },
    {
      image: '/images/leeseunglab/test-homepage.jpg',
      imageAlt: t('showcase.block2Title'),
      title: t('showcase.block2Title'),
      description: t('showcase.block2Desc'),
    },
    {
      image: '/images/leeseunglab/people-hero.jpg',
      imageAlt: t('showcase.block3Title'),
      title: t('showcase.block3Title'),
      description: t('showcase.block3Desc'),
    },
  ];

  return (
    <DetailPageLayout
      title={t('showcase.heroTitle')}
      subtitle={t('showcase.heroSubtitle')}
    >
      <ContentSection background="white" padding="lg">
        <Container maxWidth="none" className="max-w-[900px]">
          {blocks.map((block, index) => (
            <div key={index}>
              {index > 0 && <Spacer size="4xl" />}
              <ShowcaseBlock {...block} />
            </div>
          ))}
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
