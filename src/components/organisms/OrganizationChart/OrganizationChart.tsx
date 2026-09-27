import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { DivisionCard } from '@/components/molecules/DivisionCard';
import { director, divisions } from '@/data/organizationData';

export interface OrganizationChartProps {
  className?: string;
}

export function OrganizationChart({ className }: OrganizationChartProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Director Card - Top Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mb-0"
      >
        <div
          className={cn(
            'bg-white border-2 border-[#1B3A4B] rounded-lg',
            'px-10 py-6 text-center',
            'shadow-sm'
          )}
        >
          <div className="text-xs font-semibold tracking-widest uppercase text-[#1B3A4B] mb-1 font-[Inter,Pretendard,sans-serif]">
            {director.title}
          </div>
          <div className="text-xl font-bold text-[#1B3A4B] font-[Inter,Pretendard,sans-serif]">
            {director.name}
          </div>
        </div>
      </motion.div>

      {/* Connecting Lines: CSS-only branch lines */}
      {/* Vertical line from Director down */}
      <div className="flex justify-center">
        <div className="w-px h-10 bg-gray-300" />
      </div>

      {/* Horizontal line + vertical branches to each division */}
      <div className="relative">
        {/* Horizontal connector spanning from first to last division center */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gray-300" style={{ width: 'calc(100% - 100% / 3)' }} />

        {/* Mobile: single vertical line continues */}
        <div className="md:hidden flex justify-center">
          <div className="w-px h-6 bg-gray-300" />
        </div>

        {/* Division cards with individual vertical connectors */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-6">
          {divisions.map((division, index) => (
            <div key={division.id} className="flex-1 flex flex-col items-center">
              {/* Vertical drop line to card (desktop) */}
              <div className="hidden md:block w-px h-10 bg-gray-300" />

              {/* Mobile connector between cards (not on first) */}
              {index > 0 && (
                <div className="md:hidden w-px h-4 bg-gray-300" />
              )}

              <DivisionCard division={division} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
