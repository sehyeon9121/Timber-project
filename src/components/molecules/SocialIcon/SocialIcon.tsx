import { Link } from '@/components/atoms/Link';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';
import type { Size, SocialPlatform } from '@/types';

export interface SocialIconProps {
  platform: SocialPlatform;
  href: string;
  size?: Size | number;
  strokeWidth?: number;
  className?: string;
}

const platformIcons: Record<SocialPlatform, string> = {
  twitter: 'Twitter',
  google: 'GraduationCap',
  github: 'Github',
  linkedin: 'Linkedin',
  email: 'Mail',
};

const platformLabels: Record<SocialPlatform, string> = {
  twitter: 'Twitter',
  google: 'Google Scholar',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
};

export function SocialIcon({
  platform,
  href,
  size = 'md',
  strokeWidth,
  className,
}: SocialIconProps) {
  const iconName = platformIcons[platform];
  const label = platformLabels[platform];

  return (
    <Link
      href={href}
      external
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center p-2 rounded-full',
        'transition-all duration-[var(--transition-fast)]',
        'hover:bg-gray-100 hover:text-[var(--color-primary)]',
        className
      )}
    >
      <Icon name={iconName} size={size} strokeWidth={strokeWidth} />
    </Link>
  );
}
