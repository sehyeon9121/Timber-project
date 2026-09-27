import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { ColorVariant, Size } from '@/types';

export interface TextProps {
  children: ReactNode;
  color?: ColorVariant;
  size?: Size;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  uppercase?: boolean;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'label';
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

const weightClasses: Record<number, string> = {
  100: 'font-thin',
  200: 'font-extralight',
  300: 'font-light',
  400: 'font-normal',
  500: 'font-medium',
  600: 'font-semibold',
  700: 'font-bold',
  800: 'font-extrabold',
  900: 'font-black',
};

export function Text({
  children,
  color = 'text',
  size = 'md',
  weight = 400,
  uppercase = false,
  className,
  as: Component = 'span',
}: TextProps) {
  return (
    <Component
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        weightClasses[weight],
        uppercase && 'uppercase',
        className
      )}
    >
      {children}
    </Component>
  );
}
