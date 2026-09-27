import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';
import type { Size, ColorVariant } from '@/types';

export interface IconTextProps {
  icon: string;
  text: string;
  iconPosition?: 'left' | 'right';
  size?: Size;
  color?: ColorVariant;
  gap?: Size;
  className?: string;
}

const gapClasses: Record<Size, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
  '2xl': 'gap-6',
  '3xl': 'gap-8',
};

export function IconText({
  icon,
  text,
  iconPosition = 'left',
  size = 'md',
  color = 'text',
  gap = 'sm',
  className,
}: IconTextProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center',
        gapClasses[gap],
        iconPosition === 'right' && 'flex-row-reverse',
        className
      )}
    >
      <Icon name={icon} size={size} color={color} />
      <Text size={size} color={color}>
        {text}
      </Text>
    </div>
  );
}
