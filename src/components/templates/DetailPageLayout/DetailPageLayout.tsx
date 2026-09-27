import type { ReactNode } from 'react';
import { HeroSection } from '../HeroSection';
import { PageLayout } from '../PageLayout';

export interface DetailPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroHeight?: number;
  noHeroImage?: boolean;
  heroMaxHeight?: number;
  titleAlign?: 'center' | 'bottom-left';
  backLink?: {
    href: string;
    label: string;
  };
  className?: string;
}

export function DetailPageLayout({
  children,
  title,
  subtitle,
  heroImage,
  heroDescription,
  heroHeight,
  noHeroImage,
  heroMaxHeight,
  titleAlign,
  backLink,
  className,
}: DetailPageLayoutProps) {
  return (
    <PageLayout>
      <HeroSection
        variant="subpage"
        title={title}
        subtitle={subtitle}
        heroDescription={heroDescription}
        backgroundImage={noHeroImage ? undefined : (heroImage || '/images/leeseunglab/hero-background.jpg')}
        height={heroHeight}
        heroMaxHeight={heroMaxHeight}
        titleAlign={titleAlign}
        backLink={backLink}
      />

      {/* Content Section */}
      <div className={className}>
        {children}
      </div>
    </PageLayout>
  );
}
