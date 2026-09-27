import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthField } from '@/components/molecules/AuthField';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import type { BoardPost } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export interface BoardPostFormProps { post?: BoardPost }
export function BoardPostForm({ post }: BoardPostFormProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const ko = language === 'KO';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await authApi<{ post: BoardPost }>(post ? `/board/posts/${post.id}` : '/board/posts', {
        method: post ? 'PATCH' : 'POST', body: JSON.stringify({ title, body }),
      });
      navigate(`/board/${data.post.id}`, { replace: true });
    } catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  return <>
    {Boolean(error) && <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>}
    <form className={styles.form} onSubmit={submit}>
      <AuthField id="post-title" name="title" label={ko ? '제목' : 'Title'} value={title}
        onChange={event => setTitle(event.target.value)} required maxLength={120} disabled={busy}
        hint={ko ? '최대 120자' : 'Up to 120 characters'} />
      <div className={styles.textareaField}>
        <label htmlFor="post-body">{ko ? '내용' : 'Body'}</label>
        <textarea id="post-body" name="body" className={styles.textarea} value={body}
          onChange={event => setBody(event.target.value)} required maxLength={10000} disabled={busy} aria-describedby="post-body-hint" />
        <small id="post-body-hint" className={styles.hint}>
          {body.length.toLocaleString()} / 10,000 {ko ? '자 · 게시글은 승인된 회원에게만 공개됩니다.' : 'characters · Only approved members can read this post.'}
        </small>
      </div>
      <div className={styles.actions}>
        <Button type="submit" className={styles.primary} disabled={busy}>
          {busy ? (ko ? '저장 중…' : 'Saving…') : post ? (ko ? '수정 완료' : 'Save changes') : (ko ? '등록' : 'Publish')}
        </Button>
        {busy ? <Button type="button" className={styles.secondary} disabled>{ko ? '취소' : 'Cancel'}</Button>
          : <Link href={post ? `/board/${post.id}` : '/board'} className={styles.secondary}>{ko ? '취소' : 'Cancel'}</Link>}
      </div>
    </form>
  </>;
}
