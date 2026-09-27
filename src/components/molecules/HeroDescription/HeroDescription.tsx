import { motion } from 'framer-motion';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/utils/cn';

export interface HeroDescriptionProps {
  text: string;
  color?: 'white' | 'dark';
  className?: string;
}

export function HeroDescription({
  text,
  color = 'white',
  className,
}: HeroDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('max-w-[600px]', className)}
    >
      <Text
        size="md"
        color={color === 'white' ? 'white' : 'primary'}
        className={cn(
          'leading-relaxed',
          color === 'white' ? 'opacity-90' : 'text-[#00380A]'
        )}
      >
        {text}
      </Text>
    </motion.div>
  );
}
