import { motion } from 'framer-motion';
import { MemberProfileImage } from '@/components/molecules/MemberProfileImage';
import { MemberInfo } from '@/components/molecules/MemberInfo';
import { cn } from '@/utils/cn';
import type { TeamMember } from '@/types';

export interface TeamMemberCardProps extends TeamMember {
  className?: string;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export function TeamMemberCard({
  name,
  position,
  bio,
  image,
  scholarUrl,
  email,
  affiliation,
  className,
  index = 0,
}: TeamMemberCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn('w-full', className)}
      style={{ marginTop: 40 }}
    >
      {/* Content */}
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-[49px] pb-8">
        {/* Left: Photo + Social Icons */}
        <MemberProfileImage
          image={image}
          name={name}
          scholarUrl={scholarUrl}
          email={email}
          size={222}
        />

        {/* Right: Content */}
        <MemberInfo name={name} position={position} bio={bio} affiliation={affiliation} />
      </div>

      {/* Bottom Line */}
      <div className="w-full h-[1px] bg-gray-200" style={{ marginTop: 30 }} />
    </motion.article>
  );
}
