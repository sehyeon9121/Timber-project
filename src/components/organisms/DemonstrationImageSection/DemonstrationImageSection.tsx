import { motion } from 'framer-motion';
import { Image } from '@/components/atoms/Image';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';

export interface DemonstrationImage {
  /** 이미지 경로. 비어있으면 플레이스홀더 표시 */
  src?: string;
  /** 대체 텍스트 (접근성) */
  alt?: string;
  /** 이미지 하단 설명 문구 */
  caption?: string;
  /** 클릭 시 이동할 외부 URL. 설정하면 박스 전체가 클릭 가능한 링크가 됨 */
  url?: string;
  /**
   * 이미지를 박스에 맞추는 방식
   * - 'cover' (기본): 4:3 박스에 꽉 채우고 필요한 부분은 잘라냄
   * - 'contain': 이미지 원본 비율을 유지하며 박스 안에 중앙 정렬 (잘리지 않음)
   */
  fit?: 'cover' | 'contain';
}

export interface DemonstrationImageSectionProps {
  images: DemonstrationImage[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const columnClassMap: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function DemonstrationImageSection({
  images,
  columns = 2,
  className,
}: DemonstrationImageSectionProps) {
  if (!images || images.length === 0) return null;

  return (
    <div
      className={cn('grid items-stretch', columnClassMap[columns], className)}
      style={{ gap: 16, marginTop: 28 }}
    >
      {images.map((image, idx) => {
        const fit = image.fit ?? 'cover';
        const isContain = fit === 'contain';
        const hasLink = Boolean(image.url);

        const figureInner = (
          <motion.figure
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className={cn(
              'h-full bg-white rounded-lg border border-gray-200 overflow-hidden',
              'flex flex-col',
              'transition-shadow hover:shadow-md',
              hasLink && 'cursor-pointer hover:border-[#1B3A4B]'
            )}
            style={{ margin: 0 }}
          >
            <div
              className={cn(
                'relative w-full overflow-hidden',
                isContain
                  ? 'flex-1 bg-white flex items-center justify-center p-4'
                  : 'bg-gray-50'
              )}
              style={isContain ? undefined : { aspectRatio: '4 / 3' }}
            >
              {image.src ? (
                isContain ? (
                  <Image
                    src={image.src}
                    alt={image.alt || ''}
                    objectFit="contain"
                    className="max-w-full max-h-[320px] w-auto h-auto"
                  />
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt || ''}
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full"
                  />
                )
              ) : (
                <div
                  className={cn(
                    'flex flex-col items-center justify-center text-gray-400',
                    isContain ? 'py-16' : 'absolute inset-0'
                  )}
                >
                  <Icon name="ImagePlus" size={32} />
                  <span className="text-xs mt-2">이미지 자리</span>
                </div>
              )}
            </div>

            {image.caption && (
              <figcaption
                className="text-sm text-gray-700 text-center"
                style={{ padding: '10px 12px' }}
              >
                {image.caption}
              </figcaption>
            )}

            {hasLink && (
              <div
                className="flex items-center justify-center gap-1 text-[11px] text-[#1B3A4B] border-t border-gray-100"
                style={{ padding: '6px 12px' }}
              >
                <Icon name="ExternalLink" size={11} />
                <span>사이트 방문</span>
              </div>
            )}
          </motion.figure>
        );

        return hasLink ? (
          <a
            key={idx}
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block h-full"
          >
            {figureInner}
          </a>
        ) : (
          <div key={idx} className="h-full">
            {figureInner}
          </div>
        );
      })}
    </div>
  );
}
