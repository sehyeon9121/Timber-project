import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { buttonHover } from '@/utils/animations';
import type { ButtonVariant, Size } from '@/types';

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  disableAnimation?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: 'button';
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    as: 'a';
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]',
  secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90',
  outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
  ghost: 'text-[var(--color-text)] hover:bg-gray-100',
  link: 'text-[var(--color-primary)] hover:underline p-0',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
  '2xl': 'px-10 py-5 text-2xl',
  '3xl': 'px-12 py-6 text-3xl',
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    disableAnimation = false,
    as = 'button',
    ...rest
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center rounded transition-colors duration-[var(--transition-normal)]',
    variantClasses[variant],
    variant !== 'link' && sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const motionProps = !disableAnimation && !disabled
    ? {
        variants: buttonHover,
        initial: 'initial',
        whileHover: 'hover',
        whileTap: 'tap',
      }
    : {};

  if (as === 'a') {
    const { href, ...anchorProps } = rest as Omit<ButtonAsAnchor, keyof ButtonBaseProps | 'as'>;
    return (
      <motion.a
        href={href}
        className={classes}
        {...motionProps}
        {...(anchorProps as HTMLMotionProps<'a'>)}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      {...motionProps}
      {...(rest as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
