import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { PublicationTitle } from '@/components/molecules/PublicationTitle';
import { PublicationMeta } from '@/components/molecules/PublicationMeta';
import { PublicationLinks } from '@/components/molecules/PublicationLinks';
import type { Publication } from '@/types';

export interface PublicationItemProps extends Publication {
  className?: string;
  index?: number;
}

export function PublicationItem({
  title,
  authors,
  journal,
  year,
  link,
  abstract,
  className,
  index = 0,
}: PublicationItemProps) {
  const [isAbstractOpen, setIsAbstractOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      className={cn(className)}
      style={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <PublicationTitle title={title} link={link} />
      <PublicationMeta authors={authors} journal={journal} year={year} />
      <PublicationLinks
        link={link}
        abstract={abstract}
        onAbstractToggle={() => setIsAbstractOpen(!isAbstractOpen)}
      />
      <AnimatePresence>
        {isAbstractOpen && abstract && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p
              className="leading-relaxed"
              style={{ fontSize: 16, marginTop: 10, color: '#333', marginLeft: 72 }}
            >
              {abstract}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
