import { motion } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Icon } from '@/components/atoms/Icon';
import { Spacer } from '@/components/atoms/Spacer';
import { QuoteBlock } from '@/components/molecules/QuoteBlock';
import { BulletList } from '@/components/molecules/BulletList';
import { cn } from '@/utils/cn';
import type { BigQuestion } from '@/types';

export interface BigQuestionContentProps extends BigQuestion {
  className?: string;
}

export function BigQuestionContent({
  question,
  icon,
  content,
  highlights,
  bulletPoints,
  className,
}: BigQuestionContentProps) {
  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center mb-12"
      >
        <div
          className={cn(
            'inline-flex items-center justify-center',
            'w-20 h-20 rounded-full mb-6',
            'bg-[var(--color-primary)] bg-opacity-10'
          )}
        >
          <Icon
            name={icon}
            size={40}
            className="text-[var(--color-primary)]"
          />
        </div>

        <Heading level={1} color="text">
          {question}
        </Heading>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="prose prose-lg max-w-none"
      >
        {content.map((paragraph, idx) => (
          <div key={idx}>
            <Paragraph color="light" size="lg" className="leading-relaxed">
              {paragraph}
            </Paragraph>
            {idx < content.length - 1 && <Spacer size="lg" />}
          </div>
        ))}

        {highlights && highlights.length > 0 && (
          <>
            <Spacer size="xl" />
            {highlights.map((highlight, idx) => (
              <QuoteBlock key={idx} className="my-8">
                {highlight}
              </QuoteBlock>
            ))}
          </>
        )}

        {bulletPoints && bulletPoints.length > 0 && (
          <>
            <Spacer size="xl" />
            <Heading level={3} color="text" className="mb-4">
              Research Focus Areas
            </Heading>
            <BulletList
              items={bulletPoints}
              color="text"
              className="ml-4"
            />
          </>
        )}
      </motion.div>
    </article>
  );
}
