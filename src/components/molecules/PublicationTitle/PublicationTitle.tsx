import { cn } from '@/utils/cn';

export interface PublicationTitleProps {
  title: string;
  link?: string;
  className?: string;
}

export function PublicationTitle({ title, link, className }: PublicationTitleProps) {
  return (
    <h4 className={cn('font-bold leading-relaxed text-black', className)} style={{ fontSize: 19, marginBottom: 10 }}>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-[var(--color-primary)]"
          style={{ textDecoration: 'underline' }}
        >
          {title}
        </a>
      ) : (
        <span className="text-black">{title}</span>
      )}
    </h4>
  );
}
