import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { PartnershipCard } from '@/components/organisms/PartnershipCard';
import { partnerships } from '@/data/partnerships';
import { useLanguage } from '@/contexts/LanguageContext';

export function ShowcasePage() {
  const { t } = useLanguage();

  const translationKeyMap: Record<string, string> = {
    academic: 'showcase.academic',
    research: 'showcase.research',
    industry: 'showcase.industry',
    demonstration: 'showcase.demonstration',
  };

  return (
    <DetailPageLayout
      title={t('showcase.heroTitle')}
      subtitle={t('showcase.heroSubtitle')}
      heroImage="/images/leeseunglab/Net.jpg?v=timber-network-20260927"
      heroMaxHeight={320}
    >
      <ContentSection
        background="light"
        padding="sm"
      >
        <Container maxWidth="none" padding="none" className="max-w-[1000px] flex flex-col gap-3">
          {partnerships.map((partnership) => {
            const key = translationKeyMap[partnership.id] || partnership.id;
            // images 배열의 alt/caption이 번역 키 형태(showcase.~)면 t()로 치환
            const translatedImages = partnership.images?.map((image) => ({
              ...image,
              alt: image.alt?.startsWith('showcase.') ? t(image.alt) : image.alt,
              caption: image.caption?.startsWith('showcase.')
                ? t(image.caption)
                : image.caption,
            }));
            return (
                <PartnershipCard
                  key={partnership.id}
                  title={t(`${key}.title`)}
                  description={t(`${key}.description`)}
                  icon={partnership.icon}
                  institutions={partnership.institutions}
                  images={translatedImages}
                />
            );
          })}
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
