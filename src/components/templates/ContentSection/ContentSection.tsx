import type { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/atoms/Container';
import { SectionTitle } from '@/components/molecules/SectionTitle';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';
import { sectionReveal, staggerContainer } from '@/utils/animations';

export interface ContentSectionProps {
  children: ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  background?: 'white' | 'light' | 'dark' | 'primary';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function ContentSection({
  children,
  id,
  title,
  subtitle,
  background = 'white',
  padding = 'lg',
  className,
  style,
  animate = true,
}: ContentSectionProps) {
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

  const content = (
    <>
      {(title || subtitle) && (
        <>
          <SectionTitle
            title={title || ''}
            subtitle={subtitle}
            color={background === 'dark' || background === 'primary' ? 'white' : 'text'}
            align="center"
            animate={animate}
          />
          <Spacer size="2xl" />
        </>
      )}

      {animate ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </>
  );

  if (animate) {
    return (
      <motion.section
        id={id}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className={cn(
          backgroundClasses[background],
          paddingClasses[padding],
          className
        )}
        style={style}
      >
        <Container maxWidth="xl">{content}</Container>
      </motion.section>
    );
  }

  return (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
      style={style}
    >
      <Container maxWidth="xl">{content}</Container>
    </section>
  );
}
