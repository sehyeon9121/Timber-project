export const boardPageSize = 20;

export function validatePost(input) {
  const title = typeof input?.title === 'string' ? input.title.trim() : '';
  const body = typeof input?.body === 'string' ? input.body.trim() : '';
  if (!title || title.length > 120) return { error: '제목은 1~120자로 입력해 주세요.' };
  if (!body || body.length > 10000) return { error: '내용은 1~10,000자로 입력해 주세요.' };
  return { title, body };
}

export function registerBoardRoutes(app, store, requireUser) {
  const fail = (response, status, code, message) => response.status(status).json({ code, message });
  function findPost(request, response) {
    const id = Number(request.params.id);
    const post = Number.isSafeInteger(id) && id > 0 ? store.findPost(id) : undefined;
    if (!post) fail(response, 404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다. 삭제되었을 수 있습니다.');
    return post;
  }
  app.get('/api/board/posts', requireUser, (request, response) => {
    const page = Number(request.query.page ?? 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) {
      return fail(response, 400, 'POST_VALIDATION', '올바른 페이지 번호를 입력해 주세요.');
    }
    const total = store.countPosts();
    response.json({ posts: store.listPosts(boardPageSize, (page - 1) * boardPageSize), page,
      pageSize: boardPageSize, total, totalPages: Math.max(1, Math.ceil(total / boardPageSize)) });
  });
  app.get('/api/board/posts/:id', requireUser, (request, response) => {
    const post = findPost(request, response);
    if (post) response.json({ post });
  });
  app.post('/api/board/posts', requireUser, (request, response) => {
    const input = validatePost(request.body);
    if (input.error) return fail(response, 400, 'POST_VALIDATION', input.error);
    const post = store.createPost(input, request.user.id);
    response.status(201).location(`/api/board/posts/${post.id}`).json({ post });
  });
  app.patch('/api/board/posts/:id', requireUser, (request, response) => {
    const post = findPost(request, response);
    if (!post) return;
    if (post.authorId !== request.user.id) return fail(response, 403, 'POST_FORBIDDEN', '작성한 회원만 글을 수정할 수 있습니다.');
    const input = validatePost(request.body);
    if (input.error) return fail(response, 400, 'POST_VALIDATION', input.error);
    store.updatePost(post.id, input);
    response.json({ post: store.findPost(post.id) });
  });
  app.delete('/api/board/posts/:id', requireUser, (request, response) => {
    const post = findPost(request, response);
    if (!post) return;
    if (post.authorId !== request.user.id && request.user.role !== 'master') {
      return fail(response, 403, 'POST_FORBIDDEN', '작성자 또는 관리자만 글을 삭제할 수 있습니다.');
    }
    store.deletePost(post.id);
    response.json({ ok: true });
  });
}
