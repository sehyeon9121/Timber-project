import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { authErrorMessage } from '@/lib/auth-api';
import styles from '@/styles/auth.module.css';

export function AccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const ko = language === 'KO';
  async function signOut() {
    setBusy(true);
    setError(null);
    try { await logout(); onNavigate?.(); navigate('/'); }
    catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  if (loading) return <span className={styles.menu}>{ko ? '확인 중…' : 'Loading…'}</span>;
  return <div>
    <div className={styles.menu}>
      {user ? <>
        <Link href="/members" onClick={onNavigate}>{ko ? '회원 공간' : 'Members'}</Link>
        {user.role === 'master' && <Link href="/admin" onClick={onNavigate}>{ko ? '가입 승인 관리' : 'Manage signups'}</Link>}
        <button type="button" disabled={busy} onClick={() => void signOut()}>{ko ? '로그아웃' : 'Sign out'}</button>
      </> : <>
        <Link href="/login" onClick={onNavigate}>{ko ? '로그인' : 'Sign in'}</Link>
        <Link href="/signup" onClick={onNavigate}>{ko ? '회원가입' : 'Sign up'}</Link>
      </>}
    </div>
    {Boolean(error) && <small role="alert">{authErrorMessage(error, language)}</small>}
  </div>;
}
