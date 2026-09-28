import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocalizedText } from '@/types';

export function EmptyContentPage({ title }: { title: LocalizedText }) {
  const { language } = useLanguage();
  return (
    <DetailPageLayout title={language === 'KO' ? title.ko : title.en} noHeroImage>
      <div className="min-h-[240px]" />
    </DetailPageLayout>
  );
}
