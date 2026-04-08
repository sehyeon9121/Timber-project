import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { Spacer } from '@/components/atoms/Spacer';
import { PartnershipCard } from '@/components/organisms/PartnershipCard';
import { partnerships } from '@/data/partnerships';

export function ShowcasePage() {
  return (
    <DetailPageLayout
      title="협력 네트워크"
      subtitle="학술·연구·산업 파트너십"
      heroImage="/images/leeseunglab/Net.jpg"
    >
      <ContentSection
        background="white"
        padding="lg"
        className="!pt-[20px] !pb-[20px] md:!pt-[20px] md:!pb-[20px]"
      >
        <Container maxWidth="none" className="max-w-[1100px]">
          {partnerships.map((partnership, index) => (
            <div key={partnership.id}>
              {index > 0 && <Spacer size="xl" />}
              <PartnershipCard
                title={partnership.title}
                description={partnership.description}
                icon={partnership.icon}
                institutions={partnership.institutions}
              />
            </div>
          ))}
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
