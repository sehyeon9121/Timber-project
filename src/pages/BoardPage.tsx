import { useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { BoardPostList } from '@/components/organisms/BoardPostList';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import type { BoardPostList as PostListData } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export function BoardPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1;
  const { data, loading, error, reload } = useBoardResource<PostListData>(`/board/posts?page=${page}`);
  const ko = language === 'KO';
  return <AuthLayout wide title={ko ? '게시판' : 'Member board'} description={ko ? '승인된 회원들이 소식과 자료를 나누는 회원 전용 게시판입니다.' : 'A private board where approved members can share updates and information.'}>
    <div className={styles.toolbar}>
      <span className={styles.toolbarText}>{data ? (ko ? `전체 ${data.total}개의 글` : `${data.total} posts`) : (ko ? '회원 전용' : 'Members only')}</span>
      <Link href="/board/new" className={styles.primary}>{ko ? '글쓰기' : 'Write a post'}</Link>
    </div>
    {loading ? <p role="status">{ko ? '게시글을 불러오는 중…' : 'Loading posts…'}</p>
      : error ? <>
        <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
        <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
      </> : data && <>
        <BoardPostList posts={data.posts} language={language} />
        {(data.totalPages > 1 || page > 1) && <nav className={styles.pagination} aria-label={ko ? '게시판 페이지' : 'Board pages'}>
          <Button className={styles.secondary} disabled={page <= 1} onClick={() => setSearchParams({ page: String(page - 1) })}>{ko ? '이전' : 'Previous'}</Button>
          <span>{page} / {data.totalPages}</span>
          <Button className={styles.secondary} disabled={page >= data.totalPages} onClick={() => setSearchParams({ page: String(page + 1) })}>{ko ? '다음' : 'Next'}</Button>
        </nav>}
      </>}
  </AuthLayout>;
}
