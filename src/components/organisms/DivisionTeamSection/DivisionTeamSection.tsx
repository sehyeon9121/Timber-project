import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMemberCard } from '@/components/organisms/TeamMemberCard';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';
import type { TeamMember } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DivisionTeamSectionProps {
  division: number;
  representative: TeamMember | null;
  members: TeamMember[];
  className?: string;
}

export function DivisionTeamSection({
  division,
  representative,
  members,
  className,
}: DivisionTeamSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const divisionLabel = t(`team.division${division}`);

  return (
    <div className={cn('w-full', className)}>
      {/* 세부 헤더 */}
      <SectionHeader title={divisionLabel} />

      {/* 대표 연구책임자 카드 */}
      {representative && (
        <TeamMemberCard
          {...representative}
          index={0}
        />
      )}

      {/* 더보기 버튼 */}
      <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center gap-2 mt-6 px-0 py-2',
            'text-[17px] font-medium text-[#00380A] hover:text-[#005a10]',
            'transition-colors duration-200 cursor-pointer',
            'border-none bg-transparent'
          )}
        >
          <span>{isExpanded ? t('team.showLess') : t('team.showMore')}</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            <Icon name="ChevronDown" size={19} />
          </motion.span>
        </button>

      {/* 드롭다운 멤버 리스트 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {members.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                {...member}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
