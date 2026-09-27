import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { ColorVariant, Size } from '@/types';

export interface SpanProps {
  children: ReactNode;
  color?: ColorVariant;
  size?: Size;
  uppercase?: boolean;
  letterSpacing?: 'normal' | 'wide' | 'wider' | 'widest';
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
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

const letterSpacingClasses = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};

export function Span({
  children,
  color = 'text',
  size = 'md',
  uppercase = false,
  letterSpacing = 'normal',
  className,
}: SpanProps) {
  return (
    <span
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        letterSpacingClasses[letterSpacing],
        uppercase && 'uppercase',
        className
      )}
    >
      {children}
    </span>
  );
}
