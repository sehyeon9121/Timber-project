import { motion } from 'framer-motion';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';
import { TerrestrialCarbonDetail } from './TerrestrialCarbonDetail';
import { NaturalClimateDetail } from './NaturalClimateDetail';
import { SmartConstructionDetail } from './SmartConstructionDetail';
import { EnergyPerformanceDetail } from './EnergyPerformanceDetail';

const detailComponents: Record<string, React.FC> = {
  'terrestrial-carbon': TerrestrialCarbonDetail,
  'natural-climate': NaturalClimateDetail,
  'smart-construction': SmartConstructionDetail,
  'energy-performance': EnergyPerformanceDetail,
};

export interface ResearchDetailContentProps {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
}

const getImageSrc = (src: string): string => {
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (src.startsWith('/') && !src.startsWith(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${src}`;
  }
  return src;
};

export function ResearchDetailContent({
  id,
  title,
  description,
  backgroundImage,
}: ResearchDetailContentProps) {
  const DetailComponent = detailComponents[id];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
    >
      {/* Hero Banner */}
      <div
        className="relative w-full h-[300px] md:h-[400px] overflow-hidden"
        style={{
          backgroundImage: `url(${getImageSrc(backgroundImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <Heading level={1} className="font-lato text-2xl md:text-4xl font-bold text-white text-center">
            {title}
          </Heading>
        </div>
      </div>

      <Spacer size="2xl" />

      {/* Description */}
      <Text className="font-open-sans text-base md:text-lg leading-relaxed text-gray-700">
        {description}
      </Text>

      <Spacer size="2xl" />
      <Divider />
      <Spacer size="2xl" />

      {/* 카드별 상세 내용 */}
      {DetailComponent ? (
        <DetailComponent />
      ) : (
        <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
          <Text className="text-gray-400 text-lg">
            이 영역에 내용을 추가하세요
          </Text>
        </div>
      )}
    </motion.div>
  );
}
