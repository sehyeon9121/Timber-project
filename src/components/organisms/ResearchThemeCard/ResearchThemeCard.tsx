import { motion } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Link } from '@/components/atoms/Link';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';
import { staggerItem } from '@/utils/animations';
import type { ResearchTheme } from '@/types';

export interface ResearchThemeCardProps extends ResearchTheme {
  className?: string;
  index?: number;
}

export function ResearchThemeCard({
  title,
  description,
  href,
  className,
  index = 0,
}: ResearchThemeCardProps) {
  return (
    <motion.article
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className={cn(
        'group bg-white rounded-lg shadow-md overflow-hidden',
        'transition-shadow duration-[var(--transition-normal)]',
        'hover:shadow-xl',
        className
      )}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="p-6 md:p-8">
        <Heading level={3} color="text" className="group-hover:text-[var(--color-primary)] transition-colors">
          {title}
        </Heading>

        <Spacer size="md" />

        <Paragraph color="light" size="md" className="leading-relaxed">
          {description}
        </Paragraph>

        <Spacer size="lg" />

        <Link
          href={href}
          variant="primary"
          className="inline-flex items-center gap-2 font-medium"
          disableAnimation
        >
          Learn more
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </Link>
      </div>
    </motion.article>
  );
}
