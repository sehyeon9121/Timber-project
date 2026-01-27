import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocalizedText } from '@/types';

export interface MemberInfoProps {
  name: string;
  position: string;
  bio?: string;
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

  // 현재 언어에 맞는 소속 텍스트 반환
  const affiliationText = affiliation
    ? language === 'KO' ? affiliation.ko : affiliation.en
    : undefined;

  return (
    <div className={cn('flex-1', className)}>
      {/* Name */}
      <h3 className="text-[22px] font-bold text-black" style={{ marginBottom: 20 }}>{name}</h3>

      {/* Position */}
      <p className="text-[14px] text-[#00380A] uppercase tracking-wide font-semibold" style={{ marginBottom: 5 }}>
        {position}
      </p>

      {/* Affiliation */}
      {affiliationText && (
        <p className="text-[13px] text-gray-500" style={{ marginBottom: 10 }}>
          {affiliationText}
        </p>
      )}

      {/* Bio */}
      {bio && (
        <p className="text-[15px] text-black leading-relaxed">
          {bio}
        </p>
      )}
    </div>
  );
}
