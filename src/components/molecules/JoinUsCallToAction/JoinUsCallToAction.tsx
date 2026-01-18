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
        title="Interested in being part of this journey?"
        headingClassName="text-[#00380A] uppercase"
        headingStyle={{ fontWeight: 700, letterSpacing: '0.05em', marginBottom: 20, fontSize: '24px' }}
        style={{ marginBottom: 36 }}
      />
      <TextBlock>
        Even if you don't see an open position listed, we'd love to hear from you. We are always on the lookout for motivated and talented scientists excited to make a significant impact in ecology and climate change research.
      </TextBlock>
      <br />
      <TextBlock>
        Please contact Professor Cesar Terrer at{' '}
        <Link href="mailto:cterrer@mit.edu" className="text-[#00380A] underline hover:text-[#004d0e]">
          cterrer@mit.edu
        </Link>
        {' '}with your interests and qualifications.
      </TextBlock>
      <br />
      <TextBlock>
        Let's explore how your expertise and interests align with the goals of the Terrer Lab.
      </TextBlock>
    </motion.div>
  );
}
