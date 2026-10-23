const boardPageSize = 20;

export function registerNoticeRoutes(app, store, requireUser, requireAdmin, attachments) {
  const fail = (response, status, code, message) => response.status(status).json({ code, message });
  function validateNotice(body) {
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    if (!title || title.length > 120) return { error: '제목은 1~120자로 입력해 주세요.' };
    if (body?.body !== undefined && typeof body.body !== 'string') return { error: '내용은 텍스트로 입력해 주세요.' };
    const content = (body.body ?? '').trim();
    if (content.length > 10000) return { error: '내용은 최대 10,000자로 입력해 주세요.' };
    if (body.pinned !== undefined && typeof body.pinned !== 'boolean') return { error: '중요 공지 여부를 확인해 주세요.' };
    return { title, body: content, pinned: body.pinned ?? false };
  }
  async function findNotice(request, response) {
    const id = Number(request.params.id);
    const post = Number.isSafeInteger(id) && id > 0 ? await store.findNotice(id) : undefined;
    if (!post) fail(response, 404, 'POST_NOT_FOUND', '공지사항을 찾을 수 없습니다. 삭제되었을 수 있습니다.');
    return post;
  }
  app.get('/api/board/notices', async (request, response) => {
    const page = Number(request.query.page ?? 1);
    const query = request.query.q ?? '';
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 || typeof query !== 'string' || query.length > 120) {
      return fail(response, 400, 'NOTICE_VALIDATION', '올바른 페이지 번호와 검색어를 입력해 주세요.');
    }
    const [total, posts] = await Promise.all([
      store.countNotices(query.trim()),
      store.listNotices(boardPageSize, (page - 1) * boardPageSize, query.trim()),
    ]);
    response.json({ posts, page,
      pageSize: boardPageSize, total, totalPages: Math.max(1, Math.ceil(total / boardPageSize)) });
  });
  app.get('/api/board/notices/:id', async (request, response) => {
    const post = await findNotice(request, response);
    if (post) response.json({ post: await attachments.enrich('notices', post, request.user) });
  });
  app.post('/api/board/notices/:id/views', async (request, response) => {
    const post = await findNotice(request, response);
    if (!post) return;
    const enriched = await attachments.enrich('notices', post, request.user);
    const viewCount = await store.incrementNoticeViews(post.id);
    if (viewCount === undefined) return fail(response, 404, 'POST_NOT_FOUND', '공지사항을 찾을 수 없습니다.');
    response.json({ post: { ...enriched, viewCount } });
  });
  app.post('/api/board/notices', requireUser, requireAdmin, async (request, response) => {
    const input = validateNotice(request.body);
    if (input.error) return fail(response, 400, 'NOTICE_VALIDATION', input.error);
    const post = await store.createNotice(input, request.user.id);
    response.status(201).location(`/api/board/notices/${post.id}`).json({ post });
  });
  app.patch('/api/board/notices/:id', requireUser, requireAdmin, async (request, response) => {
    const post = await findNotice(request, response);
    if (!post) return;
    const input = validateNotice(request.body);
    if (input.error) return fail(response, 400, 'NOTICE_VALIDATION', input.error);
    await store.updateNotice(post.id, input);
    response.json({ post: await store.findNotice(post.id) });
  });
  app.delete('/api/board/notices/:id', requireUser, requireAdmin, async (request, response) => {
    const post = await findNotice(request, response);
    if (!post) return;
    await attachments.removeFiles('notices', post.id);
    await store.deleteNotice(post.id);
    response.json({ ok: true });
  });
}
