import type { CSSProperties } from 'react';
import { Image } from '@/components/atoms/Image';
import { cn } from '@/utils/cn';

export interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square' | 'rounded';
  className?: string;
  style?: CSSProperties;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

export function ProfileImage({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  className,
  style,
}: ProfileImageProps) {
  return (
    <div
      className={cn(
        'overflow-hidden flex-shrink-0',
        sizeClasses[size],
        shapeClasses[shape],
        !src && 'bg-gray-200',
        className
      )}
      style={style}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          objectFit="cover"
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          {alt}
        </div>
      )}
    </div>
  );
}
