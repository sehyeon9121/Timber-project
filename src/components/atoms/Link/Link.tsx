import type { ReactNode } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { scaleOnHover } from '@/utils/animations';
import type { LinkVariant, ColorVariant } from '@/types';

export interface LinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: LinkVariant;
  color?: ColorVariant;
  className?: string;
  style?: React.CSSProperties;
  disableAnimation?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

const variantClasses: Record<LinkVariant, string> = {
  default: 'hover:opacity-80 transition-opacity duration-[var(--transition-fast)]',
  nav: 'hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)]',
  footer: 'hover:text-[var(--color-secondary)] transition-colors duration-[var(--transition-fast)]',
  button: 'inline-flex items-center justify-center px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-light)] transition-colors duration-[var(--transition-normal)]',
  primary: 'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors duration-[var(--transition-fast)]',
  muted: 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-[var(--transition-fast)]',
  white: 'text-white hover:text-white/80 transition-colors duration-[var(--transition-fast)]',
};

const colorClasses: Record<ColorVariant, string> = {
  primary: 'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  accent: 'text-[var(--color-accent)]',
  text: 'text-[var(--color-text)]',
  light: 'text-[var(--color-text-light)]',
  muted: 'text-[var(--color-text-muted)]',
  white: 'text-white',
  dark: 'text-[var(--color-bg-dark)]',
};

export function Link({
  href,
  children,
  external = false,
  variant = 'default',
  color,
  className,
  style,
  disableAnimation = false,
  onClick,
  'aria-label': ariaLabel,
}: LinkProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const classes = cn(
    variantClasses[variant],
    color && colorClasses[color],
    className
  );

  const shouldAnimate = variant === 'button' && !disableAnimation;

  // Handle hash links for smooth scrolling
  const handleHashClick = (e: React.MouseEvent) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const targetPath = path || '/';
      const currentPath = location.pathname;

      // Normalize paths for comparison (handle base path /leeseunglab/)
      const normalizeHomePath = (p: string) => {
        const normalized = p.replace(/\/$/, ''); // Remove trailing slash
        return normalized === '' || normalized === '/leeseunglab' ? '/' : normalized.replace('/leeseunglab', '');
      };

      const normalizedCurrent = normalizeHomePath(currentPath);
      const normalizedTarget = normalizeHomePath(targetPath);

      if (hash) {
        e.preventDefault();

        // Check if we're on the same page
        if (normalizedCurrent === normalizedTarget) {
          // Same page - smooth scroll
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', href);
          }
        } else {
          // Different page - navigate with scroll target in state
          navigate(targetPath, { state: { scrollTo: hash } });
        }
      }
    }
    onClick?.();
  };

  if (external || href.startsWith('http') || href.startsWith('mailto:')) {
    if (shouldAnimate) {
      return (
        <motion.a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={classes}
          style={style}
          onClick={onClick}
          aria-label={ariaLabel}
          variants={scaleOnHover}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {children}
        </motion.a>
      );
    }
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={classes}
        style={style}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  if (shouldAnimate) {
    return (
      <motion.div
        variants={scaleOnHover}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="inline-block"
      >
        <RouterLink to={href} className={classes} style={style} onClick={handleHashClick} aria-label={ariaLabel}>
          {children}
        </RouterLink>
      </motion.div>
    );
  }

  return (
    <RouterLink to={href} className={classes} style={style} onClick={handleHashClick} aria-label={ariaLabel}>
      {children}
    </RouterLink>
  );
}
