import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';
import { DecoratedSectionHeader } from '@/components/organisms/DecoratedSectionHeader';
import { AffiliationLogo } from '@/components/molecules/AffiliationLogo';
import { affiliations } from '@/data/affiliations';

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

export interface AffiliationsSectionProps {
  className?: string;
}

export function AffiliationsSection({ className }: AffiliationsSectionProps) {
  const imageSrc = getImageSrc('/images/leeseunglab/affiliations.png');
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // 스크롤에 따라 이미지를 아래에서 위로 이동 (하단부터 보이는 효과)
  const y = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <section
      ref={sectionRef}
      className={cn('w-full relative overflow-hidden', className)}
      style={{
        height: 560,
        marginTop: 120,
      }}
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute"
        style={{
          top: -150,
          left: 0,
          right: 0,
          bottom: -150,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y,
        }}
      />
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <DecoratedSectionHeader
          title="Hi-Wood"
          subtitle=""
          variant="light"
          useOriginalMarker
        />

        {/* Logos */}
        <div
          className="flex items-center justify-center"
          style={{ marginTop: 45, gap: 20, width: 'calc(100% - 40px)', maxWidth: 620 }}
        >
          {affiliations.map((affiliation) => (
            <AffiliationLogo
              key={affiliation.id}
              name={affiliation.name}
              logo={affiliation.logo}
              url={affiliation.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
