import { boardPageSize, validatePost } from './board.mjs';

export function registerNoticeRoutes(app, store, requireUser, requireMaster) {
  const fail = (response, status, code, message) => response.status(status).json({ code, message });
  function validateNotice(body) {
    const input = validatePost({ title: body?.title, body: body?.body });
    if (input.error) return input;
    if (body.pinned !== undefined && typeof body.pinned !== 'boolean') return { error: '중요 공지 여부를 확인해 주세요.' };
    return { title: input.title, body: input.body, pinned: body.pinned ?? false };
  }
  async function findNotice(request, response) {
    const id = Number(request.params.id);
    const post = Number.isSafeInteger(id) && id > 0 ? await store.findNotice(id) : undefined;
    if (!post) fail(response, 404, 'POST_NOT_FOUND', '공지사항을 찾을 수 없습니다. 삭제되었을 수 있습니다.');
    return post;
  }
  app.get('/api/board/notices', requireUser, async (request, response) => {
    const page = Number(request.query.page ?? 1);
    const query = request.query.q ?? '';
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 || typeof query !== 'string' || query.length > 120) {
      return fail(response, 400, 'NOTICE_VALIDATION', '올바른 페이지 번호와 검색어를 입력해 주세요.');
    }
    const total = await store.countNotices(query.trim());
    response.json({ posts: await store.listNotices(boardPageSize, (page - 1) * boardPageSize, query.trim()), page,
      pageSize: boardPageSize, total, totalPages: Math.max(1, Math.ceil(total / boardPageSize)) });
  });
  app.get('/api/board/notices/:id', requireUser, async (request, response) => {
    const post = await findNotice(request, response);
    if (post) response.json({ post });
  });
  app.post('/api/board/notices', requireUser, requireMaster, async (request, response) => {
    const input = validateNotice(request.body);
    if (input.error) return fail(response, 400, 'NOTICE_VALIDATION', input.error);
    const post = await store.createNotice(input, request.user.id);
    response.status(201).location(`/api/board/notices/${post.id}`).json({ post });
  });
  app.patch('/api/board/notices/:id', requireUser, requireMaster, async (request, response) => {
    const post = await findNotice(request, response);
    if (!post) return;
    const input = validateNotice(request.body);
    if (input.error) return fail(response, 400, 'NOTICE_VALIDATION', input.error);
    await store.updateNotice(post.id, input);
    response.json({ post: await store.findNotice(post.id) });
  });
  app.delete('/api/board/notices/:id', requireUser, requireMaster, async (request, response) => {
    const post = await findNotice(request, response);
    if (!post) return;
    await store.deleteNotice(post.id);
    response.json({ ok: true });
  });
}
