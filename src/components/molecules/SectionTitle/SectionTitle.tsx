import { motion } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Span } from '@/components/atoms/Span';
import { cn } from '@/utils/cn';
import { fadeInUp, rotateIn } from '@/utils/animations';
import type { HeadingLevel, ColorVariant } from '@/types';

// public 폴더 이미지에 base URL 자동 추가
const getImageSrc = (src: string): string => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (src.startsWith('/') && !src.startsWith(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${src}`;
  }
  return src;
};

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  level?: HeadingLevel;
  color?: ColorVariant;
  showDecorations?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  animate?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export function SectionTitle({
  title,
  subtitle,
  level = 3,
  color: _color = 'text',
  showDecorations = true,
  align = 'center',
  className,
  animate = true,
}: SectionTitleProps) {
  // Note: _color is reserved for future use
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const content = (
    <>
      {showDecorations && (
        <motion.div
          variants={animate ? rotateIn : undefined}
          className="flex items-center justify-center"
        >
          <img
            src={getImageSrc('/images/leeseunglab/up_green.png')}
            alt=""
            className="w-5 h-5"
          />
        </motion.div>
      )}

      {subtitle && (
        <motion.div variants={animate ? fadeInUp : undefined}>
          <Span
            size="xs"
            color="muted"
            uppercase
            letterSpacing="widest"
            className="font-medium tracking-[0.2em]"
          >
            {subtitle}
          </Span>
        </motion.div>
      )}

      <motion.div variants={animate ? fadeInUp : undefined}>
        <Heading level={level} style={{ fontWeight: 700, color: '#00380A' }}>
          {title}
        </Heading>
      </motion.div>

      {showDecorations && (
        <motion.div
          variants={animate ? rotateIn : undefined}
          className="flex items-center justify-center"
        >
          <img
            src={getImageSrc('/images/leeseunglab/down_green.png')}
            alt=""
            className="w-5 h-5"
          />
        </motion.div>
      )}
    </>
  );

  if (animate) {
    return (
      <motion.div
        className={cn('flex flex-col gap-2', alignClasses[align], className)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', alignClasses[align], className)}>
      {content}
    </div>
  );
}
