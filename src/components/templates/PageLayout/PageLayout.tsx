import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { NavigationBar } from '@/components/organisms/NavigationBar';
import { FooterContent } from '@/components/organisms/FooterContent';
import { cn } from '@/utils/cn';
import { pageTransition } from '@/utils/animations';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
  hideFooter?: boolean;
  animate?: boolean;
}

export function PageLayout({
  children,
  className,
  hideNavigation = false,
  hideFooter = false,
  animate = true,
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {!hideNavigation && <NavigationBar />}

      {animate ? (
        <motion.main
          className="flex-1"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      ) : (
        <main className="flex-1">
          {children}
        </main>
      )}

      {!hideFooter && <FooterContent />}
    </div>
  );
}
