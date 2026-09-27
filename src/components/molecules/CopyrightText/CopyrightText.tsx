import { Text } from '@/components/atoms/Text';
import { Link } from '@/components/atoms/Link';
import { cn } from '@/utils/cn';

export interface CopyrightTextProps {
  year?: number;
  owner: string;
  links?: Array<{ label: string; href: string }>;
  className?: string;
}

export function CopyrightText({
  year = new Date().getFullYear(),
  owner,
  links = [],
  className,
}: CopyrightTextProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1 text-sm', className)}>
      <Text size="sm" color="light">
        © Copyright {year} | {owner}
      </Text>
      {links.map((link) => (
        <span key={link.href} className="flex items-center gap-1">
          <Text size="sm" color="light">|</Text>
          <Link
            href={link.href}
            external
            variant="footer"
            className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
          >
            <Text size="sm">{link.label}</Text>
          </Link>
        </span>
      ))}
    </div>
  );
}
