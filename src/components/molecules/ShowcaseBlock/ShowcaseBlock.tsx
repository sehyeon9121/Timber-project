import { motion } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';

export interface ShowcaseBlockProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string;
}

export function ShowcaseBlock({
  image,
  imageAlt,
  title,
  description,
  className,
}: ShowcaseBlockProps) {
  return (
    <div className={cn('w-full', className)}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full overflow-hidden rounded-lg"
      >
        <img
          src={image}
          alt={imageAlt}
          className="w-full object-cover"
          style={{ height: '450px' }}
        />
      </motion.div>

      <Spacer size="lg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Heading level={3} style={{ fontWeight: 700, color: '#1B3A4B' }}>
          {title}
        </Heading>

        <Spacer size="md" />

        <Paragraph color="light" size="lg" className="leading-relaxed">
          {description}
        </Paragraph>
      </motion.div>
    </div>
  );
}
