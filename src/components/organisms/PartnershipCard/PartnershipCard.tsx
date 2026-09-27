import { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Icon } from '@/components/atoms/Icon';
import {
  DemonstrationImageSection,
  type DemonstrationImage,
} from '@/components/organisms/DemonstrationImageSection';
import { cn } from '@/utils/cn';
import type { ParticipatingInstitution } from '@/types';
import styles from './PartnershipCard.module.css';

const getImageSrc = (src: string): string => {
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const fullPath = `/images/leeseunglab/${src}`;
  if (!fullPath.startsWith(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${fullPath}`;
  }
  return fullPath;
};

export interface PartnershipCardProps {
  title: string;
  description: string;
  icon: string;
  institutions: ParticipatingInstitution[];
  images?: DemonstrationImage[];
  className?: string;
}

export function PartnershipCard({
  title,
  description,
  icon,
  institutions,
  images,
  className,
}: PartnershipCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const articleRef = useRef<HTMLElement>(null);

  // 카드가 펼쳐지는 애니메이션이 끝나면 카드 전체가 보이도록 스크롤
  const handleAnimationComplete = () => {
    if (!isOpen || !articleRef.current) return;
    const rect = articleRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const padding = 24;

    // 카드 하단이 화면 밖에 있으면 그만큼 아래로 스크롤
    if (rect.bottom > viewportHeight) {
      const overflow = rect.bottom - viewportHeight + padding;
      // 스크롤 후에도 카드 상단이 화면 밖으로 밀려나지 않도록 제한
      const maxScroll = Math.max(rect.top - padding, 0);
      window.scrollBy({
        top: Math.min(overflow, maxScroll),
        behavior: 'smooth',
      });
    }
  };

  return (
    <article
      ref={articleRef}
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header (clickable) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? contentId : undefined}
        className={cn(styles.header, 'transition-colors hover:bg-gray-50')}
      >
        <div className={styles.label}>
          <div
            className={cn(styles.icon, 'rounded-full bg-[#1B3A4B]/10')}
          >
            <Icon name={icon} size={20} className="text-[#1B3A4B]" />
          </div>
          <Heading level={3} className={styles.title} style={{ fontWeight: 700, color: '#1B3A4B', margin: 0 }}>
            {title}
          </Heading>
        </div>
        <motion.div
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <Icon name="ChevronDown" size={18} className="text-[#1B3A4B]" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            onAnimationComplete={handleAnimationComplete}
            style={{ overflow: 'hidden' }}
          >
            <div
              className={cn(styles.content, 'border-t border-gray-200')}
            >
              <Paragraph color="light" size="sm" className="leading-relaxed">
                {description}
              </Paragraph>

              {images && images.length > 0 && (
                <DemonstrationImageSection images={images} columns={2} />
              )}

              {institutions.length > 0 && (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  style={{ gap: 12, marginTop: 20 }}
                >
                  {institutions.map((institution, idx) => {
                    const cardContent = (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                        className={cn(
                          'bg-white rounded-lg border border-gray-200',
                          'flex flex-col items-center justify-center',
                          styles.institution,
                          'transition-shadow hover:shadow-md',
                          institution.url && 'cursor-pointer'
                        )}
                      >
                        <img
                          src={getImageSrc(institution.logo)}
                          alt={institution.name}
                          className={cn('w-full object-contain', styles.logo)}
                        />
                        <span className="text-xs text-gray-700 text-center line-clamp-2">
                          {institution.name}
                        </span>
                        {institution.url && (
                          <span className="text-[10px] text-[#1B3A4B] mt-1 flex items-center gap-1">
                            <Icon name="ExternalLink" size={10} />
                            Website
                          </span>
                        )}
                      </motion.div>
                    );

                    return institution.url ? (
                      <a
                        key={idx}
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <div key={idx}>{cardContent}</div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
