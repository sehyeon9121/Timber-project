import { useState } from 'react';
import { ProfileImage } from '@/components/molecules/ProfileImage';
import { EmailModal } from '@/components/molecules/EmailModal';
import { Icon } from '@/components/atoms/Icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/utils/cn';
import type { LocalizedText } from '@/types';

export interface MemberProfileImageProps {
  image: string;
  name: string | LocalizedText;
  scholarUrl?: string;
  email?: string;
  size?: number;
  className?: string;
}

export function MemberProfileImage({
  image,
  name,
  scholarUrl,
  email,
  size = 222,
  className,
}: MemberProfileImageProps) {
  const { language } = useLanguage();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const altText = typeof name === 'object'
    ? (language === 'KO' ? name.ko : name.en)
    : name;

  return (
    <div className={cn('flex-shrink-0', className)}>
      <ProfileImage
        src={image}
        alt={altText}
        size="xl"
        shape="square"
        className="object-cover"
        style={{ width: size, height: size * 1.25 }}
      />
      {(scholarUrl || email) && (
        <div className="flex items-center justify-center gap-2" style={{ marginTop: 16 }}>
          {scholarUrl && (
            <a
              href={scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-full',
                'transition-all duration-[var(--transition-fast)]',
                'hover:bg-gray-100 hover:text-[#00380A]',
                'text-gray-500 no-underline'
              )}
            >
              <Icon name="Globe" size={30} strokeWidth={1.5} />
            </a>
          )}
          {email && (
            <button
              onClick={() => setIsEmailModalOpen(true)}
              aria-label="Email"
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-full',
                'transition-all duration-[var(--transition-fast)]',
                'hover:bg-gray-100 hover:text-[#00380A]',
                'text-gray-500 cursor-pointer border-none bg-transparent'
              )}
            >
              <Icon name="Mail" size={30} strokeWidth={1.5} />
            </button>
          )}
        </div>
      )}

      {/* Email Modal */}
      {email && (
        <EmailModal
          email={email}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </div>
  );
}
