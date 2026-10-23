import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { BoardAttachments } from '@/components/organisms/BoardAttachments';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import type { BoardPost } from '@/lib/board-api';
import { boardDate, boardDivisionLabel, boardListHref } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export function BoardPostPage({ notice = false }: { notice?: boolean }) {
  const { id } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const basePath = notice ? '/board/notices' : '/board';
  const apiPath = notice ? '/board/notices' : '/board/posts';
  const { data, loading, error, reload } = useBoardResource<{ post: BoardPost }>(`${apiPath}/${id}/views`, 'POST');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<unknown>(null);
  const ko = language === 'KO';
  const post = data?.post;
  const isAuthor = Boolean(post && user && post.authorId === user.id);
  const canEdit = notice ? user?.role === 'master' : isAuthor;
  const canDelete = Boolean(post && user && (notice ? user.role === 'master' : isAuthor || user.role === 'master'));
  async function remove() {
    if (!post || !canDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try { await authApi(`${apiPath}/${post.id}`, { method: 'DELETE' }); navigate(notice ? basePath : boardListHref(post.division), { replace: true }); }
    catch (cause) { setDeleteError(cause); }
    finally { setDeleting(false); }
  }
  return <AuthLayout wide title={post?.title || (notice ? (ko ? '연구단 공지사항' : 'Research Notices') : (ko ? '게시글' : 'Post'))} description={notice ? (ko ? '연구단 운영과 일정에 관한 관리자 공지입니다.' : 'Official notices about research group operations and schedules.') : (ko ? '연구단과 각 세부의 활동 소식을 공유합니다.' : 'Activities and updates from the research group and its divisions.')}>
    {loading ? <p role="status">{ko ? '게시글을 불러오는 중…' : 'Loading post…'}</p>
      : error ? <>
        <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
        <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
      </> : post && <>
        <div className={styles.meta}>
          <span>{ko ? '게시판: ' : 'Board: '}{notice ? (ko ? '연구단 공지사항' : 'Research Notices') : boardDivisionLabel(post.division, language)}</span>
          {notice && Boolean(post.pinned) && <span className={styles.noticeBadge}>{ko ? '중요 공지' : 'Important notice'}</span>}
          <span>{ko ? '작성자: ' : 'Author: '}{post.authorName}</span>
          <span>{ko ? '조회수: ' : 'Views: '}{post.viewCount.toLocaleString(ko ? 'ko-KR' : 'en-US')}</span>
          <span>{ko ? '작성일: ' : 'Posted: '}<time dateTime={post.createdAt}>{boardDate(post.createdAt, language)}</time></span>
          {post.updatedAt !== post.createdAt && <span>{ko ? '수정일: ' : 'Updated: '}<time dateTime={post.updatedAt}>{boardDate(post.updatedAt, language)}</time></span>}
        </div>
        {post.body && <p className={styles.body}>{post.body}</p>}
        <BoardAttachments files={post.attachments ?? []} postId={post.id} notice={notice} />
        {Boolean(deleteError) && <div className={styles.error} role="alert">{authErrorMessage(deleteError, language)}</div>}
        {canDelete && confirmDelete && <div className={styles.confirmation} role="group" aria-label={ko ? '게시글 삭제 확인' : 'Confirm post deletion'}>
          <p>{ko ? '이 게시글을 삭제할까요? 삭제한 글은 복구할 수 없습니다.' : 'Delete this post? Deleted posts cannot be restored.'}</p>
          <div className={styles.actions}>
            <Button className={styles.danger} disabled={deleting} onClick={() => void remove()}>{deleting ? (ko ? '삭제 중…' : 'Deleting…') : (ko ? '삭제 확인' : 'Confirm deletion')}</Button>
            <Button className={styles.secondary} disabled={deleting} onClick={() => setConfirmDelete(false)}>{ko ? '취소' : 'Cancel'}</Button>
          </div>
        </div>}
        <div className={styles.actions}>
          {canEdit && !confirmDelete && <Link href={`${basePath}/${post.id}/edit`} className={styles.secondary}>{ko ? '수정' : 'Edit'}</Link>}
          {canDelete && !confirmDelete && <Button className={styles.danger} onClick={() => setConfirmDelete(true)}>{ko ? '삭제' : 'Delete'}</Button>}
        </div>
      </>}
    <div className={styles.toolbar} style={{ marginTop: 28 }}>
      <Link href={notice ? basePath : post ? boardListHref(post.division) : '/board'} className={styles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
    </div>
  </AuthLayout>;
}
