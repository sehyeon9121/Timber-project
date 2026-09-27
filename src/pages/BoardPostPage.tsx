import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import type { BoardPost } from '@/lib/board-api';
import { boardDate } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export function BoardPostPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useBoardResource<{ post: BoardPost }>(`/board/posts/${id}`);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<unknown>(null);
  const ko = language === 'KO';
  const post = data?.post;
  const isAuthor = Boolean(post && user && post.authorId === user.id);
  const canDelete = Boolean(post && user && (isAuthor || user.role === 'master'));
  async function remove() {
    if (!post || !canDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try { await authApi(`/board/posts/${post.id}`, { method: 'DELETE' }); navigate('/board', { replace: true }); }
    catch (cause) { setDeleteError(cause); }
    finally { setDeleting(false); }
  }
  return <AuthLayout wide title={post?.title || (ko ? '게시글' : 'Post')} description={ko ? '승인된 회원에게만 공개되는 게시글입니다.' : 'This post is visible only to approved members.'}>
    {loading ? <p role="status">{ko ? '게시글을 불러오는 중…' : 'Loading post…'}</p>
      : error ? <>
        <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
        <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
      </> : post && <>
        <div className={styles.meta}>
          <span>{ko ? '작성자: ' : 'Author: '}{post.authorName}</span>
          <span>{ko ? '작성일: ' : 'Posted: '}<time dateTime={post.createdAt}>{boardDate(post.createdAt, language)}</time></span>
          {post.updatedAt !== post.createdAt && <span>{ko ? '수정일: ' : 'Updated: '}<time dateTime={post.updatedAt}>{boardDate(post.updatedAt, language)}</time></span>}
        </div>
        <p className={styles.body}>{post.body}</p>
        {Boolean(deleteError) && <div className={styles.error} role="alert">{authErrorMessage(deleteError, language)}</div>}
        {canDelete && confirmDelete && <div className={styles.confirmation} role="group" aria-label={ko ? '게시글 삭제 확인' : 'Confirm post deletion'}>
          <p>{ko ? '이 게시글을 삭제할까요? 삭제한 글은 복구할 수 없습니다.' : 'Delete this post? Deleted posts cannot be restored.'}</p>
          <div className={styles.actions}>
            <Button className={styles.danger} disabled={deleting} onClick={() => void remove()}>{deleting ? (ko ? '삭제 중…' : 'Deleting…') : (ko ? '삭제 확인' : 'Confirm deletion')}</Button>
            <Button className={styles.secondary} disabled={deleting} onClick={() => setConfirmDelete(false)}>{ko ? '취소' : 'Cancel'}</Button>
          </div>
        </div>}
        <div className={styles.actions}>
          {isAuthor && !confirmDelete && <Link href={`/board/${post.id}/edit`} className={styles.secondary}>{ko ? '수정' : 'Edit'}</Link>}
          {canDelete && !confirmDelete && <Button className={styles.danger} onClick={() => setConfirmDelete(true)}>{ko ? '삭제' : 'Delete'}</Button>}
        </div>
      </>}
    <div className={styles.toolbar} style={{ marginTop: 28 }}>
      <Link href="/board" className={styles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
    </div>
  </AuthLayout>;
}
