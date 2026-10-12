import type { LocalizedText } from '@/types';
import activityData from '@content/activities/activities.yaml';

export interface ActivityImage {
  src: string;
  alt: LocalizedText;
}

export interface Activity {
  id: string;
  title: LocalizedText;
  date: string;
  images: ActivityImage[];
}

export const activities: Activity[] = ((activityData ?? []) as Activity[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));
