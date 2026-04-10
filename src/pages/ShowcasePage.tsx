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
            return (
              <div key={partnership.id}>
                {index > 0 && <Spacer size="xl" />}
                <PartnershipCard
                  title={t(`${key}.title`)}
                  description={t(`${key}.description`)}
                  icon={partnership.icon}
                  institutions={partnership.institutions}
                />
              </div>
            );
          })}
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
