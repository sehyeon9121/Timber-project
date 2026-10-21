import { Link } from '@/components/atoms/Link';
import type { BoardListEntry } from '@/lib/board-api';
import { boardDivisionLabel } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export interface BoardPostListProps { posts: BoardListEntry[]; language: 'KO' | 'EN'; showDivision?: boolean; notice?: boolean; startNumber?: number }
export function BoardPostList({ posts, language, showDivision = false, notice = false, startNumber }: BoardPostListProps) {
  const ko = language === 'KO';
  return <table className={styles.postTable}>
    <caption className={styles.srOnly}>{ko ? '등록된 게시글 목록' : 'Published posts'}</caption>
    <thead><tr>
      <th scope="col" className={styles.numberColumn}>{ko ? '번호' : 'No.'}</th>
      <th scope="col">{ko ? '제목' : 'Title'}</th>
      <th scope="col" className={styles.authorColumn}>{ko ? '작성자' : 'Author'}</th>
      <th scope="col" className={styles.dateColumn}>{ko ? '작성일' : 'Posted'}</th>
      <th scope="col" className={styles.viewsColumn}>{ko ? '조회수' : 'Views'}</th>
    </tr></thead>
    <tbody>
      {!posts.length && <tr><td colSpan={5} className={styles.empty}>
        {notice ? (ko ? '등록된 공지사항이 없습니다.' : 'No notices have been published.') : (ko ? '등록된 게시글이 없습니다.' : 'No posts have been published.')}
      </td></tr>}
      {posts.map((post, index) => <tr key={post.id}>
        <td className={styles.number}>{startNumber === undefined ? post.id : startNumber - index}</td>
        <td className={styles.titleCell}><Link href={post.href ?? (notice ? `/board/notices/${post.id}` : `/board/${post.id}`)} className={styles.postTitle}>
          {notice && Boolean(post.pinned) && <span className={styles.noticeBadge}>{ko ? '중요' : 'Important'}</span>}
          {showDivision && <span className={styles.divisionBadge}>{boardDivisionLabel(post.division, language)}</span>}
          {post.title}
        </Link></td>
        <td className={styles.author}>{post.authorName}</td>
        <td className={styles.date}><time dateTime={post.createdAt}>{post.createdAt.slice(0, 10).replaceAll('-', '.')}</time></td>
        <td className={styles.views}>{post.viewCount === undefined
          ? <span aria-label={ko ? '조회수 집계 안 됨' : 'Views not tracked'}>—</span>
          : post.viewCount.toLocaleString(ko ? 'ko-KR' : 'en-US')}</td>
      </tr>)}
    </tbody>
  </table>;
}
