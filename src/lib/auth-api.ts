export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  affiliation: string;
  lab: string;
  role: 'member' | 'master';
  isAdmin: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt: string | null;
}

export function isAdministrator(user: Pick<User, 'role' | 'isAdmin'> | null | undefined) {
  return Boolean(user && (user.role === 'master' || user.isAdmin));
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
  RESULTS_VALIDATION: 'Check the year, reporting date, and nonnegative integer counts. Cumulative results must be at least the annual results.',
  RESULTS_CONFLICT: 'The results were changed in another window. Reload the latest values before saving.',
  ATTACHMENT_TOO_LARGE: 'This file exceeds 20 MB. Choose a smaller file.',
  ATTACHMENT_EMPTY: 'Empty files cannot be attached.',
  ATTACHMENT_TYPE: 'Unsupported extension. Choose a PDF, HWP/HWPX, PPT/PPTX, Word, Excel, or image file.',
  POST_SEARCH_VALIDATION: 'Enter a search term of up to 120 characters.',
  ATTACHMENT_VALIDATION: 'Choose a supported file of up to 20 MB. Check that the upload has completed.',
  ATTACHMENT_LIMIT: 'You can attach up to 10 files per post.',
  ATTACHMENT_UNAVAILABLE: 'File storage is not connected. Contact the administrator.',
  ATTACHMENT_NOT_FOUND: 'This file could not be found or has not finished uploading.',
  ATTACHMENT_UPLOAD: 'File upload failed. Check your connection and save again.',
  CONNECTION: 'Unable to connect to the server. Please try again shortly.',
  INVALID_CREDENTIALS: 'Please check your username and password.',
  PENDING: 'Your registration is awaiting administrator approval.',
  REJECTED: 'Your registration was rejected. Please contact the administrator.',
  EMAIL_EXISTS: 'This email has already been registered.',
  USERNAME_EXISTS: 'This username is already in use.',
  UNAUTHENTICATED: 'Please sign in to continue.',
  FORBIDDEN: 'You do not have administrator permission for this action.',
  ADMIN_ASSIGNMENT: 'Only approved members can be assigned or removed as administrators. The master account cannot be changed.',
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
  NOTICE_VALIDATION: 'Check the notice title, body, importance setting, and search query.',
};
export function authErrorMessage(error: unknown, language: 'KO' | 'EN') {
  if (error instanceof ApiError) {
    if (language === 'EN') return englishErrors[error.code] || englishErrors.SERVER_ERROR;
    if (error.code === 'INVALID_CREDENTIALS') return '아이디와 비밀번호를 확인해 주세요.';
    return error.message;
  }
  return language === 'EN' ? englishErrors.SERVER_ERROR : '요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.';
}
