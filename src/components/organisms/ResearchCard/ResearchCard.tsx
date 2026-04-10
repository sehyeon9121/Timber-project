import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';



export interface ResearchCardProps {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  href?: string;
  index?: number;
  className?: string;
}

export function ResearchCard({
  id,
  title,
  description,
  index = 0,
  className,
}: ResearchCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/research/${id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.1 }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      className={cn(
        'relative block overflow-hidden',
        'min-h-[200px] w-full',
        'bg-gray-100 border border-gray-200 rounded-xl',
        'shadow-md hover:border-gray-300',
        'group cursor-pointer transition-colors duration-300',
        className
      )}
    >
      {/* 상단 컬러 액센트 바 */}
      <div className="h-1.5 w-full bg-[var(--color-primary)]" />

      {/* Content */}
      <div
        className="flex h-full flex-col justify-start"
        style={{ padding: 'clamp(24px, 5vw, 48px)', paddingTop: '40px', paddingBottom: '32px' }}
      >
        <h2 className="font-lato text-lg font-semibold text-gray-800 md:text-[28px] text-center" style={{ marginBottom: '18px' }}>
          {title}
        </h2>
        <div className="w-full h-px bg-gray-300" style={{ marginBottom: '18px' }} />
        <p className="font-open-sans text-base leading-relaxed text-gray-500 md:text-lg">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
