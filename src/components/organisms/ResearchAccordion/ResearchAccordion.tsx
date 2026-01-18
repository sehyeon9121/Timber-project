import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ResearchTheme } from '@/types';
import { Image } from '@/components/atoms/Image';

interface ResearchAccordionProps extends ResearchTheme {
  index?: number;
  defaultExpanded?: boolean;
}

export function ResearchAccordion({
  title,
  description,
  expandIcon = '/images/leeseunglab/6523f4c51588c6155ad77195_down green.png',
  collapseIcon = '/images/leeseunglab/6523f4c60927b19b46b5ec99_up green.png',
  index = 0,
  defaultExpanded = false,
}: ResearchAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="border-b border-gray-200"
    >
      {/* Accordion Header */}
      <button
        onClick={toggleAccordion}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-primary focus:outline-none"
        aria-expanded={isExpanded}
      >
        <h3 className="font-lato text-xl font-bold text-[#1a1a1a] md:text-2xl">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-4 flex-shrink-0"
        >
          <Image
            src={isExpanded ? collapseIcon : expandIcon}
            alt={isExpanded ? 'Collapse' : 'Expand'}
            className="h-6 w-6"
          />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6">
              <p className="font-open-sans text-base leading-relaxed text-gray-600 md:text-lg">
                {description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
