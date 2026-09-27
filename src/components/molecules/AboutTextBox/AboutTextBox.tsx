import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';
import { cn } from '@/utils/cn';

export interface AboutTextBoxProps {
  title: string;
  description: string;
  className?: string;
  variant?: 'default' | 'overlay';
}

export function AboutTextBox({
  title,
  description,
  className,
  variant = 'default',
}: AboutTextBoxProps) {
  const isOverlay = variant === 'overlay';

  return (
    <div
      className={cn(
        'p-8',
        isOverlay ? 'bg-transparent' : 'bg-white',
        className
      )}
    >
      <Heading
        level={3}
        style={{
          fontWeight: 700,
          color: isOverlay ? '#ffffff' : '#00380A',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        {title}
      </Heading>

      <Spacer size="md" />

      <Divider color={isOverlay ? 'white' : 'muted'} thickness="thin" className="w-16" />

      <Spacer size="md" />

      <Paragraph
        color={isOverlay ? 'light' : 'dark'}
        size="lg"
        className={cn('leading-relaxed font-medium', isOverlay && 'text-white/90')}
      >
        {description}
      </Paragraph>
    </div>
  );
}
