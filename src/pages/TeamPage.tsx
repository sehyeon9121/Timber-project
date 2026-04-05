import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { TeamMemberCard } from '@/components/organisms/TeamMemberCard';
import { OrganizationChart } from '@/components/organisms/OrganizationChart';
// import { AlumniCard } from '@/components/organisms/AlumniCard';  // 학부생 섹션 비활성화
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { teamMembers } from '@/data/teamMembers';
import { useLanguage } from '@/contexts/LanguageContext';

export function TeamPage() {
  const { t } = useLanguage();

  return (
    <DetailPageLayout
      title={t('team.title')}
      heroImage="/images/leeseunglab/people-hero.jpg"
    >
      {/* Organization Chart Section */}
      <ContentSection background="light" padding="lg" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <Container maxWidth="none" className="max-w-[900px]">
          <SectionHeader title="Organization" />
          <OrganizationChart className="mt-10" />
        </Container>
      </ContentSection>

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

      {/* Alumni (학부생 섹션 비활성화) */}
      {/* {alumni.length > 0 && (
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
      )} */}
    </DetailPageLayout>
  );
}
