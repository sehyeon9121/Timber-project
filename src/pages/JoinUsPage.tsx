import { motion } from 'framer-motion';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Container } from '@/components/atoms/Container';
import { TextBlock } from '@/components/atoms/TextBlock';
import { JoinUsCallToAction } from '@/components/molecules/JoinUsCallToAction';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { BelongingStatement } from '@/components/molecules/BelongingStatement';
import { useLanguage } from '@/contexts/LanguageContext';

export function JoinUsPage() {
  const { t } = useLanguage();

  return (
    <DetailPageLayout
      title={t('joinUs.title')}
      subtitle={t('joinUs.subtitle')}
      heroImage="/images/leeseunglab/joinus-hero.jpg"
    >
      <div style={{ height: 60 }} />

      {/* Call to Action */}
      <ContentSection background="white" padding="lg" style={{ paddingBottom: 76 }}>
        <Container maxWidth="none" className="max-w-[840px]">
          <JoinUsCallToAction />
        </Container>
      </ContentSection>

      {/* Values Section */}
      <ContentSection background="light" padding="lg" style={{ paddingBottom: 76 }}>
        <Container maxWidth="none" className="max-w-[840px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            <SectionHeader
              title={t('joinUs.values')}
              headingClassName="text-[#00380A]"
              headingStyle={{ fontWeight: 700, letterSpacing: '0.05em', marginBottom: 20 }}
              style={{ marginBottom: 36 }}
            />
            <TextBlock>
              {t('joinUs.valuesIntro')}
            </TextBlock>
            <br />
            <TextBlock style={{ marginBottom: 25 }}>
              {t('joinUs.valuesDescription')}
            </TextBlock>
            <img
              src="/leeseunglab/images/leeseunglab/valuemit.png"
              alt="MIT Values"
              className="w-full rounded-lg"
            />
          </motion.div>
        </Container>
      </ContentSection>

      {/* Belonging Statement */}
      <ContentSection background="light" padding="lg" style={{ paddingBottom: 120 }}>
        <Container maxWidth="none" className="max-w-[840px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            <BelongingStatement />
          </motion.div>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
