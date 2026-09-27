import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';
import type { ColorVariant, Size } from '@/types';

export interface BulletListProps {
  items: string[];
  color?: ColorVariant;
  size?: Size;
  bulletColor?: ColorVariant;
  className?: string;
}

export function BulletList({
  items,
  color = 'text',
  size = 'md',
  bulletColor = 'secondary',
  className,
}: BulletListProps) {
  const bulletColorClasses: Record<ColorVariant, string> = {
    primary: 'before:bg-[var(--color-primary)]',
    secondary: 'before:bg-[var(--color-secondary)]',
    accent: 'before:bg-[var(--color-accent)]',
    text: 'before:bg-[var(--color-text)]',
    light: 'before:bg-[var(--color-text-light)]',
    muted: 'before:bg-[var(--color-text-muted)]',
    white: 'before:bg-white',
    dark: 'before:bg-[var(--color-bg-dark)]',
  };

  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            'relative pl-6',
            'before:absolute before:left-0 before:top-[0.6em]',
            'before:w-2 before:h-2 before:rounded-full',
            bulletColorClasses[bulletColor]
          )}
        >
          <Text size={size} color={color}>
            {item}
          </Text>
        </li>
      ))}
    </ul>
  );
}
