export type StrategyColor = 'green' | 'amber' | 'rose' | 'blue' | 'neutral';

export interface StrategyCard {
  text: string;
  column?: number;
  span?: number;
}

export interface StrategyRow {
  topic: string;
  color: StrategyColor;
  initial: StrategyCard[];
  advanced: StrategyCard[];
}

export interface StrategyDivision {
  id: string;
  number: string;
  title: string;
  legend: { label: string; color: StrategyColor }[];
  rows: StrategyRow[];
  goal: { value: string; text: string };
}

// Text transcribed from the supplied research framework. Column spans retain its ordering.
export const strategyDivisions: StrategyDivision[] = [
  {
    id: 'materials', number: '1세부', title: '재료',
    legend: [
      { label: '가공기술', color: 'green' }, { label: '대단면', color: 'amber' },
      { label: '하이브리드', color: 'rose' }, { label: '내화', color: 'blue' },
    ],
    rows: [
      {
        topic: '가공 기술', color: 'green',
        initial: [{ text: 'AI Robotic Arm을 활용한 접합부 통합 솔루션', column: 2, span: 2 }],
        advanced: [{ text: '고정밀, 비정형 목구조 시공 기술개발', span: 2 }],
      },
      {
        topic: '부재 단위 제조 및 설계 기술', color: 'amber',
        initial: [{ text: '목재 가공 기술현황 분석' }, { text: '대단면 제조 및 설계 기술', span: 2 }],
        advanced: [{ text: '표준화 및 고성능화 기술', span: 2 }],
      },
      {
        topic: '부재 단위 제조 및 설계 기술', color: 'rose',
        initial: [{ text: '하이브리드 부재' }, { text: '선형 부재의 제조기술, 구조설계', span: 2 }],
        advanced: [{ text: '하이브리드 부재 프로토타입', span: 2 }],
      },
      {
        topic: '내화 성능', color: 'blue',
        initial: [{ text: '내화성능 확보 기술', column: 2, span: 2 }],
        advanced: [{ text: '장스팬 하이브리드 내화 설계', span: 2 }],
      },
    ],
    goal: { value: '1,000×1,000', text: '저탄소 고성능 국산목재 개발을 위한 기초 데이터베이스 구축' },
  },
  {
    id: 'design', number: '2세부', title: '설계',
    legend: [
      { label: 'AI S/W', color: 'green' }, { label: '내진', color: 'amber' },
      { label: '자동화', color: 'rose' }, { label: '내풍', color: 'blue' },
    ],
    rows: [
      {
        topic: 'S/W', color: 'green',
        initial: [{ text: '파라메트릭 형상 DB, 구조생성설계' }, { text: '핵심 알고리즘 및 구조 안전성 검증 S/W 개발 및 BIM DB구축', span: 2 }],
        advanced: [{ text: 'AI 모델 고도화 및 구조안전성 검증 적용형 통합 설계 자동화 패키지 개발', span: 2 }],
      },
      {
        topic: '내진 안전성', color: 'amber',
        initial: [{ text: '스마트 감쇠장치 최적설계 및 내진성능 검증, 스마트 서포팅 시스템 개발', span: 2 }, { text: '내진성능 실증, 평가' }],
        advanced: [{ text: '스마트 서포팅 시스템 설계 매뉴얼 개발' }],
      },
      {
        topic: '목조접합부 설계', color: 'rose',
        initial: [{ text: '프로토타입 기반 접합 상세' }, { text: '접합시스템 FEM모델, OSC요소 디지털 라이브러리' }, { text: 'GIR정의 및 설계 모듈개발' }],
        advanced: [{ text: '하이브리드 접합설계' }, { text: 'OSC통합설계 자동화' }],
      },
      {
        topic: '건전성 / 내풍안전성', color: 'blue',
        initial: [{ text: '목구조 유형/부재별 체계화 DB구축' }, { text: '구조해석 설계수행 및 형상별 최적 내풍설계 및 안전성 평가 기술개발', span: 2 }],
        advanced: [{ text: '성능기반 내풍설계' }],
      },
    ],
    goal: { value: '70%', text: '탄소 배출량 70% 저감 설계 기술개발' },
  },
  {
    id: 'environment', number: '3세부', title: '환경',
    legend: [
      { label: '에너지', color: 'green' }, { label: '환경', color: 'amber' },
      { label: '시스템', color: 'rose' }, { label: '화재', color: 'blue' },
    ],
    rows: [
      {
        topic: '에너지 성능 평가 알고리즘', color: 'green',
        initial: [{ text: '에너지, 환경성 평가 방법론 및 DB 구축', span: 2 }, { text: '고도화 및 활용체계 설계' }],
        advanced: [{ text: 'Test bed 기반 에너지 성능평가' }, { text: '운영단계 에너지 성능 검증' }],
      },
      {
        topic: '에너지 성능 평가 알고리즘', color: 'amber',
        initial: [{ text: '열, 습기 요구조건 정의' }, { text: '통합 열 습기 관리 시스템 설계안 도출' }, { text: '제어운영 알고리즘 개발' }],
        advanced: [{ text: '시스템 실증' }, { text: '열 습기 관리시스템 가이드라인 개발' }],
      },
      {
        topic: '에너지 성능 평가 알고리즘', color: 'rose',
        initial: [{ text: 'IEQ 분석 및 예측 모델' }, { text: '실내환경 진단평가' }, { text: '규모별 관리전략' }],
        advanced: [{ text: '실내환경 개선전략' }, { text: '운영관리 시스템 완성' }],
      },
      {
        topic: '소방설비', color: 'blue',
        initial: [{ text: '화재 분석 평가 모델 개발' }, { text: '조기 감지 및 소화 패키지 설계' }, { text: '화재 감지 및 소화 설비 작동' }],
        advanced: [{ text: '화재감지 소화 시스템 고도화' }, { text: '화재예방 모니터링' }],
      },
    ],
    goal: { value: '50%', text: '건축물 운영 에너지 50%달성을 위한 기술개발' },
  },
  {
    id: 'construction', number: '4세부', title: '시공',
    legend: [{ label: '매뉴얼', color: 'green' }, { label: '모듈', color: 'amber' }, { label: '안전', color: 'rose' }],
    rows: [
      {
        topic: '법, 제도', color: 'green',
        initial: [{ text: '목조건축 활성화법 대공간 분야 전문가 의견수렴' }, { text: '목조건축 활성화법 대공간 분야 시행규칙 제안' }, { text: '스미트도시 규제샌드박스 신청(적극해석)' }],
        advanced: [{ text: '스마트도시 규제샌드박스 신청(실증특례)' }, { text: '목재이용법 시행령 및 시행규칙/관련기술 활용지원' }],
      },
      {
        topic: 'OSC 모듈 기반 시공 시나리오 구축', color: 'amber',
        initial: [{ text: '구조시스템 정의 및 제작' }, { text: '단위모듈 및 형상별 접합공법' }, { text: '현장조립 양중기술' }],
        advanced: [{ text: '시공성 분석' }],
      },
      {
        topic: 'OSC 모듈 기반 시공 시나리오 구축', color: 'rose',
        initial: [{ text: 'OSC 모듈 접합기술 및 구조 안전성 평가 기술 개발', column: 2, span: 2 }],
        advanced: [{ text: 'OSC 모듈 구조시공 통합 기술 고도화 및 적용 가이드 라인 도출', span: 2 }],
      },
      {
        topic: 'OSC 모듈 기반 시공 시나리오 구축', color: 'rose',
        initial: [{ text: '3D LiDAR 이미지 센싱 환경 구축 및 센싱기술', span: 2 }, { text: '공간 형상화 적용을 위한 시스템화 개선' }],
        advanced: [{ text: '시공 중 정밀성 및 안전성 평가 적용', span: 2 }],
      },
    ],
    goal: { value: '10%', text: 'OSC 기반 10% 공기 단축' },
  },
];

export const demonstrationRows: StrategyRow[] = [
  {
    topic: '조기실증 완료 및 기술검토', color: 'green',
    initial: [{ text: '비정형 형상 최적화 및 자동화 설계' }, { text: '로봇암 정밀 가공 및 모듈 리프트업 공법 적용' }],
    advanced: [{ text: '구조 안전성 입증 및 성능평가' }, { text: '기술 고도화 및 제도개선' }],
  },
  {
    topic: '조기실증 완료 및 기술검토', color: 'amber',
    initial: [{ text: '실증 부지 확정 및 인허가 지원, 설계검토' }, { text: '관광 운영을 고려한 공간배치 및 동선계획 검토' }],
    advanced: [{ text: '관람객 대상 시설 시범 운영 및 피드백' }, { text: '지역 랜드마크 런칭 및 목조건축 프로그램' }],
  },
];
