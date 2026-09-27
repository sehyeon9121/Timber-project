import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocalizedText } from '@/types';

export interface MemberInfoProps {
  name: string | LocalizedText;
  position: string | LocalizedText;
  bio?: string | LocalizedText;
  affiliation?: LocalizedText;
  className?: string;
}

export function MemberInfo({
  name,
  position,
  bio,
  affiliation,
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
      <h3 className="text-[22px] font-bold text-black" style={{ marginBottom: 5 }}>{nameText}</h3>

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
