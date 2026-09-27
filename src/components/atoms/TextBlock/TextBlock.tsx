import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/utils/cn';

export interface TextBlockProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function TextBlock({ children, className, style }: TextBlockProps) {
  return (
    <p
      className={cn('text-[18px] text-black leading-relaxed', className)}
      style={style}
    >
      {children}
    </p>
  );
}
