import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { PublicationItem } from '@/components/organisms/PublicationItem';
import type { Publication } from '@/types';

export interface PublicationYearSectionProps {
  year: number;
  publications: Publication[];
  className?: string;
  style?: CSSProperties;
  baseIndex?: number;
}

export function PublicationYearSection({
  year,
  publications,
  className,
  style,
  baseIndex = 0,
}: PublicationYearSectionProps) {
  return (
    <div className={cn(className)} style={style}>
      {/* Year Heading */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="text-3xl text-[#00380A]"
        style={{ fontWeight: 700, marginBottom: 10 }}
      >
        {year}
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut' }}
        className="w-full h-[1px] bg-[#e5e5e5] mb-4 origin-left"
      />

      {/* Publications List */}
      <div>
        {publications.map((publication, index) => (
          <PublicationItem
            key={publication.id}
            {...publication}
            index={baseIndex + index}
          />
        ))}
      </div>
    </div>
  );
}
