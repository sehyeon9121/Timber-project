import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { AuthField } from '@/components/molecules/AuthField';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { authErrorMessage } from '@/lib/auth-api';
import styles from '@/styles/auth.module.css';

export function LoginPage() {
  const { user, login } = useAuth();
  const { language } = useLanguage();
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const ko = language === 'KO';
  if (user) return <Navigate to="/" replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await login(String(form.get('username')), String(form.get('password')));
    } catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  return <AuthLayout title={ko ? '로그인' : 'Sign in'} description={ko ? '관리자가 승인한 계정으로 로그인해 주세요.' : 'Sign in with an account approved by the administrator.'}>
    {Boolean(error) && <div role="alert" className={styles.error}>{authErrorMessage(error, language)}</div>}
    <form className={styles.form} onSubmit={submit}>
      <AuthField id="login-username" name="username" label={ko ? '아이디' : 'Username'} autoComplete="username" required minLength={3} maxLength={32} disabled={busy} />
      <AuthField id="login-password" name="password" label={ko ? '비밀번호' : 'Password'} type="password" autoComplete="current-password" required maxLength={128} disabled={busy} />
      <Button type="submit" disabled={busy}>{busy ? (ko ? '로그인 중…' : 'Signing in…') : (ko ? '로그인' : 'Sign in')}</Button>
    </form>
    <p className={styles.footnote}>{ko ? '계정이 없으신가요? ' : 'Need an account? '}<Link href="/signup">{ko ? '회원가입 요청' : 'Request membership'}</Link></p>
  </AuthLayout>;
}
