import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface OverlayProps {
  children?: ReactNode;
  gradient?: 'none' | 'dark' | 'light' | 'hero';
  opacity?: number;
  className?: string;
}

const gradientClasses = {
  none: '',
  dark: 'bg-black/50',
  light: 'bg-white/50',
  hero: 'bg-gradient-to-b from-black/70 via-black/40 to-transparent',
};

export function Overlay({
  children,
  gradient = 'dark',
  opacity,
  className,
}: OverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0',
        gradientClasses[gradient],
        className
      )}
      style={opacity !== undefined ? { opacity } : undefined}
    >
      {children}
    </div>
  );
}
