import type { ReactNode } from 'react';
import { Container } from '@/components/atoms/Container';
import { DecoratedSectionHeader } from '@/components/organisms/DecoratedSectionHeader';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';

export interface GridSectionProps {
  children: ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  customGap?: number;
  background?: 'white' | 'light' | 'dark' | 'primary';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  containerMaxWidth?: number;
}

export function GridSection({
  children,
  id,
  title,
  subtitle,
  columns = 3,
  gap = 'md',
  customGap,
  background = 'white',
  padding = 'lg',
  className,
  containerMaxWidth,
}: GridSectionProps) {
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

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4 md:gap-6',
    md: 'gap-6 md:gap-8',
    lg: 'gap-8 md:gap-12',
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
      <Container maxWidth={containerMaxWidth ? 'none' : 'xl'}>
        <div style={containerMaxWidth ? { maxWidth: containerMaxWidth, margin: '0 auto' } : undefined}>
          {(title || subtitle) && (
            <>
              <DecoratedSectionHeader
                title={title || ''}
                subtitle={subtitle}
              />
              <Spacer size="2xl" />
            </>
          )}

          <div
            className={cn('grid', columnClasses[columns], !customGap && gapClasses[gap])}
            style={customGap ? { gap: customGap } : undefined}
          >
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
