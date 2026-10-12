import { ArrowLeft } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Image } from '@/components/atoms/Image';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { ActivityCard } from '@/components/molecules/ActivityCard';
import { ContentSection } from '@/components/templates/ContentSection';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { activities } from '@/data/activities';
import styles from './ActivitiesPage.module.css';

export function ActivitiesPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';

  return (
    <DetailPageLayout title={ko ? '연구단 활동' : 'Project Activities'} noHeroImage heroMaxHeight={180}>
      <ContentSection background="white" padding="lg" animate={false}>
        <Container maxWidth="none" padding="none" className={styles.container}>
          <Text as="p" className={styles.intro}>
            {ko ? '워크샵과 행사 등 연구단의 활동을 사진으로 전합니다.' : 'Photos and materials from our workshops and events.'}
          </Text>
          {activities.length ? (
            <ul className={styles.grid}>
              {activities.map(activity => (
                <li key={activity.id}><ActivityCard activity={activity} language={language} /></li>
              ))}
            </ul>
          ) : <Text as="p" className={styles.empty}>{ko ? '등록된 연구단 활동이 없습니다.' : 'No activities have been published yet.'}</Text>}
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const ko = language === 'KO';
  const locale = ko ? 'ko' : 'en';
  const activity = activities.find(item => item.id === id);

  if (!activity) return <Navigate to="/news/activities" replace />;

  return (
    <DetailPageLayout title={ko ? '연구단 활동' : 'Project Activities'} noHeroImage heroMaxHeight={180}>
      <ContentSection background="white" padding="lg" animate={false}>
        <Container maxWidth="none" padding="none" className={styles.container}>
          <Link href="/news/activities" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            {ko ? '목록으로' : 'Back to list'}
          </Link>
          <article>
            <header className={styles.articleHeader}>
              <Heading level={2} className={styles.articleTitle}>{activity.title[locale]}</Heading>
              <time className={styles.date} dateTime={activity.date}>{activity.date.replaceAll('-', '. ')}</time>
            </header>
            <div className={styles.photos}>
              {activity.images.map((photo, index) => (
                <Image key={`${photo.src}-${index}`} src={photo.src} alt={photo.alt[locale]} objectFit="contain" className={styles.photo} />
              ))}
            </div>
          </article>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
