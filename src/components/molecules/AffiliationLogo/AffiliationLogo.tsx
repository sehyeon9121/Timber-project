import { cn } from '@/utils/cn';

const getImageSrc = (src: string): string => {
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (src.startsWith('/') && !src.startsWith(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${src}`;
  }
  return src;
};

export interface AffiliationLogoProps {
  name: string;
  logo: string;
  url: string;
  className?: string;
}

export function AffiliationLogo({ name, logo, url, className }: AffiliationLogoProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center border border-white bg-black/10 transition-opacity hover:opacity-80 overflow-hidden',
        className
      )}
      style={{ flex: '1 1 0', maxWidth: 300, aspectRatio: '300 / 146', minHeight: 0 }}
    >
      <img
        src={getImageSrc(logo)}
        alt={name}
        style={{ maxHeight: 70, maxWidth: '85%', objectFit: 'contain' }}
      />
    </a>
  );
}
