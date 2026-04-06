import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';
import { cn } from '@/utils/cn';

export interface AboutTextBoxProps {
  title: string;
  description: string;
  className?: string;
}

export function AboutTextBox({
  title,
  description,
  className,
}: AboutTextBoxProps) {
  return (
    <div
      className={cn(
        'p-8 bg-white',
        className
      )}
    >
      <Heading level={3} style={{ fontWeight: 700, color: '#00380A', paddingTop: '10px', paddingBottom: '10px' }}>
        {title}
      </Heading>

      <Spacer size="md" />

      <Divider color="muted" thickness="thin" className="w-16" />

      <Spacer size="md" />

      <Paragraph color="dark" size="lg" className="leading-relaxed font-medium">
        {description}
      </Paragraph>
    </div>
  );
}
