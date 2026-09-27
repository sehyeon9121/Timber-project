import { motion } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Span } from '@/components/atoms/Span';
import { Link } from '@/components/atoms/Link';
import { Image } from '@/components/atoms/Image';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';
import { staggerItem, imageHover } from '@/utils/animations';
import type { NewsItemData } from '@/types';

export interface NewsItemProps extends NewsItemData {
  className?: string;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export function NewsItem({
  title,
  date,
  excerpt,
  image,
  href,
  className,
  index = 0,
  variant = 'default',
}: NewsItemProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
      className={cn(
        'group bg-white rounded-lg shadow-md overflow-hidden',
        'transition-shadow duration-[var(--transition-normal)]',
        'hover:shadow-xl',
        isFeatured && 'md:flex',
        className
      )}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      {image && (
        <motion.div
          className={cn(
            'overflow-hidden',
            isFeatured ? 'md:w-2/5 md:flex-shrink-0' : 'w-full',
            isCompact && 'h-32'
          )}
        >
          <motion.div variants={imageHover}>
            <Image
              src={image}
              alt={title}
              className={cn(
                'w-full h-48 object-cover',
                isFeatured && 'md:h-full',
                isCompact && 'h-32'
              )}
            />
          </motion.div>
        </motion.div>
      )}

      <div className={cn('p-6', isFeatured && 'md:flex-1')}>
        <Span size="xs" color="muted" className="block">
          {formattedDate}
        </Span>

        <Spacer size="xs" />

        <Link href={href} disableAnimation>
          <Heading
            level={isFeatured ? 3 : 4}
            color="text"
            className={cn(
              'group-hover:text-[var(--color-primary)] transition-colors',
              isCompact && 'line-clamp-2'
            )}
          >
            {title}
          </Heading>
        </Link>

        {excerpt && !isCompact && (
          <>
            <Spacer size="sm" />
            <Paragraph
              color="light"
              size="sm"
              className={cn(
                'leading-relaxed',
                !isFeatured && 'line-clamp-3'
              )}
            >
              {excerpt}
            </Paragraph>
          </>
        )}

        <Spacer size="md" />

        <Link
          href={href}
          variant="primary"
          className="inline-flex items-center gap-1 text-sm font-medium"
          disableAnimation
        >
          Read more
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
