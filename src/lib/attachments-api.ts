import { upload } from '@vercel/blob/client';
import { authApi, ApiError } from './auth-api';
import type { BoardAttachment } from './board-api';

export const attachmentAccept = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.csv,.zip,.hwp,.hwpx,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
export const maxAttachmentSize = 20 * 1024 * 1024;
export interface PendingFile { key: string; file: File; reservation?: Reservation; uploaded?: boolean }
interface Reservation { attachment: BoardAttachment; backend: 'local' | 'blob'; pathname: string }
export function attachmentPath(notice: boolean, postId: number) {
  return `/board/${notice ? 'notices' : 'posts'}/${postId}/attachments`;
}
export function attachmentSize(size: number) {
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`;
}
export async function uploadAttachment(base: string, pending: PendingFile, update: (next: PendingFile) => void, progress: (value: number) => void) {
  let current = pending;
  if (!current.reservation) {
    const reservation = await authApi<Reservation>(base, { method: 'POST', body: JSON.stringify({ name: current.file.name, size: current.file.size }) });
    current = { ...current, reservation };
    update(current);
  } else {
    try {
      await authApi(`${base}/${current.reservation.attachment.id}/complete`, { method: 'POST' });
      return current.reservation.attachment;
    } catch (error) {
      if (!(error instanceof ApiError) || error.code !== 'ATTACHMENT_VALIDATION') throw error;
    }
  }
  const reserved = current.reservation;
  if (!reserved) throw new Error('Missing upload reservation');
  const path = `${base}/${reserved.attachment.id}`;
  if (!current.uploaded) {
    if (reserved.backend === 'blob') {
      await upload(reserved.pathname, current.file, { access: 'private', contentType: reserved.attachment.contentType,
        handleUploadUrl: `/api${path}/token`, multipart: current.file.size > 4 * 1024 * 1024,
        onUploadProgress: event => progress(Math.round(event.percentage)) });
    } else {
      await authApi(`${path}/content`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: current.file });
    }
    current = { ...current, uploaded: true };
    update(current);
  }
  await authApi(`${path}/complete`, { method: 'POST' });
  return { ...reserved.attachment, state: 'ready' as const };
}
