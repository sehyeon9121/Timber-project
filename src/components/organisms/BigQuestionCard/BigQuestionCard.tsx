import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/atoms/Image';
import { Link } from '@/components/atoms/Link';
import { cn } from '@/utils/cn';
import { staggerItem } from '@/utils/animations';
import type { BigQuestion } from '@/types';

export interface BigQuestionCardProps extends BigQuestion {
  className?: string;
  index?: number;
}

export function BigQuestionCard({
  id,
  question,
  image,
  className,
  index = 0,
}: BigQuestionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Card */}
      <motion.article
        variants={staggerItem}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group bg-white overflow-hidden',
          'border border-[#DDE1E7]',
          'transition-shadow duration-300',
          'hover:shadow-lg',
          'cursor-pointer',
          'flex flex-col',
          'h-[280px]'
        )}
        style={{ transitionDelay: `${index * 0.05}s` }}
      >
        <Link href={`/big-questions/${id}`} className="flex flex-col flex-1" style={{ padding: '30px' }} disableAnimation>
          {/* Icon Section - Centered at top */}
          {image && (
            <div className="flex justify-center items-center" style={{ paddingBottom: '30px' }}>
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src={image}
                  alt=""
                  className="object-contain"
                  style={{ width: 49, height: 49, filter: 'brightness(0)' }}
                />
              </div>
            </div>
          )}

          {/* Question Text - Centered */}
          <div className="flex-1">
            <p className="text-center text-lg font-medium text-black leading-relaxed group-hover:text-[#00380A] transition-colors">
              {question}
            </p>
          </div>
        </Link>

        {/* Progress Bar - At bottom, attached to border */}
        <div className="w-full">
          <div className="h-[3px] w-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? '100%' : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(90deg, #dc2626 0%, #16a34a 100%)',
              }}
            />
          </div>
        </div>
      </motion.article>

      {/* Bottom Divider Line - Outside the card with spacing */}
      <div className="w-full h-[1px] bg-[#84889A]" style={{ marginTop: 20 }} />
    </div>
  );
}
