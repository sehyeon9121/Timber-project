import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu } from '@/components/molecules/DropdownMenu';
import { MenuButton } from '@/components/molecules/MenuButton';
import { AccountMenu } from '@/components/molecules/AccountMenu';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import { siteNavigation } from '@/data/siteNavigation';
import styles from './NavigationBar.module.css';

export interface NavigationBarProps { className?: string; }

export function NavigationBar({ className }: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const ko = language === 'KO';
  const groups = siteNavigation.map(group => ({
      ...group,
      title: ko ? group.label.ko : group.label.en,
      links: group.items.map(item => ({ href: item.href, label: ko ? item.label.ko : item.label.en })),
    }));

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    function handleOutside(event: MouseEvent | TouchEvent) {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setExpandedMenu(null);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setExpandedMenu(null);
        menuButtonRef.current?.querySelector('button')?.focus();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => { setIsMobileMenuOpen(false); setExpandedMenu(null); };
  const languageControl = (
    <button type="button" className={styles.languageButton}
      onClick={() => setLanguage(ko ? 'EN' : 'KO')}
      aria-label={ko ? 'Switch to English' : '한국어로 전환'}>
      {ko ? 'EN' : 'KO'}
    </button>
  );

  return (
    <header ref={mobileMenuRef} className={cn('bg-white relative', className)}>
      <div className={cn('flex items-center justify-between nav-container', styles.container)}>
        {/* Logo */}
        <div className={styles.brand}>
          <Link href="/" aria-label="국토교통부 · KAIA 국토교통과학기술진흥원" className={cn(styles.brandLink, 'transition-opacity duration-[var(--transition-fast)] hover:opacity-80')}>
            <span className={styles.ministryLogoFrame}>
              <img
                src="/images/leeseunglab/ministry-land-transport-logo.jpg"
                alt=""
                width="842"
                height="595"
                className={styles.ministryLogo}
              />
            </span>
            <span className={styles.brandDivider} aria-hidden="true" />
            <img
              src="/images/leeseunglab/kaia-logo-ko.jpg"
              alt=""
              width="857"
              height="552"
              className={styles.brandLogo}
            />
            <Text
              size="lg"
              weight={700}
              color="text"
              className={styles.brandText}
            >
              KAIA 국토교통<wbr />과학기술<wbr />진흥원
            </Text>
          </Link>
        </div>

        <div className={styles.desktopUtilities}>
          {languageControl}
          <div className={styles.accountLinks}><AccountMenu /></div>
        </div>
        <div ref={menuButtonRef} className={styles.mobileToggle}>
          <MenuButton
            isOpen={isMobileMenuOpen}
            onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setExpandedMenu(null); }}
          />
        </div>
      </div>

      <nav className={styles.desktop} aria-label={ko ? '주 메뉴' : 'Main navigation'}>
        <div className={styles.publicLinks}>
          {groups.map(group => (
            <DropdownMenu key={group.id} label={group.title} items={group.links} className={styles.menuGroup} />
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div className={cn('fixed inset-0 bg-black/50 z-40', styles.mobileOnly)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />
            <motion.nav
              aria-label={ko ? '모바일 메뉴' : 'Mobile navigation'}
              className={cn('absolute top-full left-0 right-0 bg-white shadow-lg z-50', styles.mobileOnly, styles.mobilePanel)}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {groups.map(group => (
                <div key={group.id}>
                  <button type="button" className={styles.mobileGroupButton}
                    aria-expanded={expandedMenu === group.id} aria-controls={`mobile-${group.id}`}
                    onClick={() => setExpandedMenu(expandedMenu === group.id ? null : group.id)}>
                    {group.title}
                    <Icon name={expandedMenu === group.id ? 'ChevronUp' : 'ChevronDown'} size={18} />
                  </button>
                  <div id={`mobile-${group.id}`} hidden={expandedMenu !== group.id} className={styles.mobileSubmenu}>
                    {group.links.map(item => (
                      <Link key={item.href} href={item.href} className={styles.mobileLink} onClick={closeMenu}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className={styles.mobileUtilities}>
                <AccountMenu onNavigate={closeMenu} />
                {languageControl}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
