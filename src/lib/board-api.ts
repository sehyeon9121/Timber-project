export interface BoardPostSummary {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  division: number | null;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  pinned?: number;
  coverImageId?: string | null;
  coverImageName?: string | null;
}
export interface BoardAttachment {
  id: string;
  name: string;
  size: number;
  contentType: string;
  state: 'pending' | 'ready';
}
export interface BoardPost extends BoardPostSummary { body: string; attachments?: BoardAttachment[] }
export type BoardListEntry = Omit<BoardPostSummary, 'id' | 'viewCount'> & { id: number | string; href?: string; viewCount?: number };
export const boardDivisions = [1, 2, 3, 4] as const;
export function boardDivisionLabel(division: number | null, language: 'KO' | 'EN') {
  return division === null ? (language === 'KO' ? '연구단 활동' : 'Project Activities')
    : (language === 'KO' ? `${division}세부` : `Division ${division}`);
}
export function boardListHref(division: number | null) {
  return division === null ? '/board' : `/board?division=${division}`;
}
export interface BoardPostList {
  posts: BoardPostSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export function boardPageNumbers(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  return Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
}
// Published photo records follow member posts and share the same page size.
export function boardPageWithArchive(data: BoardPostList, archive: BoardListEntry[]) {
  const offset = (data.page - 1) * data.pageSize;
  const archiveOffset = Math.max(0, offset - data.total);
  const archivedPosts = offset + data.posts.length >= data.total
    ? archive.slice(archiveOffset, archiveOffset + data.pageSize - data.posts.length) : [];
  const total = data.total + archive.length;
  return { ...data, posts: [...data.posts, ...archivedPosts], total,
    totalPages: Math.max(1, Math.ceil(total / data.pageSize)) };
}
export function boardDate(value: string, language: 'KO' | 'EN') {
  return new Date(value).toLocaleString(language === 'KO' ? 'ko-KR' : 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}
