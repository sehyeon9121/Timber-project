import express from 'express';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { handleUpload } from '@vercel/blob/client';
import { createFileStorage } from './file-storage.mjs';

export const maxFileSize = 20 * 1024 * 1024;
export const attachmentTypes = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  pdf: 'application/pdf', txt: 'text/plain', csv: 'text/csv', zip: 'application/zip',
  hwp: 'application/octet-stream', hwpx: 'application/octet-stream',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};
export function validateAttachment(input) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const extension = name.split('.').at(-1)?.toLowerCase();
  if (!name || name.length > 180 || /[\x00-\x1f\x7f/\\]/.test(name) || !attachmentTypes[extension]
    || !Number.isSafeInteger(input.size) || input.size < 1 || input.size > maxFileSize) return null;
  return { name, size: input.size, contentType: attachmentTypes[extension], extension };
}

function imageMatches(type, bytes) {
  if (type === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (type === 'image/gif') return ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString());
  if (type === 'image/webp') return bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  return true;
}

export function createAttachments(store, storage = createFileStorage(), callbackOrigin) {
  const fail = (res, status, code, message) => res.status(status).json({ code, message });
  const available = file => storage && (!file || file.backend === storage.backend);
  async function parent(kind, id) { return kind === 'posts' ? store.findPost(id) : store.findNotice(id); }
  function canEdit(kind, post, user) { return kind === 'notices' ? user.role === 'master' : post.authorId === user.id; }
  async function finish(file) {
    const info = await storage.inspect(file);
    if (info.size !== file.size || info.contentType.split(';')[0] !== file.content_type) throw new Error('FILE_MISMATCH');
    if (file.content_type.startsWith('image/')) {
      const stream = await storage.read(file);
      if (!stream) throw new Error('FILE_MISMATCH');
      let bytes = Buffer.alloc(0);
      for await (const chunk of stream) {
        bytes = Buffer.concat([bytes, Buffer.from(chunk)]);
        if (bytes.length >= 12) break;
      }
      if (!imageMatches(file.content_type, bytes)) throw new Error('FILE_MISMATCH');
    }
    await store.readyAttachment(file.id);
  }
  async function enrich(kind, post, user) {
    if (!post) return post;
    return { ...post, attachments: await store.listAttachments(kind, post.id, canEdit(kind, post, user)) };
  }
  async function removeFiles(kind, id) {
    const files = await store.allAttachmentFiles(kind, id);
    for (const file of files) {
      if (!available(file)) throw new Error('ATTACHMENT_STORAGE_UNAVAILABLE');
      await storage.remove(file);
    }
  }
  function registerCallback(app) {
    app.post('/api/attachments/callback', express.json({ limit: '16kb' }), async (request, response) => {
      if (!available() || storage.backend !== 'blob') return fail(response, 503, 'ATTACHMENT_UNAVAILABLE', '파일 저장소 연결이 필요합니다.');
      if (request.body?.type !== 'blob.upload-completed') return fail(response, 400, 'ATTACHMENT_VALIDATION', '올바른 업로드 알림이 아닙니다.');
      try {
        const result = await handleUpload({ body: request.body, request, token: storage.token,
          onBeforeGenerateToken: async () => { throw new Error('UNSUPPORTED'); },
          onUploadCompleted: async ({ blob, tokenPayload }) => {
            const payload = JSON.parse(tokenPayload);
            if (blob.pathname !== payload.pathname) throw new Error('FILE_MISMATCH');
            const file = await store.findAttachment(payload.id);
            if (!file) return storage.remove({ pathname: payload.pathname });
            if (file.pathname !== blob.pathname) throw new Error('FILE_MISMATCH');
            await finish(file);
          },
        });
        response.json(result);
      } catch { fail(response, 400, 'ATTACHMENT_VALIDATION', '업로드 알림을 확인할 수 없습니다.'); }
    });
  }
  function registerRoutes(app, requireUser) {
    const base = '/api/board/:kind/:id/attachments';
    async function access(request, response, next) {
      const { kind } = request.params;
      const id = Number(request.params.id);
      const post = ['posts', 'notices'].includes(kind) && Number.isSafeInteger(id) && id > 0 ? await parent(kind, id) : null;
      if (!post) return fail(response, 404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.');
      if (request.method !== 'GET' && request.method !== 'HEAD' && !canEdit(kind, post, request.user)) {
        return fail(response, 403, 'POST_FORBIDDEN', '글 수정 권한이 있어야 첨부파일을 변경할 수 있습니다.');
      }
      request.post = post;
      if (request.params.fileId) {
        const file = await store.findAttachment(request.params.fileId);
        if (!file || (kind === 'posts' ? file.post_id : file.notice_id) !== id) return fail(response, 404, 'ATTACHMENT_NOT_FOUND', '첨부파일을 찾을 수 없습니다.');
        request.file = file;
      }
      next();
    }
    const ensureStorage = (request, response, next) => available(request.file) ? next()
      : fail(response, 503, 'ATTACHMENT_UNAVAILABLE', '파일 저장소 연결이 필요합니다. 관리자에게 문의해 주세요.');
    app.post(base, requireUser, access, ensureStorage, async (request, response) => {
      const input = validateAttachment(request.body);
      if (!input) return fail(response, 400, 'ATTACHMENT_VALIDATION', '지원하는 파일을 선택해 주세요. 파일별 최대 20MB입니다.');
      const id = randomUUID();
      const pathname = `attachments/${request.params.kind}/${request.post.id}/${id}.${input.extension}`;
      const file = await store.reserveAttachment(request.params.kind, request.post.id, { ...input, id, pathname, backend: storage.backend });
      if (!file) return fail(response, 400, 'ATTACHMENT_LIMIT', '글당 최대 10개까지 첨부할 수 있습니다.');
      response.status(201).json({ attachment: { id, name: input.name, size: input.size, contentType: input.contentType, state: 'pending' }, pathname, backend: storage.backend });
    });
    app.post(`${base}/:fileId/token`, requireUser, access, ensureStorage, async (request, response) => {
      const file = request.file;
      if (storage.backend !== 'blob' || file.state !== 'pending' || request.body?.type !== 'blob.generate-client-token'
        || request.body?.payload?.pathname !== file.pathname) return fail(response, 400, 'ATTACHMENT_VALIDATION', '올바른 업로드 요청이 아닙니다.');
      const callbackUrl = callbackOrigin?.startsWith('https:') ? new URL('/api/attachments/callback', callbackOrigin).href : undefined;
      const result = await handleUpload({ body: request.body, request, token: storage.token,
        onBeforeGenerateToken: async () => ({ allowedContentTypes: [file.content_type], maximumSizeInBytes: file.size,
          validUntil: Date.now() + 15 * 60 * 1000, addRandomSuffix: false, allowOverwrite: false,
          callbackUrl, tokenPayload: JSON.stringify({ id: file.id, pathname: file.pathname }) }),
        onUploadCompleted: callbackUrl ? async () => {} : undefined,
      });
      response.json(result);
    });
    app.put(`${base}/:fileId/content`, requireUser, access, ensureStorage, express.raw({ type: '*/*', limit: maxFileSize }), async (request, response) => {
      const file = request.file;
      if (storage.backend !== 'local' || file.state !== 'pending' || !Buffer.isBuffer(request.body)
        || request.body.length !== file.size || !imageMatches(file.content_type, request.body)) {
        return fail(response, 400, 'ATTACHMENT_VALIDATION', '파일 크기 또는 사진 형식을 확인해 주세요.');
      }
      await storage.write(file, request.body);
      await finish(file);
      response.json({ ok: true });
    });
    app.post(`${base}/:fileId/complete`, requireUser, access, ensureStorage, async (request, response) => {
      try {
        await finish(request.file);
        response.json({ ok: true });
      } catch { fail(response, 400, 'ATTACHMENT_VALIDATION', '업로드된 파일을 확인할 수 없습니다. 다시 첨부해 주세요.'); }
    });
    app.get(`${base}/:fileId/content`, requireUser, access, ensureStorage, async (request, response) => {
      const file = request.file;
      if (file.state !== 'ready') return fail(response, 404, 'ATTACHMENT_NOT_FOUND', '업로드가 완료되지 않은 파일입니다.');
      const stream = await storage.read(file);
      if (!stream) return fail(response, 404, 'ATTACHMENT_NOT_FOUND', '첨부파일을 찾을 수 없습니다.');
      const preview = request.query.preview === '1' && file.content_type.startsWith('image/');
      response.set({ 'Content-Type': preview ? file.content_type : 'application/octet-stream',
        'Content-Disposition': `${preview ? 'inline' : 'attachment'}; filename="download"; filename*=UTF-8''${encodeURIComponent(file.name).replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))}`,
        'Content-Security-Policy': "default-src 'none'; sandbox", 'Cache-Control': 'private, no-store' });
      await pipeline(stream, response);
    });
    app.delete(`${base}/:fileId`, requireUser, access, ensureStorage, async (request, response) => {
      await storage.remove(request.file);
      await store.deleteAttachment(request.file.id);
      response.json({ ok: true });
    });
  }
  return { enrich, removeFiles, registerCallback, registerRoutes };
}
