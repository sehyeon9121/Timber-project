import { cn } from '@/utils/cn';

export interface PublicationLinksProps {
  link?: string;
  abstract?: string;
  onAbstractToggle?: () => void;
  className?: string;
}

export function PublicationLinks({
  link,
  abstract,
  onAbstractToggle,
  className
}: PublicationLinksProps) {
  if (!link && !abstract) return null;

  return (
    <div className={cn('flex items-center gap-4 mt-2', className)}>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#222D48] hover:text-[var(--color-primary)]"
          style={{ fontSize: 16 }}
        >
          [Paper]
        </a>
      )}
      {abstract && (
        <button
          type="button"
          onClick={onAbstractToggle}
          className="font-semibold text-[#222D48] hover:text-[var(--color-primary)] cursor-pointer"
          style={{ fontSize: 16 }}
        >
          [Abstract]
        </button>
      )}
    </div>
  );
}
