import { ResearchTaskGrid } from './ResearchTaskGrid';
import type { ResearchTask } from './ResearchTaskGrid';

const researchTasks: ResearchTask[] = [
  {
    code: '1-1-1',
    title: 'AI Robotic Arm을 활용한 비정형 목조 구조 요소의 정밀가공기술 개발',
    stages: [
      { title: 'AI 로봇 활용 스마트 접합부 통합 솔루션 및 구조안전성 확보', image: [10, 165, 275, 83], alt: '로봇 팔을 이용한 목조 구조 요소 정밀가공 사진' },
      { title: 'AI 기반 고정밀 품질관리 및 3차원 비정형 목구조 시공 기술 확보', image: [265, 165, 267, 83], alt: '로봇 팔과 비정형 목구조를 활용한 시공 기술 사진' },
    ],
  },
  {
    code: '1-2-1',
    title: '고성능 목재 설계 및 제작 생산기술개발',
    stages: [
      { title: '대단면 집성재 표준화를 위한 재료설계 기준 정립', image: [575, 165, 275, 83], alt: '대단면 집성재의 설계 및 제작 공정 도표' },
      { title: '대단면·곡면 집성재 표준화 및 고성능화 기술', image: [828, 165, 267, 83], alt: '곡면 대단면 집성재의 표준화 및 제작 기술 도표' },
    ],
  },
  {
    code: '1-2-2',
    title: '한국형 신뢰성 기반 지압강도(국산 수종/파스너별) DB 및 보정계수 개발',
    stages: [
      { title: '한국형 하이브리드 접합부 최적 설계 원천 기술', image: [10, 357, 275, 82], alt: '하이브리드 접합부 구성과 해석 결과 도표' },
      { title: '장기 거동 예측 기반 안전성 확보 및 현장 적용 기술 가이드라인', image: [265, 357, 267, 82], alt: '접합부의 장기 거동 예측 및 현장 적용 분석 도표' },
    ],
  },
  {
    code: '1-3-1',
    title: '고강도 하이브리드 선형 부재 설계 기술개발',
    stages: [
      { title: '하이브리드 부재 단면 구성 원칙 정립', image: [575, 356, 275, 83], alt: '목재와 강재를 결합한 하이브리드 부재 단면 구성 도표' },
      { title: '하이브리드 부재 프로토타입 제작 및 OSC 설계 가이드라인 수립', image: [828, 356, 267, 83], alt: '하이브리드 부재 프로토타입과 대공간 구조 설계 도표' },
    ],
  },
  {
    code: '1-4-1',
    title: '대공간 목구조 적용을 위한 대단면 하이브리드 구조 내화성능 확보 기술개발',
    stages: [
      { title: '2시간 내화성능 확보 기술 및 평가 DB 구축', image: [10, 549, 275, 81], alt: '부재 물성 데이터베이스와 내화성능 평가 도표' },
      { title: '대공간 돔 해석 기술 및 장스팬 하이브리드 내화 설계 매뉴얼', image: [265, 549, 267, 81], alt: '대공간 돔과 장스팬 하이브리드 구조 내화 설계 절차 도표' },
    ],
  },
  {
    code: '2-1-3',
    title: '탄소저감을 위한 목조 대공간 건축물 설계 기술 개발',
    stages: [
      { title: '탄소중립설계 기술개발 및 설계 부합성 검토', image: [575, 549, 275, 81], alt: '탄소중립 목조 대공간 건축물의 설계 검토 도면' },
      { title: '200m급 목조 대공간 예비설계 도서 및 표준 상세 보고서', image: [828, 549, 267, 81], alt: '200m급 목조 대공간 건축물 예비설계 및 표준 상세 도면' },
    ],
  },
];

export function TerrestrialCarbonDetail({ title }: { title: string }) {
  return (
    <ResearchTaskGrid division={1} title={title} diagramDirectory="research-division-1-upscaled" tasks={researchTasks} />
  );
}
