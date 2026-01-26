import { motion } from 'framer-motion';
import { Link } from '@/components/atoms/Link';
import { TextBlock } from '@/components/atoms/TextBlock';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { cn } from '@/utils/cn';

export interface JoinUsCallToActionProps {
  className?: string;
}

export function JoinUsCallToAction({ className }: JoinUsCallToActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
    >
      <SectionHeader
        title="INTERESTED IN SHAPING THE FUTURE OF TIMBER STRUCTURES?"
        headingClassName="text-[#00380A] uppercase"
        headingStyle={{ fontWeight: 700, letterSpacing: '0.05em', marginBottom: 20, fontSize: '24px' }}
        style={{ marginBottom: 36 }}
      />
      <TextBlock>
        ACT Institute is an open research platform exploring carbon-neutral timber structures through advanced structural engineering, computational design, and performance-based validation.

      </TextBlock>
      <br />
      <TextBlock>
        Even when specific programs or positions are not listed, we welcome conversations with individuals who share an interest in sustainable structural systems and large-span timber architecture.
        
      </TextBlock>
      <br />
      <TextBlock>
       
      </TextBlock>
    </motion.div>
  );
}
