import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface BackgroundImageProps {
  src: string;
  children?: ReactNode;
  className?: string;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  size?: 'cover' | 'contain' | 'auto';
  attachment?: 'scroll' | 'fixed' | 'local';
}

const positionClasses = {
  center: 'bg-center',
  top: 'bg-top',
  bottom: 'bg-bottom',
  left: 'bg-left',
  right: 'bg-right',
};

const sizeClasses = {
  cover: 'bg-cover',
  contain: 'bg-contain',
  auto: 'bg-auto',
};

const attachmentClasses = {
  scroll: 'bg-scroll',
  fixed: 'bg-fixed',
  local: 'bg-local',
};

// public 폴더 이미지에 base URL 자동 추가
const getImageSrc = (src: string): string => {
  // 외부 URL이거나 data URL이면 그대로 반환
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  // 절대 경로이고 base URL이 없으면 추가
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (src.startsWith('/') && !src.startsWith(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${src}`;
  }
  return src;
};

export function BackgroundImage({
  src,
  children,
  className,
  position = 'center',
  size = 'cover',
  attachment = 'scroll',
}: BackgroundImageProps) {
  const resolvedSrc = getImageSrc(src);

  return (
    <div
      className={cn(
        'bg-no-repeat',
        positionClasses[position],
        sizeClasses[size],
        attachmentClasses[attachment],
        className
      )}
      style={{ backgroundImage: `url(${resolvedSrc})` }}
    >
      {children}
    </div>
  );
}
