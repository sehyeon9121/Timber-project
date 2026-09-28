import { useState, useRef, useEffect, useId } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';
import { dropdownMenu } from '@/utils/animations';
import type { NavItem } from '@/types';

export interface DropdownMenuProps {
  label: string;
  items: NavItem[];
  className?: string;
}

export function DropdownMenu({
  label,
  items,
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { pathname } = useLocation();
  const active = items.some(item => pathname === item.href || pathname.startsWith(`${item.href}/`));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={cn('relative', className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          setIsOpen(false);
          dropdownRef.current?.querySelector('button')?.focus();
        }
      }}
    >
      <Button
        variant="ghost"
        className={cn('flex items-center gap-1', active && 'text-[#00380A] bg-[#f4f7f4]')}
        style={{ padding: '16px 8px' }}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(true)}
        disableAnimation
      >
        <Text size="sm" weight={500}>
          {label}
        </Text>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="ChevronDown" size="xs" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            variants={dropdownMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 w-full min-w-[200px] bg-white border border-gray-200 shadow-sm z-50"
            style={{ marginTop: 0 }}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center min-h-[48px] hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] transition-colors border-b border-gray-100 last:border-b-0"
                style={{ padding: '12px 20px' }}
                onClick={() => setIsOpen(false)}
              >
                <Text size="sm" color="text" weight={500}>
                  {item.label}
                </Text>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
