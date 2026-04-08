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
  imageTitle?: string;
  title: string;
  description: string;
  className?: string;
}

export function AboutContent({
  image,
  imageAlt,
  imageTitle,
  title,
  description,
  className,
}: AboutContentProps) {
  return (
    <div className={cn('w-full', className)}>
      {imageTitle && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-3xl font-extrabold text-black"
          style={{ marginBottom: '18px', maxWidth: '1200px', margin: '0 auto 18px auto', padding: '0 24px' }}
        >
          {imageTitle}
        </motion.h3>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="relative w-full"
        style={{
          minHeight: '420px',
          aspectRatio: '3006 / 1344',
          backgroundImage: `url(${getImageSrc(image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="relative flex items-center justify-end"
          style={{ padding: '40px', minHeight: '420px' }}
        >
          <div className="max-w-lg">
            <AboutTextBox title={title} description={description} variant="overlay" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
