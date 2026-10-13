import { useParams, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { BoardPostForm } from '@/components/organisms/BoardPostForm';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import type { BoardPost } from '@/lib/board-api';
import { boardDivisions } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export function BoardEditorPage({ notice = false }: { notice?: boolean }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialDivision = boardDivisions.find(item => String(item) === searchParams.get('division'));
  const { language } = useLanguage();
  const { user } = useAuth();
  const basePath = notice ? '/board/notices' : '/board';
  const { data, loading, error, reload } = useBoardResource<{ post: BoardPost }>(id ? `${notice ? basePath : '/board/posts'}/${id}` : null);
  const ko = language === 'KO';
  const post = data?.post;
  return <AuthLayout wide title={notice ? (id ? (ko ? '공지사항 수정' : 'Edit notice') : (ko ? '공지사항 작성' : 'Write a notice')) : id ? (ko ? '글 수정' : 'Edit post') : (ko ? '글쓰기' : 'Write a post')} description={notice ? (ko ? '제목과 이미지를 등록하면 공지 카드로 표시됩니다. 본문은 선택 사항이며, 공지는 승인된 회원에게 공개됩니다.' : 'Add a title and image to publish a notice card. The body is optional. Notices are visible to approved members.') : (ko ? '작성한 글은 승인된 회원들이 함께 볼 수 있습니다.' : 'Your post will be shared with approved members.')}>
    {loading ? <p role="status">{ko ? '게시글을 불러오는 중…' : 'Loading post…'}</p>
      : error ? <>
        <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
        <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
        <Link href={basePath} className={styles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
      </> : (notice ? user?.role !== 'master' : id && post?.authorId !== user?.id) ? <>
        <div role="alert" className={styles.error}>{notice ? (ko ? '관리자만 공지사항을 작성·수정할 수 있습니다.' : 'Only administrators can create or edit notices.') : (ko ? '본인이 작성한 글만 수정할 수 있습니다.' : 'You can only edit your own posts.')}</div>
        <Link href={basePath} className={styles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
      </> : <BoardPostForm key={post?.id ?? 'new'} post={post} initialDivision={initialDivision} notice={notice} />}
  </AuthLayout>;
}
