export const attachmentExtensions = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'csv', 'zip',
  'hwp', 'hwpx', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
] as const;
export const attachmentAccept = attachmentExtensions.map(extension => `.${extension}`).join(',');
export const maxAttachmentSize = 20 * 1024 * 1024;

export function attachmentFileError(file: { name: string; size: number }) {
  const extension = file.name.trim().split('.').at(-1)?.toLowerCase();
  if (!attachmentExtensions.some(item => item === extension)) return 'unsupported';
  if (!file.size) return 'empty';
  if (file.size > maxAttachmentSize) return 'oversized';
  return null;
}
