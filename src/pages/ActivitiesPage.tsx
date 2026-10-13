import { Navigate, useParams } from 'react-router-dom';
import { Image } from '@/components/atoms/Image';
import { Link } from '@/components/atoms/Link';
import { PageLayout } from '@/components/templates/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { activities } from '@/data/activities';
import styles from './ActivitiesPage.module.css';
import boardStyles from '@/styles/board.module.css';

export function ActivitiesPage() {
  return <Navigate to="/board" replace />;
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const ko = language === 'KO';
  const locale = ko ? 'ko' : 'en';
  const activity = activities.find(item => item.id === id);

  if (!activity) return <Navigate to="/board" replace />;

  return <PageLayout animate={false}>
    <article className={boardStyles.boardShell}>
      <header className={styles.articleHeader}>
        <Link href="/board" className={styles.backLink}>{ko ? '연구단 활동' : 'Project Activities'}</Link>
        <h1 className={styles.articleTitle}>{activity.title[locale]}</h1>
        <time className={styles.date} dateTime={activity.date}>{activity.date.replaceAll('-', '.')}</time>
      </header>
      <section className={styles.photos} aria-label={ko ? '활동 사진 및 자료' : 'Activity photos and materials'}>
        {activity.images.map((photo, index) => (
          <Image key={`${photo.src}-${index}`} src={photo.src} alt={photo.alt[locale]} objectFit="contain" className={styles.photo} />
        ))}
      </section>
      <footer className={styles.articleFooter}>
        <Link href="/board" className={boardStyles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
      </footer>
    </article>
  </PageLayout>;
}
