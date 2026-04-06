import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

export interface ResearchCardProps {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  href?: string;
  index?: number;
  className?: string;
}

export function ResearchCard({
  id,
  title,
  description,
  backgroundImage,
  index = 0,
  className,
}: ResearchCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/research/${id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.1 }}
      whileHover={{
        scale: [1, 0.9, 1.02],
        transition: {
          duration: 1.4,
          times: [0, 0.2, 1],
          ease: "easeOut"
        }
      }}
      className={cn(
        'relative block overflow-hidden',
        'h-[400px] max-h-[400px] w-full',
        'group cursor-pointer',
        className
      )}
      style={{
        backgroundImage: `url(${getImageSrc(backgroundImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-start pb-6 md:pb-8" style={{ paddingTop: '50px', paddingLeft: '48px', paddingRight: '48px' }}>
        <h2 className="font-lato text-lg font-semibold text-white md:text-[28px] text-center" style={{ marginBottom: '25px' }}>
          {title}
        </h2>
        <p className="font-open-sans text-base leading-relaxed text-white/90 md:text-lg">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
