import { Heading } from '@/components/atoms/Heading';
import { Image } from '@/components/atoms/Image';
import { Link } from '@/components/atoms/Link';
import type { Activity } from '@/data/activities';
import styles from './ActivityCard.module.css';

export interface ActivityCardProps {
  activity: Activity;
  language: 'KO' | 'EN';
}

export function ActivityCard({ activity, language }: ActivityCardProps) {
  const locale = language === 'KO' ? 'ko' : 'en';
  const cover = activity.images[0];

  return (
    <article className={styles.card}>
      <Link href={`/board/activities/${activity.id}`} className={styles.link}>
        <div className={styles.cover}>
          {cover && <Image src={cover.src} alt={cover.alt[locale]} objectFit="contain" className={styles.image} />}
        </div>
        <div className={styles.caption}>
          <Heading level={2} className={styles.title}>{activity.title[locale]}</Heading>
          <time className={styles.date} dateTime={activity.date}>{activity.date.replaceAll('-', '. ')}</time>
        </div>
      </Link>
    </article>
  );
}
