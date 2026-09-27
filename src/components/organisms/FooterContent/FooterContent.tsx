import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface FooterContentProps {
  className?: string;
}

export function FooterContent({ className }: FooterContentProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'w-full min-h-[87px] py-6 bg-[#1a1a1a] text-white flex items-center justify-center',
        className
      )}
    >
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: 1153, width: '100%', paddingLeft: 20, paddingRight: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="text-white/80 text-sm md:text-base leading-relaxed"
        >
          © Copyright {currentYear} | 200m급 목구조대공간 건축물 건설 기술개발
        </motion.div>
      </div>
    </footer>
  );
}
