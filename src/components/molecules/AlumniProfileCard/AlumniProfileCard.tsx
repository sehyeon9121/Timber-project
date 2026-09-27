import { ProfileImage } from '@/components/molecules/ProfileImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/utils/cn';
import type { LocalizedText } from '@/types';

export interface AlumniProfileCardProps {
  image: string;
  name: string | LocalizedText;
  imageSize?: number;
  cardWidth?: number;
  padding?: number;
  className?: string;
}

export function AlumniProfileCard({
  image,
  name,
  imageSize = 192,
  cardWidth = 216,
  padding = 12,
  className,
}: AlumniProfileCardProps) {
  const { language } = useLanguage();
  const nameText = typeof name === 'object'
    ? (language === 'KO' ? name.ko : name.en)
    : name;

  return (
    <div
      className={cn('bg-white text-center', className)}
      style={{
        width: cardWidth,
        paddingTop: padding + 3,
        paddingBottom: padding + 3,
        paddingLeft: padding,
        paddingRight: padding,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #797C8D',
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <ProfileImage
          src={image}
          alt={nameText}
          size="md"
          shape="square"
          className="object-cover"
          style={{ width: imageSize, height: imageSize }}
        />
      </div>

      <p className="text-[18px] font-medium text-black">
        {nameText}
      </p>
    </div>
  );
}
