import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { ColorVariant, Size } from '@/types';

export interface ParagraphProps {
  children: ReactNode;
  color?: ColorVariant;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: 'text-xs leading-relaxed',
  sm: 'text-sm leading-relaxed',
  md: 'text-base leading-relaxed',
  lg: 'text-lg leading-relaxed',
  xl: 'text-xl leading-relaxed',
  '2xl': 'text-2xl leading-relaxed',
  '3xl': 'text-3xl leading-relaxed',
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

export function Paragraph({
  children,
  color = 'text',
  size = 'md',
  className,
}: ParagraphProps) {
  return (
    <p className={cn(sizeClasses[size], colorClasses[color], className)}>
      {children}
    </p>
  );
}
