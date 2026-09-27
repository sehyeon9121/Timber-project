import { cn } from '@/utils/cn';
import type { ColorVariant } from '@/types';

export interface DividerProps {
  variant?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'normal' | 'thick';
  color?: ColorVariant;
  className?: string;
}

const thicknessClasses = {
  horizontal: {
    thin: 'h-px',
    normal: 'h-0.5',
    thick: 'h-1',
  },
  vertical: {
    thin: 'w-px',
    normal: 'w-0.5',
    thick: 'w-1',
  },
};

const colorClasses: Record<ColorVariant, string> = {
  primary: 'bg-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary)]',
  accent: 'bg-[var(--color-accent)]',
  text: 'bg-[var(--color-text)]',
  light: 'bg-[var(--color-text-light)]',
  muted: 'bg-[var(--color-border)]',
  white: 'bg-white',
  dark: 'bg-[var(--color-bg-dark)]',
};

export function Divider({
  variant = 'horizontal',
  thickness = 'thin',
  color = 'muted',
  className,
}: DividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        variant === 'horizontal' ? 'w-full' : 'h-full',
        thicknessClasses[variant][thickness],
        colorClasses[color],
        className
      )}
    />
  );
}
