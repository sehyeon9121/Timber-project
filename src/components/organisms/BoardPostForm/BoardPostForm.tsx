import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthField } from '@/components/molecules/AuthField';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import { boardDivisions, boardListHref } from '@/lib/board-api';
import type { BoardPost } from '@/lib/board-api';
import { boardTemplates, boardTemplateBody } from '@/lib/board-templates';
import type { BoardTemplateId } from '@/lib/board-templates';
import styles from '@/styles/board.module.css';

export interface BoardPostFormProps { post?: BoardPost; initialDivision?: number; notice?: boolean }
export function BoardPostForm({ post, initialDivision, notice = false }: BoardPostFormProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [pinned, setPinned] = useState(Boolean(post?.pinned));
  const [division, setDivision] = useState(post?.division === null ? 'legacy' : String(post?.division ?? initialDivision ?? ''));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [template, setTemplate] = useState<BoardTemplateId>('free');
  const [appliedBody, setAppliedBody] = useState('');
  const [pendingTemplate, setPendingTemplate] = useState<BoardTemplateId | null>(null);
  const ko = language === 'KO';
  const basePath = notice ? '/board/notices' : '/board';
  const apiPath = notice ? '/board/notices' : '/board/posts';
  function applyTemplate(id: BoardTemplateId) {
    setTemplate(id);
    setPendingTemplate(null);
    // Free writing keeps the current draft so choosing it never removes content.
    if (id === 'free') return;
    const nextBody = boardTemplateBody(id, language);
    setBody(nextBody);
    setAppliedBody(nextBody);
  }
  function chooseTemplate(id: BoardTemplateId) {
    if (id !== 'free' && body.trim() && body !== appliedBody) {
      setPendingTemplate(id);
    } else {
      applyTemplate(id);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await authApi<{ post: BoardPost }>(post ? `${apiPath}/${post.id}` : apiPath, {
        method: post ? 'PATCH' : 'POST', body: JSON.stringify(notice ? { title, body, pinned } : { title, body, division: division === 'legacy' ? undefined : Number(division) }),
      });
      navigate(`${basePath}/${data.post.id}`, { replace: true });
    } catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  return <>
    {Boolean(error) && <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>}
    <form className={styles.form} onSubmit={submit}>
      {!notice && <div className={styles.textareaField}>
        <label htmlFor="post-division">{ko ? '세부 게시판' : 'Division board'}</label>
        <select id="post-division" name="division" className={styles.select} value={division}
          onChange={event => setDivision(event.target.value)} required disabled={busy}>
          <option value="">{ko ? '세부를 선택해 주세요' : 'Choose a division'}</option>
          {post?.division === null && <option value="legacy">{ko ? '기존 글 (세부 미지정)' : 'Earlier post (no division)'}</option>}
          {boardDivisions.map(item => <option key={item} value={item}>{ko ? `${item}세부` : `Division ${item}`}</option>)}
        </select>
      </div>}
      {!notice && <div className={styles.textareaField}>
        <label htmlFor="post-template">{ko ? '글 종류 / 기본 양식' : 'Post type / template'}</label>
        <select id="post-template" className={styles.select} value={template}
          onChange={event => chooseTemplate(event.target.value as BoardTemplateId)} disabled={busy}
          aria-describedby="post-template-hint">
          <option value="free">{ko ? '자유 글 (양식 없음)' : 'Free writing (no template)'}</option>
          {boardTemplates.map(item => <option key={item.id} value={item.id}>{item.label[language]}</option>)}
        </select>
        <small id="post-template-hint" className={styles.hint}>
          {ko ? '글 종류를 선택하면 내용에 기본 양식이 채워집니다. 항목은 자유롭게 수정할 수 있습니다.' : 'Choose a post type to fill in a template. You can edit every section freely.'}
        </small>
        {pendingTemplate && <div className={styles.confirmation} role="alert" aria-labelledby="post-template-confirm">
          <p id="post-template-confirm">{ko
            ? '작성한 내용이 있습니다. 선택한 양식으로 내용을 바꿀까요? 바꾸면 기존 내용은 사라집니다.'
            : 'You have written content. Replace it with the selected template? Your current content will be removed.'}</p>
          <div className={styles.actions}>
            <Button type="button" className={styles.secondary} disabled={busy} onClick={() => setPendingTemplate(null)}>
              {ko ? '기존 내용 유지' : 'Keep current content'}
            </Button>
            <Button type="button" className={styles.danger} disabled={busy} onClick={() => applyTemplate(pendingTemplate)}>
              {ko ? '양식으로 바꾸기' : 'Replace with template'}
            </Button>
          </div>
        </div>}
      </div>}
      {notice && <label className={styles.pinOption}>
        <input type="checkbox" checked={pinned} onChange={event => setPinned(event.target.checked)} disabled={busy} />
        {ko ? '중요 공지로 표시 (목록 상단에 배치)' : 'Important notice (show at the top of the list)'}
      </label>}
      <AuthField id="post-title" name="title" label={ko ? '제목' : 'Title'} value={title}
        onChange={event => setTitle(event.target.value)} required maxLength={120} disabled={busy}
        hint={ko ? '최대 120자' : 'Up to 120 characters'} />
      <div className={styles.textareaField}>
        <label htmlFor="post-body">{ko ? '내용' : 'Body'}</label>
        <textarea id="post-body" name="body" className={styles.textarea} value={body}
          onChange={event => setBody(event.target.value)} required maxLength={10000} disabled={busy} aria-describedby="post-body-hint" />
        <small id="post-body-hint" className={styles.hint}>
          {body.length.toLocaleString()} / 10,000 {ko ? '자 · 승인된 회원에게만 공개됩니다.' : 'characters · Only approved members can read this post.'}
        </small>
      </div>
      <div className={styles.actions}>
        <Button type="submit" className={styles.primary} disabled={busy}>
          {busy ? (ko ? '저장 중…' : 'Saving…') : post ? (ko ? '수정 완료' : 'Save changes') : (ko ? '등록' : 'Publish')}
        </Button>
        {busy ? <Button type="button" className={styles.secondary} disabled>{ko ? '취소' : 'Cancel'}</Button>
          : <Link href={post ? `${basePath}/${post.id}` : notice ? basePath : initialDivision ? boardListHref(initialDivision) : '/board'} className={styles.secondary}>{ko ? '취소' : 'Cancel'}</Link>}
      </div>
    </form>
  </>;
}
