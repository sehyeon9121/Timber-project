import { cn } from '@/utils/cn';
import * as LucideIcons from 'lucide-react';
import type { Size, ColorVariant } from '@/types';

export interface IconProps {
  name: string;
  size?: Size | number;
  color?: ColorVariant;
  className?: string;
  strokeWidth?: number;
}

const sizeMap: Record<Size, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
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

export function Icon({
  name,
  size = 'md',
  color,
  className,
  strokeWidth = 2,
}: IconProps) {
  // Get the icon component from Lucide
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>;
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const pixelSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={strokeWidth}
      className={cn(color && colorClasses[color], className)}
    />
  );
}
