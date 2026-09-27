import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';

export interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function MenuButton({
  isOpen,
  onClick,
  className,
}: MenuButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className={cn('p-2 md:hidden', className)}
    >
      <Icon
        name={isOpen ? 'X' : 'Menu'}
        size="lg"
        color="text"
        className="transition-transform duration-[var(--transition-fast)]"
      />
    </Button>
  );
}
