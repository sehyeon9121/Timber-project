export interface User {
  id: number;
  name: string;
  email: string;
  affiliation: string;
  role: 'member' | 'master';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt: string | null;
}

export class ApiError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export async function authApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', 'CONNECTION');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') window.dispatchEvent(new Event('auth:expired'));
    throw new ApiError(data?.message || '요청을 처리할 수 없습니다.', data?.code || 'SERVER_ERROR');
  }
  if (!data) throw new ApiError('서버 응답을 확인할 수 없습니다.', 'SERVER_ERROR');
  return data as T;
}

const englishErrors: Record<string, string> = {
  CONNECTION: 'Unable to connect to the server. Please try again shortly.',
  INVALID_CREDENTIALS: 'Please check your email and password.',
  PENDING: 'Your registration is awaiting administrator approval.',
  REJECTED: 'Your registration was rejected. Please contact the administrator.',
  EMAIL_EXISTS: 'This email has already been registered.',
  UNAUTHENTICATED: 'Please sign in to continue.',
  FORBIDDEN: 'Only the master account can access this page.',
  RATE_LIMIT: 'Too many attempts. Please try again later.',
  BUSY: 'The server is busy. Please try again shortly.',
  ALREADY_REVIEWED: 'This request has already been reviewed or no longer exists.',
  VALIDATION: 'Please check the information you entered.',
  INVALID_ORIGIN: 'This site is not allowed to send this request.',
  SERVER_ERROR: 'A server error occurred. Please try again shortly.',
  SERVICE_UNAVAILABLE: 'The sign-in service is temporarily unavailable. Please try again shortly.',
  POST_NOT_FOUND: 'This post could not be found. It may have been deleted.',
  POST_FORBIDDEN: 'You do not have permission to change this post.',
  POST_VALIDATION: 'Use 1–120 characters for the title and 1–10,000 for the body.',
};
export function authErrorMessage(error: unknown, language: 'KO' | 'EN') {
  if (error instanceof ApiError) return language === 'EN' ? englishErrors[error.code] || englishErrors.SERVER_ERROR : error.message;
  return language === 'EN' ? englishErrors.SERVER_ERROR : '요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.';
}
