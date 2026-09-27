import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BackgroundImage } from '@/components/atoms/BackgroundImage';
import { Overlay } from '@/components/atoms/Overlay';
import { HeroContent } from '@/components/organisms/HeroContent';
import { ScrollIndicator } from '@/components/molecules/ScrollIndicator';
import { Heading } from '@/components/atoms/Heading';
import { Span } from '@/components/atoms/Span';
import { Spacer } from '@/components/atoms/Spacer';
import { Link } from '@/components/atoms/Link';
import { Icon } from '@/components/atoms/Icon';
import { HeroDescription } from '@/components/molecules/HeroDescription';
import { cn } from '@/utils/cn';

export interface HeroSectionProps {
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroDescription?: string;
  scrollTarget?: string;
  overlayOpacity?: number;
  minHeight?: 'screen' | 'three-quarter' | 'half' | 'auto';
  height?: number;
  aspectRatio?: string; // e.g., "16/9", "7/4"
  variant?: 'landing' | 'subpage';
  titleAlign?: 'center' | 'bottom-left';
  heroMaxHeight?: number;
  backLink?: {
    href: string;
    label: string;
  };
  children?: ReactNode;
  className?: string;
}

export function HeroSection({
  backgroundImage,
  title,
  subtitle,
  description,
  heroDescription,
  scrollTarget,
  overlayOpacity = 0.65,
  minHeight = 'screen',
  height: _height,
  aspectRatio,
  variant = 'landing',
  titleAlign = 'center',
  heroMaxHeight,
  backLink,
  children,
  className,
}: HeroSectionProps) {
  const minHeightClasses = {
    screen: 'min-h-screen',
    'three-quarter': 'min-h-[75vh]',
    half: 'min-h-[50vh]',
    auto: 'min-h-0',
  };

  // Subpage variant
  if (variant === 'subpage') {
    const hasBackgroundImage = !!backgroundImage;
    const BASE_URL = import.meta.env.BASE_URL || '/';
    // 이미지 경로에 BASE_URL 추가 (이미 포함되어 있지 않은 경우)
    const imageSrc = backgroundImage && !backgroundImage.startsWith(BASE_URL)
      ? `${BASE_URL}${backgroundImage.startsWith('/') ? backgroundImage.slice(1) : backgroundImage}`
      : backgroundImage;

    return (
      <section
        className={cn('hero-section relative overflow-hidden', className)}
        style={!hasBackgroundImage ? { backgroundColor: '#f8f8f8', paddingTop: 120, paddingBottom: 60 } : undefined}
      >
        {hasBackgroundImage && (
          <>
            {/* 이미지가 자연스럽게 종횡비를 유지하도록 img 태그 사용 */}
            <img
              src={imageSrc}
              alt=""
              className={cn('w-full block', heroMaxHeight ? 'object-cover' : 'h-auto')}
              style={heroMaxHeight ? { height: heroMaxHeight, maxHeight: heroMaxHeight } : undefined}
            />
            <Overlay opacity={overlayOpacity} />
          </>
        )}

        <div className={cn(
          'absolute inset-0 z-10 flex flex-col hero-content-container',
          titleAlign === 'bottom-left' ? 'justify-end pb-10' : 'justify-center'
        )}>
          {backLink && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Link
                href={backLink.href}
                variant="white"
                className="inline-flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <Icon name="ArrowLeft" size={16} />
                {backLink.label}
              </Link>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Heading
              level={1}
              color={hasBackgroundImage ? 'white' : 'text'}
              className={cn(
                'text-[1.2rem] md:text-[2.1rem]',
                !hasBackgroundImage && 'text-[#00380A]'
              )}
            >
              {title}
            </Heading>

            {subtitle && (
              <>
                <Spacer size="md" />
                <Span
                  size="xl"
                  color={hasBackgroundImage ? 'white' : 'light'}
                  className={hasBackgroundImage ? 'opacity-90' : 'text-[#444]'}
                >
                  {subtitle}
                </Span>
              </>
            )}

            {heroDescription && (
              <>
                <Spacer size="md" />
                <HeroDescription
                  text={heroDescription}
                  color={hasBackgroundImage ? 'white' : 'dark'}
                />
              </>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // Landing variant (default)
  return (
    <section
      className={cn(
        'hero-section relative flex items-end justify-start overflow-hidden',
        !aspectRatio && minHeightClasses[minHeight],
        className
      )}
      style={aspectRatio ? { aspectRatio, width: '100%' } : undefined}
    >
      {backgroundImage && (
        <>
          <BackgroundImage
            src={backgroundImage}
            className="absolute inset-0 w-full h-full"
            size="cover"
          />
          <Overlay opacity={overlayOpacity} />
        </>
      )}

      <div className="relative z-10 w-full md:w-auto hero-content-container" style={{ paddingBottom: '20px' }}>
        {children || (
          <HeroContent
            subtitle={subtitle || ''}
            title={title}
            description={description || ''}
          />
        )}
      </div>

      {/* Floating scroll indicator */}
      {scrollTarget && (
        <motion.div
          className="absolute bottom-8 right-8 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <ScrollIndicator href={scrollTarget} color="white" />
        </motion.div>
      )}
    </section>
  );
}
