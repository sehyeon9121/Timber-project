import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Container } from '@/components/atoms/Container';
import { NavLink } from '@/components/molecules/NavLink';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';
import { slideInRight, fadeIn, staggerContainerFast } from '@/utils/animations';
import { mainNavItems, peopleDropdownItems, newsDropdownItems } from '@/data/navigation';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  },
};

export function MobileNavigation({
  isOpen,
  onClose,
  className,
}: MobileNavigationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.nav
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed top-0 right-0 bottom-0 w-80 max-w-[85vw]',
              'bg-white shadow-2xl z-50 md:hidden',
              'overflow-y-auto',
              className
            )}
          >
            <Container padding="md" className="py-20">
              {/* Main Nav Items */}
              <motion.div
                className="space-y-1"
                variants={staggerContainerFast}
                initial="hidden"
                animate="visible"
              >
                {mainNavItems.map((item) => (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <NavLink
                      href={item.href}
                      label={item.label}
                      className="block py-3 text-lg font-medium hover:text-[var(--color-primary)] transition-colors"
                      onClick={onClose}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* People Section */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="border-t border-[var(--color-border)] pt-4 mt-4"
              >
                <Text
                  size="sm"
                  color="muted"
                  weight={600}
                  uppercase
                  className="mb-3 tracking-wide"
                >
                  People
                </Text>
                <motion.div
                  className="space-y-1 pl-4"
                  variants={staggerContainerFast}
                  initial="hidden"
                  animate="visible"
                >
                  {peopleDropdownItems.map((item) => (
                    <motion.div key={item.href} variants={menuItemVariants}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        className="block py-2 hover:text-[var(--color-primary)] transition-colors"
                        onClick={onClose}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* News Section */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="border-t border-[var(--color-border)] pt-4 mt-4"
              >
                <Text
                  size="sm"
                  color="muted"
                  weight={600}
                  uppercase
                  className="mb-3 tracking-wide"
                >
                  News
                </Text>
                <motion.div
                  className="space-y-1 pl-4"
                  variants={staggerContainerFast}
                  initial="hidden"
                  animate="visible"
                >
                  {newsDropdownItems.map((item) => (
                    <motion.div key={item.href} variants={menuItemVariants}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        className="block py-2 hover:text-[var(--color-primary)] transition-colors"
                        onClick={onClose}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Container>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
