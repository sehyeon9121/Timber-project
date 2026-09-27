import { useParams } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { BoardPostForm } from '@/components/organisms/BoardPostForm';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import type { BoardPost } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export function BoardEditorPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { data, loading, error, reload } = useBoardResource<{ post: BoardPost }>(id ? `/board/posts/${id}` : null);
  const ko = language === 'KO';
  const post = data?.post;
  return <AuthLayout wide title={id ? (ko ? '글 수정' : 'Edit post') : (ko ? '글쓰기' : 'Write a post')} description={ko ? '작성한 글은 승인된 회원들이 함께 볼 수 있습니다.' : 'Your post will be shared with approved members.'}>
    {loading ? <p role="status">{ko ? '게시글을 불러오는 중…' : 'Loading post…'}</p>
      : error ? <>
        <div className={styles.error} role="alert">{authErrorMessage(error, language)}</div>
        <Button className={styles.secondary} onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
        <Link href="/board" className={styles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
      </> : id && post?.authorId !== user?.id ? <>
        <div role="alert" className={styles.error}>{ko ? '본인이 작성한 글만 수정할 수 있습니다.' : 'You can only edit your own posts.'}</div>
        <Link href="/board" className={styles.secondary}>{ko ? '목록으로' : 'Back to board'}</Link>
      </> : <BoardPostForm key={post?.id ?? 'new'} post={post} />}
  </AuthLayout>;
}
