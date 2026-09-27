import type { ReactNode, ElementType } from 'react';
import { cn } from '@/utils/cn';
import type { HeadingLevel, ColorVariant } from '@/types';

export interface HeadingProps {
  children: ReactNode;
  level?: HeadingLevel;
  color?: ColorVariant;
  className?: string;
  style?: React.CSSProperties;
}

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl font-medium',
  2: 'text-3xl md:text-4xl font-medium',
  3: 'text-2xl md:text-3xl font-medium',
  4: 'text-xl md:text-2xl font-medium',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium',
};

const colorClasses: Record<ColorVariant, string> = {
  primary: 'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  accent: 'text-[var(--color-accent)]',
  text: 'text-[var(--color-text)]',
  light: 'text-[var(--color-text-light)]',
  muted: 'text-[var(--color-text-muted)]',
  white: 'text-white',
  dark: 'text-[var(--color-bg-dark)]',
};

const tagMap: Record<HeadingLevel, ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export function Heading({
  children,
  level = 1,
  color = 'text',
  className,
  style,
}: HeadingProps) {
  const Tag = tagMap[level];

  return (
    <Tag className={cn(levelClasses[level], colorClasses[color], className)} style={style}>
      {children}
    </Tag>
  );
}
