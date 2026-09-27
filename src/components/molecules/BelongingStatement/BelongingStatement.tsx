import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

export interface BelongingStatementProps {
  className?: string;
}

export function BelongingStatement({ className }: BelongingStatementProps) {
  const { t } = useLanguage();

  const statements = [
    t('joinUs.belonging1'),
    t('joinUs.belonging2'),
    t('joinUs.belonging3'),
  ];

  return (
    <div className={cn(className)}>
      <div className="flex items-center">
        {/* Vertical Line */}
        <div style={{ width: 3, height: 102, backgroundColor: '#1E7A2E', marginRight: 20, flexShrink: 0 }} />

        {/* Statements */}
        <div className="space-y-4">
          {statements.map((statement, index) => (
            <p key={index} className="text-[18px] text-black font-semibold">
              {statement}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
