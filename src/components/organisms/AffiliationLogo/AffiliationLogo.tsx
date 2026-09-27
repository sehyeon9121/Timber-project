import { motion } from 'framer-motion';
import { Image } from '@/components/atoms/Image';
import { cn } from '@/utils/cn';
import type { Affiliation } from '@/types';

export interface AffiliationLogoProps extends Affiliation {
  className?: string;
  index?: number;
}

export function AffiliationLogo({
  name,
  logo,
  url,
  className,
  index = 0,
}: AffiliationLogoProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        'block transition-all duration-[var(--transition-normal)]',
        'opacity-70 hover:opacity-100',
        'transform hover:scale-105',
        className
      )}
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        className="h-12 md:h-16 w-auto object-contain"
      />
    </motion.a>
  );
}
