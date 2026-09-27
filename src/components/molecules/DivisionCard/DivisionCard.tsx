import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { DivisionData } from '@/data/organizationData';

export interface DivisionCardProps {
  division: DivisionData;
  index?: number;
  className?: string;
}

export function DivisionCard({ division, index = 0, className }: DivisionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-6',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:shadow-lg',
        'flex-1 min-w-0',
        className
      )}
    >
      {/* Division Label */}
      <div className="text-xs font-semibold tracking-widest uppercase text-[#1B3A4B] mb-1 font-[Inter,Pretendard,sans-serif]">
        {division.label}
      </div>

      {/* Division Title */}
      <h3 className="text-sm font-medium text-gray-700 leading-snug mb-4 font-[Inter,Pretendard,sans-serif]">
        {division.title}
      </h3>

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 mb-3" />

      {/* Members */}
      <div className="space-y-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1 font-[Inter,Pretendard,sans-serif]">
          Members
        </div>
        {division.members.map((member) => (
          <button
            key={member.name}
            type="button"
            onClick={() => {
              if (member.profileUrl) {
                window.location.href = member.profileUrl;
              }
            }}
            className={cn(
              'block text-sm text-gray-600 font-[Inter,Pretendard,sans-serif]',
              'transition-colors duration-200',
              'hover:text-[#1B3A4B] cursor-pointer',
              'bg-transparent border-none p-0 text-left'
            )}
          >
            {member.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
