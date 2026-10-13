import { Button } from '@/components/atoms/Button';
import { Image } from '@/components/atoms/Image';
import { useLanguage } from '@/contexts/LanguageContext';
import { attachmentPath, attachmentSize } from '@/lib/attachments-api';
import type { BoardAttachment } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export interface BoardAttachmentsProps {
  files: BoardAttachment[];
  postId: number;
  notice?: boolean;
  removed?: string[];
  onToggleRemove?: (id: string) => void;
  disabled?: boolean;
}
export function BoardAttachments({ files, postId, notice = false, removed = [], onToggleRemove, disabled }: BoardAttachmentsProps) {
  const { language } = useLanguage();
  const ko = language === 'KO';
  if (!files.length) return null;
  return <section className={styles.attachments} aria-label={ko ? '첨부파일' : 'Attachments'}>
    <h2>{ko ? '첨부파일' : 'Attachments'} ({files.length})</h2>
    <ul className={styles.attachmentList}>
      {files.map(file => {
        const contentUrl = `/api${attachmentPath(notice, postId)}/${file.id}/content`;
        const marked = removed.includes(file.id);
        return <li key={file.id} className={marked ? styles.removedAttachment : undefined}>
          {file.state === 'ready' && file.contentType.startsWith('image/') && !marked
            && <a href={contentUrl} download><Image src={`${contentUrl}?preview=1`} alt={file.name} objectFit="contain" className={styles.attachmentImage} /></a>}
          <div className={styles.attachmentRow}>
            <div>{file.state === 'ready' ? <a href={contentUrl} download className={styles.fileLink}>{file.name}</a> : <span>{file.name}</span>}
              <small className={styles.hint}> · {attachmentSize(file.size)} · {file.state === 'ready' ? (ko ? '원본 다운로드' : 'Download original') : (ko ? '업로드 미완료 · 삭제 후 다시 첨부해 주세요' : 'Incomplete upload · Remove and attach again')}</small>
            </div>
            {onToggleRemove && <Button type="button" className={styles.secondary} disabled={disabled} onClick={() => onToggleRemove(file.id)}>
              {marked ? (ko ? '삭제 취소' : 'Keep file') : (ko ? '삭제' : 'Remove')}
            </Button>}
          </div>
        </li>;
      })}
    </ul>
  </section>;
}
