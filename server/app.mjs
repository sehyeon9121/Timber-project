import express from 'express';
import { getDevelopmentOrigins } from './origins.mjs';
import { registerBoardRoutes } from './board.mjs';
import { publicUser, hashPassword, verifyPassword, validateRegistration, sessionDuration } from './store.mjs';

const cookieName = 'timber_session';
export function readSessionCookie(request) {
  return request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
}

export async function createApp(store, { origins = getDevelopmentOrigins(), secureCookies = false, rateLimit = 30 } = {}) {
  const app = express();
  const dummyHash = await hashPassword('unused-login-timing-placeholder');
  const attempts = new Map();
  let activeAuth = 0;
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: secureCookies, path: '/' };
  const fail = (response, status, code, message) => response.status(status).json({ code, message });
  app.disable('x-powered-by');
  app.use('/api', (_request, response, next) => {
    response.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY' });
    next();
  });
  // All writes must originate from the configured site, including login and signup.
  app.use('/api', (request, response, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !origins.includes(request.headers.origin)) {
      return fail(response, 403, 'INVALID_ORIGIN', '허용되지 않은 사이트에서 보낸 요청입니다.');
    }
    next();
  });
  app.use('/api/board', requireUser, express.json({ limit: '64kb' }));
  app.use('/api', express.json({ limit: '8kb' }));
  app.use('/api/auth', (request, response, next) => {
    if (!['/login', '/signup'].includes(request.path) || request.method !== 'POST') return next();
    const now = Date.now();
    for (const [key, value] of attempts) if (value.reset <= now) attempts.delete(key);
    const key = request.ip;
    const value = attempts.get(key) || { count: 0, reset: now + 15 * 60 * 1000 };
    value.count++;
    attempts.set(key, value);
    if (value.count > rateLimit) {
      response.set('Retry-After', String(Math.ceil((value.reset - now) / 1000)));
      return fail(response, 429, 'RATE_LIMIT', '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.');
    }
    if (activeAuth >= 4) return fail(response, 503, 'BUSY', '요청이 많습니다. 잠시 후 다시 시도해 주세요.');
    activeAuth++;
    response.once('finish', () => { activeAuth--; });
    next();
  });

  function requireUser(request, response, next) {
    const user = store.sessionUser(readSessionCookie(request));
    if (!user) return fail(response, 401, 'UNAUTHENTICATED', '로그인이 필요합니다.');
    request.user = user;
    next();
  }
  function requireMaster(request, response, next) {
    if (request.user.role !== 'master') return fail(response, 403, 'FORBIDDEN', '마스터 계정만 접근할 수 있습니다.');
    next();
  }

  app.get('/api/health', (_request, response) => response.json({ ok: true }));
  app.get('/api/auth/me', (request, response) => {
    const user = store.sessionUser(readSessionCookie(request));
    response.json({ user: user ? publicUser(user) : null });
  });
  app.post('/api/auth/signup', async (request, response) => {
    const input = validateRegistration(request.body);
    if (input.error) return fail(response, 400, 'VALIDATION', input.error);
    if (store.findByEmail(input.email)) return fail(response, 409, 'EMAIL_EXISTS', '이미 가입 요청된 이메일입니다.');
    const passwordHash = await hashPassword(input.password);
    // The hash step is asynchronous; recheck duplicates before the insert.
    if (store.findByEmail(input.email)) return fail(response, 409, 'EMAIL_EXISTS', '이미 가입 요청된 이메일입니다.');
    store.addUser(input, passwordHash);
    response.status(201).json({ status: 'pending', message: '가입 요청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.' });
  });
  app.post('/api/auth/login', async (request, response) => {
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = request.body?.password;
    if (typeof password !== 'string' || password.length > 128 || email.length > 254) {
      return fail(response, 400, 'INVALID_CREDENTIALS', '이메일과 비밀번호를 확인해 주세요.');
    }
    const user = store.findByEmail(email);
    const valid = await verifyPassword(password, user?.password_hash || dummyHash);
    if (!user || !valid) return fail(response, 401, 'INVALID_CREDENTIALS', '이메일과 비밀번호를 확인해 주세요.');
    if (user.status === 'pending') return fail(response, 403, 'PENDING', '관리자 승인 대기 중입니다. 승인 후 로그인할 수 있습니다.');
    if (user.status === 'rejected') return fail(response, 403, 'REJECTED', '가입 요청이 거절되었습니다. 관리자에게 문의해 주세요.');
    store.deleteSession(readSessionCookie(request));
    const token = store.createSession(user.id);
    response.cookie(cookieName, token, { ...cookieOptions, maxAge: sessionDuration }).json({ user: publicUser(user) });
  });
  app.post('/api/auth/logout', (request, response) => {
    store.deleteSession(readSessionCookie(request));
    response.clearCookie(cookieName, cookieOptions).json({ ok: true });
  });
  app.get('/api/members/home', requireUser, (request, response) => {
    response.json({ user: publicUser(request.user), message: '승인된 회원 전용 공간입니다.' });
  });
  app.get('/api/admin/users', requireUser, requireMaster, (_request, response) => {
    response.json({ users: store.listMembers() });
  });
  app.patch('/api/admin/users/:id', requireUser, requireMaster, (request, response) => {
    const id = Number(request.params.id);
    const status = request.body?.status;
    if (!Number.isSafeInteger(id) || id < 1 || !['approved', 'rejected'].includes(status)) {
      return fail(response, 400, 'VALIDATION', '승인 또는 거절을 선택해 주세요.');
    }
    if (!store.review(id, status, request.user.id)) return fail(response, 409, 'ALREADY_REVIEWED', '이미 처리되었거나 존재하지 않는 가입 요청입니다.');
    response.json({ user: publicUser(store.findById(id)) });
  });
  registerBoardRoutes(app, store, requireUser);
  app.use('/api', (_request, response) => fail(response, 404, 'NOT_FOUND', '요청한 API를 찾을 수 없습니다.'));
  app.use((error, _request, response, _next) => {
    if (error.type === 'entity.parse.failed') return fail(response, 400, 'VALIDATION', '요청 형식이 올바르지 않습니다.');
    if (error.type === 'entity.too.large') return fail(response, 413, 'VALIDATION', '요청 크기가 너무 큽니다.');
    console.error('Auth server error:', error.message);
    fail(response, 500, 'SERVER_ERROR', '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  });
  return app;
}
