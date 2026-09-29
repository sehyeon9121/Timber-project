import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/templates/PageLayout';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage, ApiError } from '@/lib/auth-api';
import type { User } from '@/lib/auth-api';
import styles from '@/styles/auth.module.css';
import adminStyles from '@/styles/admin.module.css';

export function AdminPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const membersView = searchParams.get('view') === 'members';
  const ko = language === 'KO';
  const labels = { pending: ko ? '승인 대기' : 'Pending', approved: ko ? '승인 완료' : 'Approved', rejected: ko ? '거절' : 'Rejected' };
  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await authApi<{ users: User[] }>('/admin/users'); setUsers(data.users); setError(null); }
    catch (cause) { setError(cause); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    authApi<{ users: User[] }>('/admin/users').then(data => { if (active) setUsers(data.users); })
      .catch(cause => { if (active) setError(cause); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function review(user: User, status: 'approved' | 'rejected') {
    setBusy(user.id);
    setNotice('');
    setError(null);
    try {
      const data = await authApi<{ user: User }>(`/admin/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setUsers(current => current.map(item => item.id === user.id ? data.user : item));
      setNotice(ko ? `${user.name}님의 가입 요청을 ${status === 'approved' ? '승인' : '거절'}했습니다.` : `${user.name}'s request was ${status}.`);
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === 'ALREADY_REVIEWED') await load();
      setError(cause);
    } finally { setBusy(null); }
  }
  const search = query.trim().toLocaleLowerCase();
  const visible = users.filter(user =>
    (membersView ? filter === 'all' || user.status === filter : user.status === 'pending') &&
    (!membersView || `${user.name} ${user.username} ${user.email} ${user.affiliation}`.toLocaleLowerCase().includes(search))
  );
  const date = (value: string) => new Date(value).toLocaleString(ko ? 'ko-KR' : 'en-US');
  const pendingCount = users.filter(user => user.status === 'pending').length;
  return <PageLayout animate={false}>
    <section className={adminStyles.shell}>
      <header className={adminStyles.heading}>
        <Heading level={1}>{ko ? '관리자 설정' : 'Admin settings'}</Heading>
        <p>{ko ? '가입 요청을 검토하고 등록된 회원 정보를 확인하세요.' : 'Review registration requests and browse registered members.'}</p>
      </header>
      <div className={adminStyles.summary}>
        {(['pending', 'approved', 'rejected'] as const).map(status => <div key={status}>
          <span>{labels[status]}</span><strong>{users.filter(user => user.status === status).length}</strong>
        </div>)}
      </div>
      <div className={adminStyles.workspace}>
        <nav className={adminStyles.sidebar} aria-label={ko ? '관리자 메뉴' : 'Admin menu'}>
          <button type="button" aria-current={!membersView ? 'page' : undefined} onClick={() => setSearchParams({})}>
            <Icon name="UserCheck" size={18} /><span>{ko ? '가입 승인' : 'Registration approval'}</span><span className={adminStyles.count}>{pendingCount}</span>
          </button>
          <button type="button" aria-current={membersView ? 'page' : undefined} onClick={() => setSearchParams({ view: 'members' })}>
            <Icon name="Users" size={18} /><span>{ko ? '회원 명단' : 'Member directory'}</span>
          </button>
        </nav>
        <div className={adminStyles.panel}>
          <Heading level={2}>{membersView ? (ko ? '회원 명단' : 'Member directory') : (ko ? '가입 승인' : 'Registration approval')}</Heading>
          <p className={adminStyles.intro}>{membersView ? (ko ? '이름, 아이디, 이메일, 소속과 가입 상태를 확인할 수 있습니다.' : 'View names, usernames, emails, affiliations, and registration status.') : (ko ? '승인 대기 중인 가입 요청을 검토하세요.' : 'Review pending registration requests.')}</p>
    <div className={styles.filters}>
      {membersView && <>
      <label className={adminStyles.search} htmlFor="member-search">{ko ? '회원 검색' : 'Search members'}
        <input id="member-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={ko ? '이름, 아이디, 이메일, 소속 검색' : 'Name, username, email, or affiliation'} />
      </label>
      <label htmlFor="status-filter">{ko ? '가입 상태 ' : 'Status '}</label>
      <select id="status-filter" value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="pending">{labels.pending} ({users.filter(user => user.status === 'pending').length})</option>
        <option value="approved">{labels.approved}</option>
        <option value="rejected">{labels.rejected}</option>
        <option value="all">{ko ? '전체' : 'All'}</option>
      </select>
      </>}
      <Button variant="outline" size="sm" disabled={loading || busy !== null} onClick={() => { setNotice(''); void load(); }}>{ko ? '새로고침' : 'Refresh'}</Button>
    </div>
    {notice && <div role="status" className={styles.notice}>{notice}</div>}
    {Boolean(error) && <div role="alert" className={styles.error}>{authErrorMessage(error, language)}</div>}
    {loading ? <p role="status">{ko ? '회원 정보를 불러오는 중…' : 'Loading members…'}</p> : <>
      {membersView && !error && <p className={adminStyles.result} role="status">{ko ? `총 ${users.length}명 중 ${visible.length}명 표시` : `Showing ${visible.length} of ${users.length} members`}</p>}
      {!error && visible.length === 0 && <div className={styles.notice}>{membersView ? (ko ? '조건에 맞는 회원이 없습니다.' : 'No matching members.') : (ko ? '승인 대기 중인 가입 요청이 없습니다.' : 'No pending registration requests.')}</div>}
      {membersView ? visible.length > 0 && <div className={adminStyles.tableWrap} tabIndex={0} role="region" aria-label={ko ? '회원 명단 표' : 'Member directory table'}>
        <table className={adminStyles.table}>
          <caption className="sr-only">{ko ? '등록된 회원의 이름, 아이디, 이메일, 소속, 가입 상태와 신청일' : 'Registered member names, usernames, emails, affiliations, status, and registration dates'}</caption>
          <thead><tr>{(ko ? ['이름', '아이디', '이메일', '소속', '가입 상태', '신청일'] : ['Name', 'Username', 'Email', 'Affiliation', 'Status', 'Registered']).map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{visible.map(user => <tr key={user.id}>
            <td>{user.name}</td><td>{user.username}</td><td>{user.email}</td><td>{user.affiliation}</td>
            <td><span className={`${styles.badge} ${styles[user.status]}`}>{labels[user.status]}</span></td>
            <td>{new Date(user.createdAt).toLocaleDateString(ko ? 'ko-KR' : 'en-US')}</td>
          </tr>)}</tbody>
        </table>
      </div> : <ul className={styles.requests}>
        {visible.map(user => <li key={user.id} className={styles.request}>
          <div className={styles.requestInfo}>
            <Heading level={2}>{user.name}</Heading>
            <p>{ko ? '아이디: ' : 'Username: '}{user.username}</p><p>{user.email}</p><p>{user.affiliation}</p>
            <p>{ko ? '신청일: ' : 'Requested: '}{date(user.createdAt)}</p>
            {user.reviewedAt && <p>{ko ? '처리일: ' : 'Reviewed: '}{date(user.reviewedAt)}</p>}
          </div>
          <div className={styles.actions}>
            <span className={`${styles.badge} ${styles[user.status]}`}>{labels[user.status]}</span>
            {user.status === 'pending' && <>
              <Button size="sm" className={styles.approveButton} disabled={busy !== null} onClick={() => void review(user, 'approved')}>{ko ? '승인' : 'Approve'}</Button>
              <Button size="sm" variant="outline" className={styles.rejectButton} disabled={busy !== null} onClick={() => void review(user, 'rejected')}>{ko ? '거절' : 'Reject'}</Button>
            </>}
          </div>
        </li>)}
      </ul>}
    </>}
        </div>
      </div>
    </section>
  </PageLayout>;
}
