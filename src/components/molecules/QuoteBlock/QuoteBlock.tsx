import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface QuoteBlockProps {
  children: ReactNode;
  className?: string;
}

export function QuoteBlock({
  children,
  className,
}: QuoteBlockProps) {
  return (
    <blockquote
      className={cn(
        'pl-4 border-l-4 border-[var(--color-secondary)] italic',
        'text-[var(--color-text-light)]',
        'my-6',
        className
      )}
    >
      {children}
    </blockquote>
  );
}
