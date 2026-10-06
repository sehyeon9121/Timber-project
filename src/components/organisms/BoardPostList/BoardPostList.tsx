import { Link } from '@/components/atoms/Link';
import type { BoardPostSummary } from '@/lib/board-api';
import { boardDate, boardDivisionLabel } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export interface BoardPostListProps { posts: BoardPostSummary[]; language: 'KO' | 'EN'; showDivision?: boolean; notice?: boolean }
export function BoardPostList({ posts, language, showDivision = false, notice = false }: BoardPostListProps) {
  const ko = language === 'KO';
  if (!posts.length) return <div className={styles.empty}>
    {notice ? (ko ? '등록된 공지사항이 없습니다.' : 'No notices have been published.') : (ko ? '등록된 게시글이 없습니다. 첫 번째 글을 작성해 보세요.' : 'No posts yet. Be the first to start a discussion.')}
  </div>;
  return <>
    <div className={styles.columnLabels} aria-hidden="true">
      <span>{ko ? '번호' : 'No.'}</span><span>{ko ? '제목' : 'Title'}</span>
      <span>{ko ? '작성자' : 'Author'}</span><span>{ko ? '작성일' : 'Posted'}</span>
    </div>
    <ul className={styles.rows}>
      {posts.map(post => <li key={post.id} className={styles.row}>
        <span className={styles.number}>{post.id}</span>
        <Link href={notice ? `/board/notices/${post.id}` : `/board/${post.id}`} className={styles.postTitle}>
          {notice && Boolean(post.pinned) && <span className={styles.noticeBadge}>{ko ? '중요' : 'Important'}</span>}
          {showDivision && <span className={styles.divisionBadge}>{boardDivisionLabel(post.division, language)}</span>}
          {post.title}
        </Link>
        <span className={styles.author}>{post.authorName}</span>
        <time className={styles.date} dateTime={post.createdAt}>{boardDate(post.createdAt, language)}</time>
      </li>)}
    </ul>
  </>;
}
