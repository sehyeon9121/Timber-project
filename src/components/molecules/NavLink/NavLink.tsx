import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';

export interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({
  href,
  label,
  isActive = false,
  className,
  onClick,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      variant="nav"
      className={cn(
        'relative',
        isActive && 'text-[var(--color-primary)]',
        className
      )}
      style={{ padding: '20px 4px' }}
      onClick={onClick}
    >
      <Text
        size="sm"
        weight={500}
        color={isActive ? 'primary' : 'text'}
        className="transition-colors duration-[var(--transition-fast)]"
      >
        {label}
      </Text>
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]" />
      )}
    </Link>
  );
}
