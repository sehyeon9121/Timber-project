import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { DivisionTeamSection } from '@/components/organisms/DivisionTeamSection';
import { getTeamByDivision } from '@/data/teamMembers';
import { useLanguage } from '@/contexts/LanguageContext';

export function TeamPage() {
  const { t } = useLanguage();
  const divisions = getTeamByDivision();

  return (
    <DetailPageLayout
      title={t('team.title')}
      heroDescription={t('team.heroDescription')}
      heroImage="/images/leeseunglab/people-hero.png"
      titleAlign="bottom-left"
    >
      <ContentSection background="white" padding="lg" style={{ paddingTop: 100, paddingBottom: 40 }}>
        <Container maxWidth="none" className="max-w-[950px]">
          <div className="flex flex-col gap-16">
            {divisions.map((group) => (
              <DivisionTeamSection
                key={group.division}
                division={group.division}
                representative={group.representative}
                members={group.members}
              />
            ))}
          </div>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
