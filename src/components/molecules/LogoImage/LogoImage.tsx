import { Link } from '@/components/atoms/Link';
import { Image } from '@/components/atoms/Image';
import { cn } from '@/utils/cn';

export interface LogoImageProps {
  src: string;
  alt: string;
  href?: string;
  width?: number | string;
  height?: number | string;
  external?: boolean;
  className?: string;
}

export function LogoImage({
  src,
  alt,
  href = '/',
  width,
  height,
  external = false,
  className,
}: LogoImageProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('transition-opacity duration-[var(--transition-fast)] hover:opacity-80', className)}
    />
  );

  if (href) {
    return (
      <Link href={href} external={external} className="inline-block">
        {image}
      </Link>
    );
  }

  return image;
}
