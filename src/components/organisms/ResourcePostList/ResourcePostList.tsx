import { FileText, FolderOpen, CalendarDays, Download, ArrowUpRight, Files } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BoardPostSummary } from '@/lib/board-api';
import type { ResourceCategory } from '@/lib/resource-library';
import { resourceInfo } from '@/lib/resource-library';
import styles from '@/styles/resources.module.css';

interface ResourcePostListProps { posts: BoardPostSummary[]; category: ResourceCategory; ko: boolean }
export function ResourcePostList({ posts, category, ko }: ResourcePostListProps) {
  const index = ko ? 0 : 1;
  const Icon = category === 'reports' ? FileText : category === 'materials' ? FolderOpen : category === 'minutes' ? CalendarDays : Files;
  if (!posts.length) return <div className={styles.empty}><Icon size={36} strokeWidth={1.3} aria-hidden="true" /><h3>{resourceInfo[category].empty[index]}</h3><p>{ko ? '새 문서가 등록되면 이곳에서 확인할 수 있습니다.' : 'New documents will appear here when published.'}</p></div>;
  return <div className={`${styles.postList} ${styles[category]}`}>
    {posts.map(post => <article className={styles.post} key={post.id}>
      <div className={styles.postContent}>
        <div className={styles.postMeta}><span className={styles.badge}>{post.documentType || resourceInfo[category].label[index]}</span>
          {category === 'minutes' && post.meetingDate && <time dateTime={post.meetingDate}>{ko ? '회의일 ' : 'Meeting '}{post.meetingDate}</time>}
        </div>
        <h3><Link to={`/board/${post.id}`}>{post.title}<ArrowUpRight size={16} aria-hidden="true" /></Link></h3>
        {category === 'materials' && post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        <div className={styles.postMeta}><span>{post.authorName}</span><span>{ko ? '등록일 ' : 'Posted '}{post.createdAt.slice(0, 10)}</span></div>
        <div className={styles.fileLinks}>
          {(post.attachments ?? []).map(file => <a key={file.id} href={`/api/board/posts/${post.id}/attachments/${file.id}/content`} download>
            <Download size={14} aria-hidden="true" /><span>{file.name}</span><small>{file.name.split('.').pop()?.toUpperCase()}</small>
          </a>)}
          {!post.attachments?.length && <span className={styles.noFile}>{ko ? '첨부파일 없음' : 'No attachments'}</span>}
        </div>
      </div>
    </article>)}
  </div>;
}
