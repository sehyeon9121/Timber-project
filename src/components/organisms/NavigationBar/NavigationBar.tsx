import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoImage } from '@/components/molecules/LogoImage';
import { NavLink } from '@/components/molecules/NavLink';
import { DropdownMenu } from '@/components/molecules/DropdownMenu';
import { MenuButton } from '@/components/molecules/MenuButton';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NavigationBarProps {
  className?: string;
}

export function NavigationBar({ className }: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const mainNavItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.research'), href: '/#research' },
  ];

  const publicationsDropdownItems = [
    { label: 'SCIE', href: '/publications/scie' },
    { label: 'KCI', href: '/publications/kci' },
    { label: 'Int. Conference', href: '/publications/international-conference' },
    { label: 'Dom. Conference', href: '/publications/domestic-conference' },
    { label: 'SCOPUS', href: '/publications/scopus' },
  ];

  const peopleDropdownItems = [
    { label: t('nav.ourTeam'), href: '/team' },
    // { label: t('nav.joinUs'), href: '/join-us' },  // ACT INSTITUTE 비활성화
  ];

  const newsDropdownItems = [
    { label: t('nav.newsUpdates'), href: '/news' },
    // { label: t('nav.climateSnacks'), href: '/climate-snacks' },  // 비활성화
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setExpandedMenu(null);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as EventListener);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, [isMobileMenuOpen]);

  const toggleSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setExpandedMenu(null);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'KO' : 'EN');
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  };

  const submenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut' as const,
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.2,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <header
      ref={mobileMenuRef}
      className={cn('bg-white relative', className)}
    >
      <div
        className="flex items-center justify-between nav-container"
        style={{
          maxWidth: '1040px',
          width: '100%',
          margin: '10px auto',
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <LogoImage
            src="/images/leeseunglab/terrer-lab-logo.png"
            alt="Hi-Wood"
            href="/"
            height={51}
            className="object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
            />
          ))}

          {/* <DropdownMenu
            label={t('nav.publications')}
            items={publicationsDropdownItems}
          /> */}

          <DropdownMenu
            label={t('nav.people')}
            items={peopleDropdownItems}
          />

          <DropdownMenu
            label={t('nav.news')}
            items={newsDropdownItems}
          />

          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <MenuButton
          isOpen={isMobileMenuOpen}
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            if (isMobileMenuOpen) {
              setExpandedMenu(null);
            }
          }}
        />
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleNavClick}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="py-2">
              {/* Main Nav Items */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center h-12 hover:bg-gray-50 transition-colors"
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                  onClick={handleNavClick}
                >
                  <Text size="sm" weight={500} color="text">
                    {item.label}
                  </Text>
                </Link>
              ))}

              {/* Publications Accordion - 비활성화 */}
              {/* <div>
                <button
                  type="button"
                  onClick={() => toggleSubmenu('publications')}
                  className="flex items-center justify-between w-full h-12 hover:bg-gray-50 transition-colors"
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <Text size="sm" weight={500} color="text">
                    {t('nav.publications')}
                  </Text>
                  <motion.div
                    animate={{ rotate: expandedMenu === 'publications' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name="ChevronDown" size="sm" color="text" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedMenu === 'publications' && (
                    <motion.div
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="overflow-hidden bg-gray-50"
                    >
                      {publicationsDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center h-11 hover:bg-gray-100 transition-colors"
                          style={{ paddingLeft: '40px', paddingRight: '20px' }}
                          onClick={handleNavClick}
                        >
                          <Text size="sm" weight={500} color="text">
                            {item.label}
                          </Text>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div> */}

              {/* People Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSubmenu('people')}
                  className="flex items-center justify-between w-full h-12 hover:bg-gray-50 transition-colors"
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <Text size="sm" weight={500} color="text">
                    {t('nav.people')}
                  </Text>
                  <motion.div
                    animate={{ rotate: expandedMenu === 'people' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name="ChevronDown" size="sm" color="text" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedMenu === 'people' && (
                    <motion.div
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="overflow-hidden bg-gray-50"
                    >
                      {peopleDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center h-11 hover:bg-gray-100 transition-colors"
                          style={{ paddingLeft: '40px', paddingRight: '20px' }}
                          onClick={handleNavClick}
                        >
                          <Text size="sm" weight={500} color="text">
                            {item.label}
                          </Text>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* News Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSubmenu('news')}
                  className="flex items-center justify-between w-full h-12 hover:bg-gray-50 transition-colors"
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <Text size="sm" weight={500} color="text">
                    {t('nav.news')}
                  </Text>
                  <motion.div
                    animate={{ rotate: expandedMenu === 'news' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name="ChevronDown" size="sm" color="text" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedMenu === 'news' && (
                    <motion.div
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="overflow-hidden bg-gray-50"
                    >
                      {newsDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center h-11 hover:bg-gray-100 transition-colors"
                          style={{ paddingLeft: '40px', paddingRight: '20px' }}
                          onClick={handleNavClick}
                        >
                          <Text size="sm" weight={500} color="text">
                            {item.label}
                          </Text>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Toggle */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center justify-between w-full h-12 hover:bg-gray-50 transition-colors"
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <Text size="sm" weight={500} color="text">
                    {language === 'EN' ? 'English' : '한국어'}
                  </Text>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors',
                        language === 'EN' ? 'text-[var(--color-primary)]' : 'text-gray-400'
                      )}
                    >
                      EN
                    </span>
                    <div className="relative w-10 h-5 bg-gray-200 rounded-full">
                      <motion.div
                        className="absolute top-0.5 w-4 h-4 bg-[var(--color-primary)] rounded-full"
                        animate={{ left: language === 'EN' ? 2 : 22 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors',
                        language === 'KO' ? 'text-[var(--color-primary)]' : 'text-gray-400'
                      )}
                    >
                      KO
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
