import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';

export function NaturalClimateDetail() {
  return (
    <div>
      <Heading level={2} className="font-lato text-xl md:text-2xl font-bold text-gray-900">
        소제목을 여기에 입력하세요
      </Heading>
      <Spacer size="lg" />
      <Text className="font-open-sans text-base md:text-lg leading-relaxed text-gray-700">
        본문 내용을 여기에 입력하세요
      </Text>
    </div>
  );
}
