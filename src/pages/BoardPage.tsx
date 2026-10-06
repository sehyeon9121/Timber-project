import { useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { BoardPostList } from '@/components/organisms/BoardPostList';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import { boardDivisions } from '@/lib/board-api';
import type { BoardPostList as PostListData } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export function BoardPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get('division');
  const division = boardDivisions.find(item => String(item) === selected);
  const showingAll = selected === 'all';
  const showingList = division !== undefined || showingAll;
  const requestedPage = Number(searchParams.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1;
  const { data, loading, error, reload } = useBoardResource<PostListData>(showingList
    ? `/board/posts?page=${page}${division ? `&division=${division}` : ''}` : null);
  const ko = language === 'KO';
  const title = division ? (ko ? `${division}세부 게시판` : `Division ${division} Board`)
    : (ko ? '세부별 활동 내용' : 'Division Activities');
  return <AuthLayout wide title={title} description={ko ? '각 세부의 활동 내용을 공유하는 회원 전용 게시판입니다.' : 'A members-only space for each division to share its activities.'}>
    {!showingList ? <>
      <div className={styles.divisionGrid}>
        {boardDivisions.map(item => <Link key={item} href={`/board?division=${item}`} className={styles.divisionCard}>
          <strong>{ko ? `${item}세부 게시판` : `Division ${item} Board`}</strong>
          <span>{ko ? '활동 내용 보기 및 글쓰기' : 'View activities and write posts'} →</span>
        </Link>)}
      </div>
      <Link href="/board?division=all" className={styles.allPostsLink}>{ko ? '전체 글 보기 (기존 글 포함)' : 'View all posts, including earlier posts'}</Link>
    </> : <>
    <nav className={styles.boardTabs} aria-label={ko ? '세부 게시판 선택' : 'Choose a division board'}>
      {boardDivisions.map(item => <Link key={item} href={`/board?division=${item}`}
        className={`${styles.boardTab} ${division === item ? styles.boardTabActive : ''}`}>
        {ko ? `${item}세부` : `Division ${item}`}
      </Link>)}
      <Link href="/board?division=all" className={`${styles.boardTab} ${showingAll ? styles.boardTabActive : ''}`}>
        {ko ? '전체 글' : 'All posts'}
      </Link>
    </nav>
    <div className={styles.toolbar}>
      <span className={styles.toolbarText}>{data ? (ko ? `전체 ${data.total}개의 글` : `${data.total} posts`) : (ko ? '회원 전용' : 'Members only')}</span>
      {division && <Link href={`/board/new?division=${division}`} className={styles.primary}>{ko ? '글쓰기' : 'Write a post'}</Link>}
    </div>
    {loading ? <p role="status">{ko ? '게시글을 불러오는 중…' : 'Loading posts…'}</p>
      : error ? <>
        <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
        <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
      </> : data && <>
        <BoardPostList posts={data.posts} language={language} showDivision={showingAll} />
        {(data.totalPages > 1 || page > 1) && <nav className={styles.pagination} aria-label={ko ? '게시판 페이지' : 'Board pages'}>
          <Button className={styles.secondary} disabled={page <= 1} onClick={() => setSearchParams({ division: selected!, page: String(page - 1) })}>{ko ? '이전' : 'Previous'}</Button>
          <span>{page} / {data.totalPages}</span>
          <Button className={styles.secondary} disabled={page >= data.totalPages} onClick={() => setSearchParams({ division: selected!, page: String(page + 1) })}>{ko ? '다음' : 'Next'}</Button>
        </nav>}
      </>}
    </>}
  </AuthLayout>;
}
