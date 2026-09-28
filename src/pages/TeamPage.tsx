import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { DivisionTeamSection } from '@/components/organisms/DivisionTeamSection';
import { getTeamByDivision } from '@/data/teamMembers';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { TeamMemberCard } from '@/components/organisms/TeamMemberCard';

export function TeamPage({ participantsOnly = false }: { participantsOnly?: boolean }) {
  const { t, language } = useLanguage();
  const divisions = getTeamByDivision();

  return (
    <DetailPageLayout
      title={participantsOnly ? (language === 'KO' ? '참여연구원' : 'Participating Researchers') : t('team.title')}
      heroDescription={t('team.heroDescription')}
      heroImage="/images/leeseunglab/people-hero.jpg?v=timber-research-team-20260927"
      titleAlign="bottom-left"
    >
      <ContentSection background="white" padding="lg">
        <Container maxWidth="none" padding="none" className="max-w-[950px]">
          <div className="flex flex-col gap-16">
            {divisions.map((group) => participantsOnly ? (
              <section key={group.division}>
                <SectionHeader title={t(`team.division${group.division}`)} />
                {group.members.map((member, index) => (
                  <TeamMemberCard key={`${group.division}-${index}`} {...member} index={index} />
                ))}
              </section>
            ) : (
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
