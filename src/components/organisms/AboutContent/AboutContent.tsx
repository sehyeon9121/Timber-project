import { motion } from 'framer-motion';
import { AboutTextBox } from '@/components/molecules/AboutTextBox';
import { cn } from '@/utils/cn';

// public 폴더 이미지에 base URL 자동 추가
const getImageSrc = (src: string): string => {
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (src.startsWith('/') && !src.startsWith(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${src}`;
  }
  return src;
};

export interface AboutContentProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string;
}

export function AboutContent({
  image,
  imageAlt,
  title,
  description,
  className,
}: AboutContentProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-8 md:gap-12 items-start',
        className
      )}
      style={{ maxWidth: '1200px', margin: '0 auto' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="w-full md:w-1/2 flex-shrink-0"
      >
        <img
          src={getImageSrc(image)}
          alt={imageAlt}
          style={{ height: '374px', objectFit: 'cover', width: '100%' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="flex-1"
      >
        <AboutTextBox title={title} description={description} />
      </motion.div>
    </div>
  );
}
