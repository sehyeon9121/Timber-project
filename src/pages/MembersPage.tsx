import { useEffect, useState } from 'react';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import type { User } from '@/lib/auth-api';
import styles from '@/styles/auth.module.css';

export function MembersPage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);
  const ko = language === 'KO';
  useEffect(() => {
    let active = true;
    authApi<{ user: User }>('/members/home').then(data => { if (active) { setUser(data.user); setError(null); } })
      .catch(cause => { if (active) setError(cause); });
    return () => { active = false; };
  }, [attempt]);
  return <AuthLayout title={ko ? '회원 공간' : 'Member area'} description={ko ? '관리자 승인을 받은 회원 전용 공간입니다.' : 'A private area for approved members.'}>
    {error ? <>
      <div role="alert" className={styles.error}>{authErrorMessage(error, language)}</div>
      <Button onClick={() => setAttempt(value => value + 1)}>{ko ? '다시 시도' : 'Try again'}</Button>
    </> : user ? <>
      <div className={styles.notice}>{ko ? `${user.name}님, 환영합니다.` : `Welcome, ${user.name}.`}</div>
      <dl className={styles.profile}>
        <dt>{ko ? '아이디' : 'Username'}</dt><dd>{user.username}</dd>
        <dt>{ko ? '이메일' : 'Email'}</dt><dd>{user.email}</dd>
        <dt>{ko ? '소속' : 'Affiliation'}</dt><dd>{user.affiliation}</dd>
        <dt>{ko ? '계정 권한' : 'Role'}</dt><dd>{user.role === 'master' ? (ko ? '마스터 관리자' : 'Master administrator') : (ko ? '일반 회원' : 'Member')}</dd>
      </dl>
      {user.role === 'master' && <Link href="/admin">{ko ? '관리자 설정으로 이동 →' : 'Open admin settings →'}</Link>}
    </> : <p role="status">{ko ? '회원 정보를 불러오는 중…' : 'Loading your profile…'}</p>}
  </AuthLayout>;
}
