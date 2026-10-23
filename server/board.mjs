export const resourceCategories = ['reports', 'materials', 'minutes', 'forms'];
export const boardPageSize = 10;

export function validatePost(input) {
  const title = typeof input?.title === 'string' ? input.title.trim() : '';
  const body = typeof input?.body === 'string' ? input.body.trim() : '';
  const division = input?.division;
  if (!title || title.length > 120) return { error: '제목은 1~120자로 입력해 주세요.' };
  if (!body || body.length > 10000) return { error: '내용은 1~10,000자로 입력해 주세요.' };
  if (division !== undefined && division !== null && ![1, 2, 3, 4].includes(division)) return { error: '올바른 게시판을 선택해 주세요.' };
  const category = input?.category;
  const documentType = input?.documentType;
  const meetingDate = input?.meetingDate;
  if (category !== undefined && category !== null && !resourceCategories.includes(category)) return { error: '올바른 자료실을 선택해 주세요.' };
  if (category && division != null) return { error: '자료실에는 세부 게시판을 지정할 수 없습니다.' };
  if (documentType !== undefined && (typeof documentType !== 'string' || documentType.length > 80)) return { error: '문서 종류는 80자 이내로 입력해 주세요.' };
  if (meetingDate !== undefined && (typeof meetingDate !== 'string' || (meetingDate && (!/^\d{4}-\d{2}-\d{2}$/.test(meetingDate) || !Number.isFinite(Date.parse(meetingDate)) || new Date(meetingDate).toISOString().slice(0, 10) !== meetingDate)))) return { error: '올바른 회의일을 입력해 주세요.' };
  return { title, body, division, category, documentType, meetingDate };
}

export function registerBoardRoutes(app, store, requireUser, attachments) {
  const fail = (response, status, code, message) => response.status(status).json({ code, message });
  async function findPost(request, response) {
    const id = Number(request.params.id);
    const post = Number.isSafeInteger(id) && id > 0 ? await store.findPost(id) : undefined;
    if (!post) fail(response, 404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다. 삭제되었을 수 있습니다.');
    return post;
  }
  app.get('/api/board/posts', async (request, response) => {
    const page = Number(request.query.page ?? 1);
    const query = request.query.q ?? '';
    if (typeof query !== 'string' || query.length > 120) {
      return fail(response, 400, 'POST_SEARCH_VALIDATION', '검색어는 최대 120자로 입력해 주세요.');
    }
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) {
      return fail(response, 400, 'POST_VALIDATION', '올바른 페이지 번호를 입력해 주세요.');
    }
    const division = request.query.division === 'activities' ? null
      : request.query.division === undefined ? undefined : Number(request.query.division);
    if (division !== undefined && division !== null && ![1, 2, 3, 4].includes(division)) {
      return fail(response, 400, 'POST_VALIDATION', '올바른 게시판을 선택해 주세요.');
    }
    const category = request.query.category ?? null;
    if (category !== null && !resourceCategories.includes(category)) return fail(response, 400, 'POST_VALIDATION', '올바른 자료실을 선택해 주세요.');
    if (category && division != null) return fail(response, 400, 'POST_VALIDATION', '자료실에는 세부 게시판을 지정할 수 없습니다.');
    const [total, posts] = await Promise.all([
      store.countPosts(division, query.trim(), category),
      store.listPosts(boardPageSize, (page - 1) * boardPageSize, division, query.trim(), category),
    ]);
    if (category) {
      await Promise.all(posts.map(async post => {
        post.attachments = await store.listAttachments('posts', post.id);
      }));
    }
    response.json({ posts, page,
      pageSize: boardPageSize, total, totalPages: Math.max(1, Math.ceil(total / boardPageSize)) });
  });
  app.get('/api/board/posts/:id', async (request, response) => {
    const post = await findPost(request, response);
    if (post) response.json({ post: await attachments.enrich('posts', post, request.user) });
  });
  app.post('/api/board/posts/:id/views', async (request, response) => {
    const post = await findPost(request, response);
    if (!post) return;
    const enriched = await attachments.enrich('posts', post, request.user);
    const viewCount = await store.incrementPostViews(post.id);
    if (viewCount === undefined) return fail(response, 404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.');
    response.json({ post: { ...enriched, viewCount } });
  });
  app.post('/api/board/posts', requireUser, async (request, response) => {
    const input = validatePost(request.body);
    if (input.error) return fail(response, 400, 'POST_VALIDATION', input.error);
    const post = await store.createPost(input, request.user.id);
    response.status(201).location(`/api/board/posts/${post.id}`).json({ post });
  });
  app.patch('/api/board/posts/:id', requireUser, async (request, response) => {
    const post = await findPost(request, response);
    if (!post) return;
    if (post.authorId !== request.user.id) return fail(response, 403, 'POST_FORBIDDEN', '작성한 회원만 글을 수정할 수 있습니다.');
    const input = validatePost(request.body);
    if (input.error) return fail(response, 400, 'POST_VALIDATION', input.error);
    if ((input.category === undefined ? post.category : input.category) && (input.division === undefined ? post.division : input.division) != null) return fail(response, 400, 'POST_VALIDATION', '자료실에는 세부 게시판을 지정할 수 없습니다.');
    await store.updatePost(post.id, { ...input, division: input.division === undefined ? post.division : input.division, category: input.category === undefined ? post.category : input.category, documentType: input.documentType ?? post.documentType, meetingDate: input.meetingDate ?? post.meetingDate });
    response.json({ post: await store.findPost(post.id) });
  });
  app.delete('/api/board/posts/:id', requireUser, async (request, response) => {
    const post = await findPost(request, response);
    if (!post) return;
    if (post.authorId !== request.user.id && request.user.role !== 'master') {
      return fail(response, 403, 'POST_FORBIDDEN', '작성자 또는 관리자만 글을 삭제할 수 있습니다.');
    }
    await attachments.removeFiles('posts', post.id);
    await store.deletePost(post.id);
    response.json({ ok: true });
  });
}
