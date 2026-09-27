import { cn } from '@/utils/cn';

export interface PublicationMetaProps {
  authors: string;
  journal: string;
  year: number;
  className?: string;
}

export function PublicationMeta({ authors, journal, year, className }: PublicationMetaProps) {
  return (
    <p className={cn('mt-1', className)} style={{ fontSize: 16, color: '#444' }}>
      {authors} <em>{journal}</em> ({year}).
    </p>
  );
}
