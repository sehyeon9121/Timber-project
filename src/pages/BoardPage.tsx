import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/templates/PageLayout';
import { BoardPostList } from '@/components/organisms/BoardPostList';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import { boardDivisions, boardDivisionLabel, boardListHref, boardPageWithArchive } from '@/lib/board-api';
import type { BoardPostList as PostListData } from '@/lib/board-api';
import { activities } from '@/data/activities';
import styles from '@/styles/board.module.css';

export function BoardPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get('division');
  const division = boardDivisions.find(item => String(item) === selected) ?? null;
  const showingAll = selected === 'all';
  const requestedPage = Number(searchParams.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1;
  const { data, loading, error, reload } = useBoardResource<PostListData>(
    `/board/posts?page=${page}${showingAll ? '' : `&division=${division ?? 'activities'}`}`);
  const ko = language === 'KO';
  const locale = ko ? 'ko' : 'en';
  const archivedPosts = division === null || showingAll ? activities.map(activity => ({
    id: `activity-${activity.id}`, href: `/board/activities/${activity.id}`,
    title: activity.title[locale], authorId: 0, authorName: ko ? '연구단' : 'Research Group',
    division: null, createdAt: activity.date, updatedAt: activity.date,
  })) : [];
  const list = data ? boardPageWithArchive(data, archivedPosts) : null;
  const title = showingAll ? (ko ? '전체 글' : 'All posts') : boardDivisionLabel(division, language);
  function goToPage(next: number) {
    setSearchParams({ ...(showingAll ? { division: 'all' } : division !== null ? { division: String(division) } : {}), page: String(next) });
  }

  return <PageLayout animate={false}>
    <section className={styles.boardShell} aria-labelledby="board-title">
      <header className={styles.boardHeading}>
        <p className={styles.eyebrow}>{ko ? '게시판' : 'Member Board'}</p>
        <h1 id="board-title">{title}</h1>
        <p>{ko ? '연구단과 각 세부의 활동 소식을 공유합니다.' : 'Activities and updates from the research group and its divisions.'}</p>
      </header>
      <nav className={styles.boardTabs} aria-label={ko ? '게시판 선택' : 'Choose a board'}>
        {[null, ...boardDivisions].map(item => {
          const active = !showingAll && division === item;
          return <RouterLink key={item ?? 'activities'} to={boardListHref(item)}
            aria-current={active ? 'page' : undefined}
            className={`${styles.boardTab} ${active ? styles.boardTabActive : ''}`}>
            {boardDivisionLabel(item, language)}
          </RouterLink>;
        })}
        <RouterLink to="/board?division=all" aria-current={showingAll ? 'page' : undefined}
          className={`${styles.boardTab} ${showingAll ? styles.boardTabActive : ''}`}>
          {ko ? '전체 글' : 'All posts'}
        </RouterLink>
      </nav>
      <div className={styles.toolbar}>
        <p className={styles.toolbarText}>{list ? (ko ? `총 ${list.total}건` : `${list.total} posts`) : (ko ? '게시글 목록' : 'Posts')}</p>
        <Link href={division !== null && !showingAll ? `/board/new?division=${division}` : '/board/new'} className={styles.primary}>
          {ko ? '글쓰기' : 'Write a post'}
        </Link>
      </div>
      {loading ? <p className={styles.listStatus} role="status">{ko ? '게시글을 불러오는 중…' : 'Loading posts…'}</p>
        : error ? <>
          <p className={styles.error} role="alert">{authErrorMessage(error, language)}</p>
          <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
        </> : list && <>
          <BoardPostList posts={list.posts} language={language} showDivision={showingAll} startNumber={list.total - (page - 1) * list.pageSize} />
          {(list.totalPages > 1 || page > 1) && <nav className={styles.pagination} aria-label={ko ? '게시판 페이지' : 'Board pages'}>
            <Button className={styles.secondary} disabled={page <= 1} onClick={() => goToPage(page - 1)}>{ko ? '이전' : 'Previous'}</Button>
            <span aria-live="polite">{page} / {list.totalPages}</span>
            <Button className={styles.secondary} disabled={page >= list.totalPages} onClick={() => goToPage(page + 1)}>{ko ? '다음' : 'Next'}</Button>
          </nav>}
        </>}
    </section>
  </PageLayout>;
}
