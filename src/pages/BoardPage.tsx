import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/templates/PageLayout';
import { BoardPostList } from '@/components/organisms/BoardPostList';
import { BoardPagination } from '@/components/molecules/BoardPagination';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/auth-context';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import { boardDivisions, boardDivisionLabel, boardListHref, boardPageWithArchive } from '@/lib/board-api';
import type { BoardPostList as PostListData } from '@/lib/board-api';
import { activities } from '@/data/activities';
import styles from '@/styles/board.module.css';

export function BoardPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get('division');
  const division = boardDivisions.find(item => String(item) === selected) ?? null;
  const q = (searchParams.get('q') ?? '').trim().slice(0, 120);
  const requestedPage = Number(searchParams.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1;
  const { data, loading, error, reload } = useBoardResource<PostListData>(
    `/board/posts?page=${page}&division=${division ?? 'activities'}&q=${encodeURIComponent(q)}`);
  const ko = language === 'KO';
  const locale = ko ? 'ko' : 'en';
  const archivedPosts = division === null ? activities.filter(activity =>
    activity.title.ko.toLowerCase().includes(q.toLowerCase()) || activity.title.en.toLowerCase().includes(q.toLowerCase())).map(activity => ({
    id: `activity-${activity.id}`, href: `/board/activities/${activity.id}`,
    title: activity.title[locale], authorId: 0, authorName: ko ? '연구단' : 'Research Group',
    division: null, createdAt: activity.date, updatedAt: activity.date,
  })) : [];
  const list = data ? boardPageWithArchive(data, archivedPosts) : null;
  const title = boardDivisionLabel(division, language);
  function search(query: string) {
    setSearchParams({ ...(division !== null ? { division: String(division) } : {}), ...(query ? { q: query } : {}) });
  }
  function goToPage(next: number) {
    setSearchParams({ ...(division !== null ? { division: String(division) } : {}), ...(q ? { q } : {}), page: String(Math.max(1, Math.min(next, list?.totalPages ?? next))) });
  }

  return <PageLayout animate={false}>
    <section className={styles.boardShell} aria-labelledby="board-title">
      <header className={styles.boardHeading}>
        <p className={styles.eyebrow}>{ko ? '연구단 소식' : 'Project News'}</p>
        <h1 id="board-title">{title}</h1>
        <p>{ko ? '연구단과 각 세부의 활동 소식을 공유합니다.' : 'Activities and updates from the research group and its divisions.'}</p>
      </header>
      <nav className={styles.boardTabs} aria-label={ko ? '게시판 선택' : 'Choose a board'}>
        {[null, ...boardDivisions].map(item => {
          const active = division === item;
          return <RouterLink key={item ?? 'activities'} to={boardListHref(item)}
            aria-current={active ? 'page' : undefined}
            className={`${styles.boardTab} ${active ? styles.boardTabActive : ''}`}>
            {boardDivisionLabel(item, language)}
          </RouterLink>;
        })}
      </nav>
      <form key={`${selected ?? 'activities'}:${q}`} className={styles.search} role="search" onSubmit={event => {
        event.preventDefault();
        search(String(new FormData(event.currentTarget).get('q') ?? '').trim());
      }}>
        <label htmlFor="board-search">{ko ? '제목·내용 검색' : 'Search titles and content'}</label>
        <input id="board-search" name="q" type="search" defaultValue={q} maxLength={120} placeholder={ko ? '검색어를 입력해 주세요' : 'Enter a search term'} />
        <Button type="submit" className={styles.secondary}>{ko ? '검색' : 'Search'}</Button>
        {q && <Button type="button" className={styles.secondary} onClick={() => search('')}>{ko ? '전체 보기' : 'Clear search'}</Button>}
      </form>
      <div className={styles.toolbar}>
        <p className={styles.toolbarText} role="status">{list ? (ko ? `${q ? '검색 결과' : '총'} ${list.total}건` : `${list.total} posts${q ? ' found' : ''}`) : (ko ? '게시글 목록' : 'Posts')}</p>
        {user && <Link href={division !== null ? `/board/new?division=${division}` : '/board/new'} className={styles.primary}>
          {ko ? '글쓰기' : 'Write a post'}
        </Link>}
      </div>
      {loading ? <p className={styles.listStatus} role="status">{ko ? '게시글을 불러오는 중…' : 'Loading posts…'}</p>
        : error ? <>
          <p className={styles.error} role="alert">{authErrorMessage(error, language)}</p>
          <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
        </> : list && <>
          {q && list.total === 0 ? <p className={styles.listStatus}>{ko ? '검색어와 일치하는 게시글이 없습니다.' : 'No posts match your search.'}</p>
            : <BoardPostList posts={list.posts} language={language} startNumber={list.total - (page - 1) * list.pageSize} />}
          <BoardPagination page={page} totalPages={list.totalPages} language={language} onPageChange={goToPage} />
        </>}
    </section>
  </PageLayout>;
}
