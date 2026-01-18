import { motion } from 'framer-motion';
import { AlumniProfileCard } from '@/components/molecules/AlumniProfileCard';
import { cn } from '@/utils/cn';
import type { TeamMember } from '@/types';

export interface AlumniCardProps extends TeamMember {
  className?: string;
  index?: number;
}

export function AlumniCard({
  name,
  image,
  className,
  index = 0,
}: AlumniCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className={cn('group', className)}
    >
      <AlumniProfileCard image={image} name={name} />
    </motion.article>
  );
}
