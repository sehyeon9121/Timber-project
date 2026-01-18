import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/atoms/Container';
import { SectionTitle } from '@/components/molecules/SectionTitle';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';

export interface TwoColumnSectionProps {
  children: ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  sidebar?: ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'narrow' | 'medium' | 'wide';
  background?: 'white' | 'light' | 'dark' | 'primary';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function TwoColumnSection({
  children,
  id,
  title,
  subtitle,
  sidebar,
  sidebarPosition = 'right',
  sidebarWidth = 'medium',
  background = 'white',
  padding = 'lg',
  className,
}: TwoColumnSectionProps) {
  const backgroundClasses = {
    white: 'bg-white',
    light: 'bg-[var(--color-background)]',
    dark: 'bg-[var(--color-text)] text-white',
    primary: 'bg-[var(--color-primary)] text-white',
  };

  const paddingClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  };

  const sidebarWidthClasses = {
    narrow: 'md:w-64',
    medium: 'md:w-80',
    wide: 'md:w-96',
  };

  return (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <Container maxWidth="xl">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
          >
            <SectionTitle
              title={title || ''}
              subtitle={subtitle}
              color={background === 'dark' || background === 'primary' ? 'white' : 'text'}
              align="left"
            />
            <Spacer size="2xl" />
          </motion.div>
        )}

        <div
          className={cn(
            'flex flex-col md:flex-row gap-8 md:gap-12',
            sidebarPosition === 'left' && 'md:flex-row-reverse'
          )}
        >
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Sidebar */}
          {sidebar && (
            <aside
              className={cn(
                'flex-shrink-0',
                sidebarWidthClasses[sidebarWidth]
              )}
            >
              {sidebar}
            </aside>
          )}
        </div>
      </Container>
    </section>
  );
}
