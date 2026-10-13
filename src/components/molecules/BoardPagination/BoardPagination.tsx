import { Button } from '@/components/atoms/Button';
import { boardPageNumbers } from '@/lib/board-api';
import styles from '@/styles/board.module.css';

export interface BoardPaginationProps {
  page: number;
  totalPages: number;
  language: 'KO' | 'EN';
  onPageChange: (page: number) => void;
}
export function BoardPagination({ page, totalPages, language, onPageChange }: BoardPaginationProps) {
  const ko = language === 'KO';
  return <nav className={styles.pagination} aria-label={ko ? '게시판 페이지' : 'Board pages'}>
    <Button type="button" className={styles.secondary} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>{ko ? '이전' : 'Previous'}</Button>
    {boardPageNumbers(page, totalPages).map(number => <Button key={number} type="button"
      className={`${styles.secondary} ${styles.pageNumber} ${page === number ? styles.currentPage : ''}`}
      aria-label={ko ? `${number}페이지` : `Page ${number}`} aria-current={page === number ? 'page' : undefined}
      onClick={() => onPageChange(number)}>{number}</Button>)}
    <Button type="button" className={styles.secondary} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>{ko ? '다음' : 'Next'}</Button>
    <span className={styles.pageStatus} aria-live="polite">{page} / {totalPages}</span>
  </nav>;
}
