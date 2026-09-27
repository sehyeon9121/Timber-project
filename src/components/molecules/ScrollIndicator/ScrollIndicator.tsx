import { motion } from 'framer-motion';
import { Link } from '@/components/atoms/Link';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';
import { scrollBounce } from '@/utils/animations';
import type { ColorVariant } from '@/types';

export interface ScrollIndicatorProps {
  href: string;
  color?: ColorVariant;
  className?: string;
}

export function ScrollIndicator({
  href,
  color = 'white',
  className,
}: ScrollIndicatorProps) {
  return (
    <motion.div
      variants={scrollBounce}
      initial="initial"
      animate="animate"
    >
      <Link
        href={href}
        className={cn(
          'inline-flex items-center justify-center',
          'w-12 h-12 rounded-full',
          'border-2 border-current',
          'transition-all duration-[var(--transition-normal)]',
          'hover:scale-110',
          className
        )}
        aria-label="Scroll down"
        disableAnimation
      >
        <Icon name="ChevronDown" size="lg" color={color} />
      </Link>
    </motion.div>
  );
}
