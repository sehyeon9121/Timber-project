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
  participatingInstitutions,
  className,
}: BigQuestionContentProps) {
  const hasInstitutions = participatingInstitutions && participatingInstitutions.length > 0;

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
        {/* 텍스트 설명 (항상 먼저 렌더링) */}
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

        {/* 참여 기관 로고 그리드 (텍스트 하단에 렌더링) */}
        {hasInstitutions && (
          <>
            <Spacer size="2xl" />
            <Heading level={3} color="text" className="mb-6">
              참여 기관
            </Heading>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {participatingInstitutions.map((institution, idx) => {
                const cardContent = (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={cn(
                      'bg-white rounded-lg shadow-sm',
                      'p-3 flex flex-col items-center justify-center',
                      'aspect-square',
                      'hover:shadow-md transition-shadow duration-300',
                      institution.url && 'cursor-pointer'
                    )}
                  >
                    <img
                      src={`/images/leeseunglab/${institution.logo}`}
                      alt={institution.name}
                      className="max-w-full max-h-[60%] object-contain mb-2"
                    />
                    <span className="text-xs text-gray-600 text-center line-clamp-2">
                      {institution.name}
                    </span>
                    {institution.url && (
                      <span className="text-[10px] text-[var(--color-primary)] mt-1 flex items-center gap-1">
                        <Icon name="ExternalLink" size={10} />
                        Website
                      </span>
                    )}
                  </motion.div>
                );

                return institution.url ? (
                  <a
                    key={idx}
                    href={institution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <div key={idx}>{cardContent}</div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </article>
  );
}
