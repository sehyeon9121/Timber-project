import { useLanguage } from '@/contexts/LanguageContext';
import { researchTranslations } from '@/data/researchTranslations';

export function useResearchTranslation() {
  const { language } = useLanguage();
  return (text: string) => language === 'KO' ? text : (researchTranslations[text] ?? text);
}
