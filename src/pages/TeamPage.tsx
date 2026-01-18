import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { TeamMemberCard } from '@/components/organisms/TeamMemberCard';
import { AlumniCard } from '@/components/organisms/AlumniCard';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { teamMembers, alumni } from '@/data/teamMembers';
import { useLanguage } from '@/contexts/LanguageContext';

export function TeamPage() {
  const { t } = useLanguage();

  return (
    <DetailPageLayout
      title={t('team.title')}
      heroImage="/images/leeseunglab/people-hero.png"
    >
      {/* Team Section */}
      <ContentSection background="white" padding="lg" style={{ paddingTop: 100 }}>
        <Container maxWidth="none" className="max-w-[950px]">
          <SectionHeader title={t('team.team')} />
          <div>
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                {...member}
                index={index}
              />
            ))}
          </div>
        </Container>
      </ContentSection>

      {/* Alumni */}
      {alumni.length > 0 && (
        <ContentSection
          background="white"
          padding="lg"
          style={{ paddingTop: 120, paddingBottom: 240 }}
        >
          <Container maxWidth="none" className="max-w-[950px]">
            <SectionHeader title={t('team.alumni')} style={{ marginBottom: 40 }} />
            <div className="flex flex-wrap gap-6">
              {alumni.map((member, index) => (
                <AlumniCard
                  key={member.id}
                  {...member}
                  index={index}
                />
              ))}
            </div>
          </Container>
        </ContentSection>
      )}
    </DetailPageLayout>
  );
}
