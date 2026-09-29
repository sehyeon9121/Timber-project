import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { AuthField } from '@/components/molecules/AuthField';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/auth-context';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import styles from '@/styles/auth.module.css';

export function SignupPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const [mismatch, setMismatch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const ko = language === 'KO';
  if (user) return <Navigate to="/members" replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));
    setError(null);
    setMismatch(password !== form.get('confirmation'));
    if (password !== form.get('confirmation')) return;
    setBusy(true);
    try {
      await authApi('/auth/signup', { method: 'POST', body: JSON.stringify({
        name: form.get('name'), username: form.get('username'), email: form.get('email'), affiliation: form.get('affiliation'), password,
      }) });
      setSent(true);
    } catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  return <AuthLayout title={ko ? '회원가입 요청' : 'Request membership'} description={ko ? '가입 요청을 보내면 관리자가 소속과 신청 정보를 확인합니다.' : 'The administrator will review your affiliation and registration details.'}>
    {sent ? <>
      <div role="status" className={styles.notice}>{ko ? '가입 요청이 접수되었습니다. 현재 승인 대기 중이며, 관리자 승인 후 로그인할 수 있습니다.' : 'Your request has been submitted and is awaiting approval. You can sign in once the administrator approves it.'}</div>
      <Link href="/login" className={styles.footnote}>{ko ? '로그인 화면으로 이동' : 'Go to sign in'}</Link>
    </> : <>
      <div className={styles.notice}>{ko ? '가입 신청만으로는 로그인할 수 없습니다. 관리자 승인이 필요합니다.' : 'Registration does not grant access immediately. Administrator approval is required.'}</div>
      {Boolean(error) && <div role="alert" className={styles.error}>{authErrorMessage(error, language)}</div>}
      {mismatch && <div role="alert" className={styles.error}>{ko ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.'}</div>}
      <form className={styles.form} onSubmit={submit}>
        <AuthField id="signup-name" name="name" label={ko ? '이름' : 'Name'} autoComplete="name" required minLength={2} maxLength={80} disabled={busy} />
        <AuthField id="signup-username" name="username" label={ko ? '아이디' : 'Username'} hint={ko ? '영문으로 시작하는 영문·숫자·밑줄 3~32자' : '3–32 letters, numbers, or underscores; start with a letter.'} autoComplete="username" required minLength={3} maxLength={32} pattern="[A-Za-z][A-Za-z0-9_]{2,31}" disabled={busy} />
        <AuthField id="signup-email" name="email" label={ko ? '이메일 (연락용)' : 'Email (contact)'} type="email" autoComplete="email" required maxLength={254} disabled={busy} />
        <AuthField id="signup-affiliation" name="affiliation" label={ko ? '소속 기관 / 연구실' : 'Institution / lab'} autoComplete="organization" required minLength={2} maxLength={120} disabled={busy} />
        <AuthField id="signup-password" name="password" label={ko ? '비밀번호' : 'Password'} hint={ko ? '12~128자로 입력해 주세요.' : 'Use 12–128 characters.'} type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={busy} />
        <AuthField id="signup-confirmation" name="confirmation" label={ko ? '비밀번호 확인' : 'Confirm password'} type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={busy} />
        <Button type="submit" disabled={busy}>{busy ? (ko ? '요청 중…' : 'Submitting…') : (ko ? '가입 승인 요청' : 'Submit request')}</Button>
      </form>
      <p className={styles.footnote}>{ko ? '이미 신청하셨나요? ' : 'Already registered? '}<Link href="/login">{ko ? '로그인' : 'Sign in'}</Link></p>
    </>}
  </AuthLayout>;
}
