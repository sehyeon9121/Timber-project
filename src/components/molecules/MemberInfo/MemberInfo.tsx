import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocalizedText } from '@/types';

export interface MemberInfoProps {
  name: string | LocalizedText;
  position: string | LocalizedText;
  bio?: string | LocalizedText;
  affiliation?: LocalizedText;
  representativeDivision?: number;
  className?: string;
}

export function MemberInfo({
  name,
  position,
  bio,
  affiliation,
  representativeDivision,
  className,
}: MemberInfoProps) {
  const { language } = useLanguage();

  // 다국어 텍스트 해석 헬퍼
  const localize = (value: string | LocalizedText | undefined) => {
    if (!value) return undefined;
    if (typeof value === 'object') return language === 'KO' ? value.ko : value.en;
    return value;
  };

  const nameText = localize(name) || '';
  const positionText = localize(position) || '';
  const affiliationText = localize(affiliation);
  const bioText = localize(bio);

  return (
    <div className={cn('flex-1', className)}>
      {/* Name */}
      <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[22px] font-bold text-black" style={{ marginBottom: 5 }}>
        <span>{nameText}</span>
        {representativeDivision && (
          <span className="text-[13px] font-medium text-[#00380A]">
            {language === 'KO' ? `${representativeDivision}세부 책임자` : `Division ${representativeDivision} Lead`}
          </span>
        )}
      </h3>

      {/* Position */}
      <p className="text-[14px] text-[#00380A] uppercase tracking-wide font-semibold" style={{ marginBottom: affiliationText ? 5 : 18 }}>
        {positionText}
      </p>

      {/* Affiliation */}
      {affiliationText && (
        <p className="text-[13px] text-gray-500" style={{ marginBottom: 18 }}>
          {affiliationText}
        </p>
      )}

      {/* Bio */}
      {bioText && (
        <p className="text-[15px] text-black leading-relaxed">
          {bioText}
        </p>
      )}
    </div>
  );
}
