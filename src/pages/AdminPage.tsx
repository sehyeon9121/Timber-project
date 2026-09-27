import { useCallback, useEffect, useState } from 'react';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage, ApiError } from '@/lib/auth-api';
import type { User } from '@/lib/auth-api';
import styles from '@/styles/auth.module.css';

export function AdminPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState('pending');
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
  const visible = users.filter(user => filter === 'all' || user.status === filter);
  const date = (value: string) => new Date(value).toLocaleString(ko ? 'ko-KR' : 'en-US');
  return <AuthLayout wide title={ko ? '가입 승인 관리' : 'Manage registration requests'} description={ko ? '마스터 계정으로 회원가입 요청을 검토하고 승인하거나 거절할 수 있습니다.' : 'Review registration requests and approve or reject membership with your master account.'}>
    <div className={styles.filters}>
      <label htmlFor="status-filter">{ko ? '가입 상태 ' : 'Status '}</label>
      <select id="status-filter" value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="pending">{labels.pending} ({users.filter(user => user.status === 'pending').length})</option>
        <option value="approved">{labels.approved}</option>
        <option value="rejected">{labels.rejected}</option>
        <option value="all">{ko ? '전체' : 'All'}</option>
      </select>
      <Button variant="outline" size="sm" disabled={loading || busy !== null} onClick={() => { setNotice(''); void load(); }}>{ko ? '새로고침' : 'Refresh'}</Button>
    </div>
    {notice && <div role="status" className={styles.notice}>{notice}</div>}
    {Boolean(error) && <div role="alert" className={styles.error}>{authErrorMessage(error, language)}</div>}
    {loading ? <p role="status">{ko ? '가입 요청을 불러오는 중…' : 'Loading requests…'}</p> : <>
      {!error && visible.length === 0 && <div className={styles.notice}>{ko ? '해당 상태의 가입 요청이 없습니다.' : 'No registration requests with this status.'}</div>}
      <ul className={styles.requests}>
        {visible.map(user => <li key={user.id} className={styles.request}>
          <div className={styles.requestInfo}>
            <Heading level={2}>{user.name}</Heading>
            <p>{user.email}</p><p>{user.affiliation}</p>
            <p>{ko ? '신청일: ' : 'Requested: '}{date(user.createdAt)}</p>
            {user.reviewedAt && <p>{ko ? '처리일: ' : 'Reviewed: '}{date(user.reviewedAt)}</p>}
          </div>
          <div className={styles.actions}>
            <span className={`${styles.badge} ${styles[user.status]}`}>{labels[user.status]}</span>
            {user.status === 'pending' && <>
              <Button size="sm" disabled={busy !== null} onClick={() => void review(user, 'approved')}>{ko ? '승인' : 'Approve'}</Button>
              <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => void review(user, 'rejected')}>{ko ? '거절' : 'Reject'}</Button>
            </>}
          </div>
        </li>)}
      </ul>
    </>}
  </AuthLayout>;
}
