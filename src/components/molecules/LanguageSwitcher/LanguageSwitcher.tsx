import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';
import { dropdownMenu } from '@/utils/animations';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

export interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'EN', label: t('language.english') },
    { code: 'KO', label: t('language.korean') },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn('relative', className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button
        variant="ghost"
        className="flex items-center gap-1"
        style={{ padding: '20px 4px' }}
        disableAnimation
      >
        <Text size="sm" weight={500}>
          {language === 'EN' ? t('language.english') : t('language.korean')}
        </Text>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="ChevronDown" size="xs" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 min-w-[200px] bg-white border border-gray-200 shadow-sm z-50"
            style={{ marginTop: 0 }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  'flex items-center w-full h-[48px] hover:bg-[#f5f5f5] transition-colors border-b border-gray-100 last:border-b-0',
                  language === lang.code && 'bg-[#f5f5f5]'
                )}
                style={{ paddingLeft: '20px' }}
              >
                <Text size="sm" color="text" weight={500}>
                  {lang.label}
                </Text>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
