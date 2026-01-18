import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { NewsItemData } from '@/types';

export interface NewsCardProps extends NewsItemData {
  className?: string;
  index?: number;
}

export function NewsCard({
  title,
  date,
  excerpt,
  image,
  className,
  index = 0,
}: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        'border border-gray-200 rounded-lg overflow-hidden mx-auto w-full max-w-[1000px]',
        className
      )}
      style={{ padding: 20 }}
    >
      <div className="flex flex-col md:flex-row" style={{ gap: 20 }}>
        {/* Image - Top on mobile, Left on desktop */}
        {image && (
          <div className="w-full md:w-1/2 flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-[200px] md:h-full object-cover rounded-lg border border-black"
            />
          </div>
        )}

        {/* Content - Bottom on mobile, Right on desktop */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-xl md:text-[24px] font-semibold text-black">
            {title}
          </h3>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200" style={{ marginTop: 10, marginBottom: 10 }} />

          {/* Date */}
          <p className="text-sm md:text-[16px] text-[#00380A]">
            {date}
          </p>

          {/* Read more button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-lg md:text-[20px] text-[#00380A] font-medium hover:underline cursor-pointer"
            style={{ marginTop: 20 }}
          >
            <span>Read more</span>
            <span>{isExpanded ? '−' : '+'}</span>
          </button>

          {/* Excerpt - shown when expanded */}
          {isExpanded && excerpt && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-base md:text-[18px] text-[#444] leading-relaxed mt-4"
            >
              {excerpt}
            </motion.p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
