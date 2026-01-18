import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { ClimateSnackSession } from '@/data/climateSnacks';

export interface ClimateSnacksCardProps extends ClimateSnackSession {
  className?: string;
  index?: number;
}

export function ClimateSnacksCard({
  speaker,
  affiliation,
  topic,
  description,
  videoUrl,
  className,
  index = 0,
}: ClimateSnacksCardProps) {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = () => {
    if (videoUrl) {
      const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
      if (match) return match[1];
    }
    return 'dQw4w9WgXcQ'; // placeholder
  };

  const videoId = getYouTubeVideoId();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn('flex flex-col md:flex-row overflow-hidden mx-auto bg-white w-full max-w-[1000px]', className)}
      style={{ gap: 20 }}
    >
      {/* YouTube Embed - Top on mobile, Left on desktop */}
      <div className="w-full md:w-1/2 flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={topic}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Content - Bottom on mobile, Right on desktop */}
      <div className="flex-1">
        {/* Title (Speaker + Affiliation) */}
        <h3 className="text-xl md:text-[24px] font-semibold text-black">
          {speaker}
          {affiliation && (
            <span className="text-[#666] font-normal text-base md:text-[18px] ml-2">
              ({affiliation})
            </span>
          )}
        </h3>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200" style={{ marginTop: 10, marginBottom: 10 }} />

        {/* Description */}
        <p className="text-base md:text-[18px] text-black leading-relaxed">
          {description}
        </p>
      </div>
    </motion.article>
  );
}
