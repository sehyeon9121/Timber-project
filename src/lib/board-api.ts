export interface BoardPostSummary {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  division: number | null;
  createdAt: string;
  updatedAt: string;
  pinned?: number;
}
export interface BoardPost extends BoardPostSummary { body: string }
export const boardDivisions = [1, 2, 3, 4] as const;
export function boardDivisionLabel(division: number | null, language: 'KO' | 'EN') {
  return division === null ? (language === 'KO' ? '기존 글' : 'Earlier post')
    : (language === 'KO' ? `${division}세부` : `Division ${division}`);
}
export function boardListHref(division: number | null) {
  return division === null ? '/board?division=all' : `/board?division=${division}`;
}
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
