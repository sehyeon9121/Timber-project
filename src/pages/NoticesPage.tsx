import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/templates/PageLayout';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/auth-context';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import type { BoardPostList as PostListData } from '@/lib/board-api';
import styles from '@/styles/board.module.css';
import cards from '@/styles/notice-cards.module.css';

export function NoticesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').slice(0, 120);
  const requestedPage = Number(params.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1;
  const { data, loading, error, reload } = useBoardResource<PostListData>(`/board/notices?page=${page}&q=${encodeURIComponent(q)}`);
  const ko = language === 'KO';
  const changePage = (next: number) => setParams({ ...(q ? { q } : {}), page: String(next) });

  return <PageLayout animate={false}><section className={styles.boardShell} aria-labelledby="notices-title">
    <header className={styles.boardHeading}>
      <p className={styles.eyebrow}>{ko ? '연구단 소식' : 'Project News'}</p>
      <h1 id="notices-title">{ko ? '연구단 공지사항' : 'Research Notices'}</h1>
      <p>{ko ? '연구단 운영 안내와 주요 일정을 확인하세요.' : 'Find research group announcements and upcoming schedules.'}</p>
    </header>
    <form key={q} className={styles.search} onSubmit={event => {
      event.preventDefault();
      const query = String(new FormData(event.currentTarget).get('q') ?? '').trim();
      setParams(query ? { q: query } : {});
    }}>
      <label htmlFor="notice-search">{ko ? '공지 제목 검색' : 'Search notice titles'}</label>
      <input id="notice-search" name="q" defaultValue={q} maxLength={120} placeholder={ko ? '검색어를 입력해 주세요' : 'Enter a search term'} />
      <Button type="submit" className={styles.secondary}>{ko ? '검색' : 'Search'}</Button>
      {q && <Button type="button" className={styles.secondary} onClick={() => setParams({})}>{ko ? '초기화' : 'Reset'}</Button>}
    </form>
    <div className={styles.toolbar}>
      <span className={styles.toolbarText}>{data ? (ko ? `${q ? '검색 결과' : '전체'} ${data.total}개의 공지` : `${data.total} notices${q ? ' found' : ''}`) : (ko ? '회원 전용 공지' : 'Members-only notices')}</span>
      {user?.role === 'master' && <Link href="/board/notices/new" className={styles.primary}>{ko ? '공지사항 작성' : 'Write a notice'}</Link>}
    </div>
    {loading ? <p role="status">{ko ? '공지사항을 불러오는 중…' : 'Loading notices…'}</p> : error ? <>
      <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
      <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
    </> : data && <>
      {data.posts.length === 0 ? <p className={styles.listStatus}>{q
        ? (ko ? '검색어와 일치하는 공지사항이 없습니다.' : 'No notices match your search.')
        : (ko ? '등록된 공지사항이 없습니다.' : 'No notices have been published.')}</p>
        : <ul className={cards.grid} aria-label={ko ? '공지사항 카드 목록' : 'Notice cards'}>
          {data.posts.map(post => <li key={post.id}>
            <Link href={`/board/notices/${post.id}`} className={cards.card}>
              {post.coverImageId ? <img className={cards.image}
                src={`/api/board/notices/${post.id}/attachments/${post.coverImageId}/content?preview=1`}
                alt="" loading="lazy" decoding="async" />
                : <span className={cards.placeholder}>{ko ? '연구단 공지' : 'Research Notice'}</span>}
              <h2 className={cards.title}>{post.title}</h2>
            </Link>
          </li>)}
        </ul>}
      {(data.totalPages > 1 || page > 1) && <nav className={styles.pagination} aria-label={ko ? '공지사항 페이지' : 'Notice pages'}>
        <Button className={styles.secondary} disabled={page <= 1} onClick={() => changePage(page - 1)}>{ko ? '이전' : 'Previous'}</Button>
        <span>{page} / {data.totalPages}</span>
        <Button className={styles.secondary} disabled={page >= data.totalPages} onClick={() => changePage(page + 1)}>{ko ? '다음' : 'Next'}</Button>
      </nav>}
    </>}
  </section></PageLayout>;
}
