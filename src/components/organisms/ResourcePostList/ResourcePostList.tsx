import { FileText, FolderOpen, CalendarDays, Files } from 'lucide-react';
import { BoardPostList } from '@/components/organisms/BoardPostList';
import type { BoardPostSummary } from '@/lib/board-api';
import type { ResourceCategory } from '@/lib/resource-library';
import { resourceInfo } from '@/lib/resource-library';
import styles from '@/styles/resources.module.css';

interface ResourcePostListProps { posts: BoardPostSummary[]; category: ResourceCategory; ko: boolean; startNumber: number }
export function ResourcePostList({ posts, category, ko, startNumber }: ResourcePostListProps) {
  const index = ko ? 0 : 1;
  const Icon = category === 'reports' ? FileText : category === 'materials' ? FolderOpen : category === 'minutes' ? CalendarDays : Files;
  if (!posts.length) return <div className={styles.empty}><Icon size={36} strokeWidth={1.3} aria-hidden="true" /><h3>{resourceInfo[category].empty[index]}</h3><p>{ko ? '새 문서가 등록되면 이곳에서 확인할 수 있습니다.' : 'New documents will appear here when published.'}</p></div>;
  return <BoardPostList posts={posts} language={ko ? 'KO' : 'EN'} startNumber={startNumber} />;
}
