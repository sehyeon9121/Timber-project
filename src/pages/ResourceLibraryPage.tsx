import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { PageLayout } from '@/components/templates/PageLayout';
import { Button } from '@/components/atoms/Button';
import { BoardPagination } from '@/components/molecules/BoardPagination';
import { ResourcePostList } from '@/components/organisms/ResourcePostList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/auth-context';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import type { BoardPostList } from '@/lib/board-api';
import { resourceCategories, resourceCategory, resourceInfo, resourceHref } from '@/lib/resource-library';
import board from '@/styles/board.module.css';
import styles from '@/styles/resources.module.css';

export function ResourceLibraryPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const category = resourceCategory(params.get('tab')) ?? 'reports';
  const ko = language === 'KO';
  const index = ko ? 0 : 1;
  const info = resourceInfo[category];
  const q = (params.get('q') ?? '').trim().slice(0, 120);
  const requested = Number(params.get('page') || 1);
  const page = Number.isSafeInteger(requested) && requested > 0 && requested <= 1000000 ? requested : 1;
  const { data, loading, error, reload } = useBoardResource<BoardPostList>(`/board/posts?category=${category}&page=${page}&q=${encodeURIComponent(q)}`);
  function search(query: string) { setParams({ tab: category, ...(query ? { q: query } : {}) }); }
  return <PageLayout animate={false}>
    <section className={`${board.boardShell} ${styles.shell}`} aria-labelledby="resources-title">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>WLSS · {ko ? '게시판' : 'BOARD'}</p>
        <h1 id="resources-title">{ko ? '연구단 자료실' : 'Research Library'}</h1>
        <p>{ko ? '연구의 기록부터 다음 작성을 위한 서식까지, 필요한 문서를 한곳에.' : 'Research records, shared resources, and templates — all in one place.'}</p>
      </header>
      <nav className={styles.tabs} aria-label={ko ? '자료실 선택' : 'Choose a library'}>
        {resourceCategories.map(item => <Link key={item} to={resourceHref(item)} aria-current={item === category ? 'page' : undefined} className={`${styles.tab} ${item === category ? styles.activeTab : ''}`}>{resourceInfo[item].label[index]}</Link>)}
      </nav>
      <section aria-labelledby="resource-section-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{category.toUpperCase()}</p><h2 id="resource-section-title">{info.label[index]}</h2><p>{info.description[index]}</p></div>
          {category === 'minutes' && <Link className={styles.templateLink} to={`${resourceHref('forms')}&q=${encodeURIComponent(ko ? '회의록' : 'minutes')}`}>{ko ? '회의록 양식 찾기' : 'Find minutes template'}<ArrowRight size={16} aria-hidden="true" /></Link>}
        </div>
        <form key={`${category}:${q}`} className={board.search} role="search" onSubmit={event => { event.preventDefault(); search(String(new FormData(event.currentTarget).get('q') ?? '').trim()); }}>
          <label htmlFor="resource-search">{ko ? '제목·내용 검색' : 'Search titles and content'}</label><input id="resource-search" type="search" name="q" defaultValue={q} maxLength={120} placeholder={ko ? `${info.label[0]} 검색` : `Search ${info.label[1].toLowerCase()}`} /><Button type="submit" className={board.secondary}>{ko ? '검색' : 'Search'}</Button>{q && <Button type="button" className={board.secondary} onClick={() => search('')}>{ko ? '전체 보기' : 'Clear search'}</Button>}
        </form>
        <div className={board.toolbar}><p className={board.toolbarText} role="status">{ko ? `${q ? '검색 결과' : '총'} ${data?.total ?? 0}건` : `${data?.total ?? 0} documents`}</p>{user && (category !== 'forms' || user.role === 'master') && <Link className={board.primary} to={`/board/new?category=${category}`}><Plus size={16} aria-hidden="true" /> {ko ? `${info.label[0]} 등록` : 'Add document'}</Link>}</div>
        {loading ? <p className={board.listStatus} role="status">{ko ? '문서를 불러오는 중…' : 'Loading documents…'}</p> : error ? <div><p className={board.error} role="alert">{authErrorMessage(error, language)}</p><Button className={board.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button></div> : data && <>
          {q && !data.total ? <p className={board.listStatus}>{ko ? '검색어와 일치하는 문서가 없습니다.' : 'No matching documents.'}</p> : <ResourcePostList posts={data.posts} category={category} ko={ko} />}
          <BoardPagination page={page} totalPages={data.totalPages} language={language} onPageChange={next => setParams({ tab: category, ...(q ? { q } : {}), page: String(next) })} />
        </>}
      </section>
    </section>
  </PageLayout>;
}
