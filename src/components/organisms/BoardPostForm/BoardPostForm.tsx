import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthField } from '@/components/molecules/AuthField';
import { FileDropzone } from '@/components/molecules/FileDropzone';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { BoardAttachments } from '@/components/organisms/BoardAttachments';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage, ApiError } from '@/lib/auth-api';
import { attachmentFileError, attachmentPath, attachmentSize, uploadAttachment } from '@/lib/attachments-api';
import type { PendingFile } from '@/lib/attachments-api';
import { boardDivisions, boardListHref } from '@/lib/board-api';
import type { BoardPost } from '@/lib/board-api';
import { boardTemplates, boardTemplateBody } from '@/lib/board-templates';
import type { BoardTemplateId } from '@/lib/board-templates';
import styles from '@/styles/board.module.css';

export interface BoardPostFormProps { post?: BoardPost; initialDivision?: number | null; notice?: boolean }
export function BoardPostForm({ post, initialDivision, notice = false }: BoardPostFormProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [pinned, setPinned] = useState(Boolean(post?.pinned));
  const [division, setDivision] = useState(String(post ? post.division ?? 'activities' : initialDivision ?? 'activities'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [template, setTemplate] = useState<BoardTemplateId>('free');
  const [appliedBody, setAppliedBody] = useState('');
  const [pendingTemplate, setPendingTemplate] = useState<BoardTemplateId | null>(null);
  const [savedId, setSavedId] = useState(post?.id);
  const [attachments, setAttachments] = useState(post?.attachments ?? []);
  const [removed, setRemoved] = useState<string[]>([]);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const ko = language === 'KO';
  const basePath = notice ? '/board/notices' : '/board';
  const apiPath = notice ? '/board/notices' : '/board/posts';
  function selectFiles(selected: File[]) {
    if (busy) return;
    if (attachments.length - removed.length + files.length + selected.length > 10) {
      setError(new ApiError('글당 최대 10개까지 첨부할 수 있습니다.', 'ATTACHMENT_LIMIT')); return;
    }
    for (const file of selected) {
      const reason = attachmentFileError(file);
      if (!reason) continue;
      const message = reason === 'oversized' ? `${file.name}: ${attachmentSize(file.size)}입니다. 파일별 최대 20MB까지 첨부할 수 있습니다.`
        : reason === 'empty' ? `${file.name}: 내용이 없는 파일은 첨부할 수 없습니다.`
        : `${file.name}: 지원하지 않는 확장자입니다. PDF, HWP/HWPX, PPT/PPTX, Word, Excel 또는 사진 파일을 선택해 주세요.`;
      setError(new ApiError(message, reason === 'oversized' ? 'ATTACHMENT_TOO_LARGE' : reason === 'empty' ? 'ATTACHMENT_EMPTY' : 'ATTACHMENT_TYPE')); return;
    }
    setError(null);
    setFiles(items => [...items, ...selected.map((file, index) => ({ key: `${Date.now()}-${index}-${Math.random()}`, file }))]);
  }
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
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const data = await authApi<{ post: BoardPost }>(savedId ? `${apiPath}/${savedId}` : apiPath, {
        method: savedId ? 'PATCH' : 'POST', body: JSON.stringify(notice ? { title, body, pinned } : { title, body, division: division === 'activities' ? null : Number(division) }),
      });
      setSavedId(data.post.id);
      const base = attachmentPath(notice, data.post.id);
      for (const id of removed) {
        await authApi(`${base}/${id}`, { method: 'DELETE' });
        setAttachments(items => items.filter(item => item.id !== id));
        setRemoved(items => items.filter(item => item !== id));
      }
      for (const pending of files) {
        setUploadStatus(ko ? `${pending.file.name} 업로드 중…` : `Uploading ${pending.file.name}…`);
        const attachment = await uploadAttachment(base, pending,
          updated => setFiles(items => items.map(item => item.key === pending.key ? updated : item)),
          percent => setUploadStatus(`${pending.file.name} · ${percent}%`));
        setFiles(items => items.filter(item => item.key !== pending.key));
        setAttachments(items => [...items, { ...attachment, state: 'ready' }]);
      }
      navigate(`${basePath}/${data.post.id}`, { replace: true });
    } catch (cause) { setError(cause instanceof ApiError ? cause : new ApiError('파일 업로드에 실패했습니다. 연결을 확인한 뒤 다시 저장해 주세요.', 'ATTACHMENT_UPLOAD')); }
    finally { setBusy(false); setUploadStatus(''); }
  }
  const bodyField = <div className={styles.textareaField}>
    <label htmlFor="post-body">{notice ? (ko ? '내용 (선택)' : 'Body (optional)') : (ko ? '내용' : 'Body')}</label>
    <textarea id="post-body" name="body" className={styles.textarea} value={body}
      onChange={event => setBody(event.target.value)} required={!notice} maxLength={10000} disabled={busy} aria-describedby="post-body-hint" />
    <small id="post-body-hint" className={styles.hint}>
      {body.length.toLocaleString()} / 10,000 {ko ? '자 · 승인된 회원에게만 공개됩니다.' : 'characters · Only approved members can read this post.'}
    </small>
  </div>;
  return <>
    {Boolean(error) && <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>}
    {Boolean(error) && savedId && <p className={styles.hint}>{ko ? '글은 저장되었습니다. 첨부파일 상태를 확인한 뒤 다시 저장하거나 저장된 글로 이동하세요.' : 'The post has been saved. Check attachments and save again, or open the saved post.'} <Link href={`${basePath}/${savedId}`}>{ko ? '저장된 글 보기' : 'Open saved post'}</Link></p>}
    <form className={styles.form} onSubmit={submit}>
      {!notice && <div className={styles.textareaField}>
        <label htmlFor="post-division">{ko ? '게시판' : 'Board'}</label>
        <select id="post-division" name="division" className={styles.select} value={division}
          onChange={event => setDivision(event.target.value)} required disabled={busy}>
          <option value="activities">{ko ? '연구단 활동' : 'Project Activities'}</option>
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
      {!notice && bodyField}
      <div className={styles.textareaField}>
        <label htmlFor="post-files">{ko ? '파일·사진 첨부' : 'Attach files and photos'}</label>
        <FileDropzone id="post-files" disabled={busy} describedBy="post-files-hint" onSelect={selectFiles} />
        <small id="post-files-hint" className={styles.hint}>
          {notice && <>{ko ? '첫 번째 첨부 사진이 공지 카드의 대표 이미지로 표시됩니다. ' : 'The first attached image appears on the notice card. '}</>}
          {ko ? '파일별 최대 20MB · 글당 최대 10개 · 사진, PDF, 한글, Office, ZIP, TXT, CSV · 등록/수정 완료 시 업로드됩니다.' : 'Up to 20 MB per file, 10 files per post · Photos, PDF, HWP, Office, ZIP, TXT, CSV · Uploaded when you save.'}
        </small>
        {savedId && <BoardAttachments files={attachments} postId={savedId} notice={notice} removed={removed} disabled={busy}
          onToggleRemove={id => setRemoved(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])} />}
        {files.length > 0 && <ul className={styles.attachmentList}>{files.map(item => <li key={item.key} className={styles.attachmentRow}>
          <span>{item.file.name} <small className={styles.hint}>{attachmentSize(item.file.size)}</small></span>
          <Button type="button" className={styles.secondary} disabled={busy} onClick={() => {
            if (item.reservation && savedId) {
              setBusy(true);
              void authApi(`${attachmentPath(notice, savedId)}/${item.reservation.attachment.id}`, { method: 'DELETE' })
                .then(() => setFiles(items => items.filter(file => file.key !== item.key)))
                .catch(setError).finally(() => setBusy(false));
            } else setFiles(items => items.filter(file => file.key !== item.key));
          }}>{ko ? '선택 취소' : 'Remove selection'}</Button>
        </li>)}</ul>}
        {uploadStatus && <p role="status" aria-live="polite">{uploadStatus}</p>}
      </div>
      {notice && <details className={styles.noticeExtra} open={Boolean(post?.body)}>
        <summary>{ko ? '추가 설명 작성 (선택)' : 'Additional description (optional)'}</summary>
        {bodyField}
      </details>}
      <div className={styles.actions}>
        <Button type="submit" className={styles.primary} disabled={busy}>
          {busy ? (ko ? '저장 중…' : 'Saving…') : post ? (ko ? '수정 완료' : 'Save changes') : (ko ? '등록' : 'Publish')}
        </Button>
        {busy ? <Button type="button" className={styles.secondary} disabled>{ko ? '취소' : 'Cancel'}</Button>
          : <Link href={savedId ? `${basePath}/${savedId}` : notice ? basePath : initialDivision ? boardListHref(initialDivision) : '/board'} className={styles.secondary}>{ko ? '취소' : 'Cancel'}</Link>}
      </div>
    </form>
  </>;
}
