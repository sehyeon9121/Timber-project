import { HeroSection } from '@/components/templates/HeroSection';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

export interface LandingHeroProps {
  className?: string;
}

export function LandingHero({ className }: LandingHeroProps) {
  const { t } = useLanguage();

  return (
    <HeroSection
      backgroundImage="/images/leeseunglab/hero_section.jpg"
      subtitle={t('home.hero.subtitle')}
      title={t('home.hero.title')}
      description={t('home.hero.description')}
      scrollTarget="#about"
      overlayOpacity={0.5}
      aspectRatio="7/4"
      className={cn(className)}
    />
  );
}
