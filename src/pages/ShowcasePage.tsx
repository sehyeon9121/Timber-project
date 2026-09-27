import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { Spacer } from '@/components/atoms/Spacer';
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
      heroImage="/images/leeseunglab/Net.jpg"
    >
      <ContentSection
        background="white"
        padding="lg"
        className="!pt-[20px] !pb-[20px] md:!pt-[20px] md:!pb-[20px]"
      >
        <Container maxWidth="none" className="max-w-[1100px]">
          {partnerships.map((partnership, index) => {
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
              <div key={partnership.id}>
                {index > 0 && <Spacer size="xl" />}
                <PartnershipCard
                  title={t(`${key}.title`)}
                  description={t(`${key}.description`)}
                  icon={partnership.icon}
                  institutions={partnership.institutions}
                  images={translatedImages}
                />
              </div>
            );
          })}
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
