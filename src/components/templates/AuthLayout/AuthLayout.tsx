import type { ReactNode } from 'react';
import { PageLayout } from '@/components/templates/PageLayout';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import styles from '@/styles/auth.module.css';

export interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  wide?: boolean;
}
export function AuthLayout({ title, description, children, wide = false }: AuthLayoutProps) {
  return <PageLayout animate={false}>
    <section className={`${styles.shell} ${wide ? styles.wide : ''}`}>
      <div className={styles.card}>
        <Heading level={1} className={styles.title}>{title}</Heading>
        <Paragraph className={styles.description}>{description}</Paragraph>
        {children}
      </div>
    </section>
  </PageLayout>;
}
