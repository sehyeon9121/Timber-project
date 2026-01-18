import type { ReactNode } from 'react';
import { HeroSection } from '../HeroSection';
import { PageLayout } from '../PageLayout';

export interface DetailPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroHeight?: number;
  noHeroImage?: boolean;
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
  heroHeight,
  noHeroImage,
  backLink,
  className,
}: DetailPageLayoutProps) {
  return (
    <PageLayout>
      <HeroSection
        variant="subpage"
        title={title}
        subtitle={subtitle}
        backgroundImage={noHeroImage ? undefined : (heroImage || '/images/leeseunglab/hero-background.jpg')}
        height={heroHeight}
        backLink={backLink}
      />

      {/* Content Section */}
      <div className={className}>
        {children}
      </div>
    </PageLayout>
  );
}
