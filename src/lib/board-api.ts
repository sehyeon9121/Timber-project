export interface BoardPostSummary {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
export interface BoardPost extends BoardPostSummary { body: string }
export interface BoardPostList {
  posts: BoardPostSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export function boardDate(value: string, language: 'KO' | 'EN') {
  return new Date(value).toLocaleString(language === 'KO' ? 'ko-KR' : 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}
