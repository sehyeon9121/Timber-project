import { ResearchTaskGrid } from './ResearchTaskGrid';
import type { ResearchTask } from './ResearchTaskGrid';

const researchTasks: ResearchTask[] = [
  {
    code: "2-1-1",
    title: "생성형 AI 및 대리모델 기반 대형 비정형 목구조 돔 설계 기술개발",
    stages: [
      { title: "AI 기반 대형 비정형 목구조 돔 구조안전성 검증 소프트웨어 개발", image: [16, 166, 276, 99], alt: "AI 생성형 설계와 목구조 돔 구조해석 도표" },
      { title: "대형 돔 검증 알고리즘 완성 가이드라인 수립", image: [270, 166, 268, 99], alt: "대형 목구조 돔 검증 모델과 해석 결과" },
    ],
  },
  {
    code: "2-1-2",
    title: "성능제약 기반 파라메트릭-AI 대경간 목조 형상 자동생성 알고리즘 및 BIM 데이터베이스 구축",
    stages: [
      { title: "50m 실증 피드백을 반영한 DfMA 연계 운영 논리 및 모델 고도화", image: [584, 166, 273, 99], alt: "목조 돔 형상 생성과 제작·조립 연계 설계 도표" },
      { title: "200m 통합 설계자동화 V2.0 운영가이드/템플릿 확보", image: [837, 166, 268, 99], alt: "200m급 목조 돔의 통합 설계 및 BIM 모델" },
    ],
  },
  {
    code: "2-2-1",
    title: "내진성능 향상을 위한 스마트 감쇠 장치 최적 설계 알고리즘 개발",
    stages: [
      { title: "시스템 규모 실증 기반 진동대 실험", image: [16, 369, 276, 97], alt: "스마트 감쇠 장치 개발과 진동대 실험 사진" },
    ],
  },
  {
    code: "2-2-2",
    title: "AI 기반 지진응답 제어형 스마트 면·제진 서포팅 시스템 개발",
    stages: [
      { title: "AI 기반 내진성능 향상 스마트 서포팅 시스템 개발", image: [584, 369, 275, 98], alt: "스마트 서포팅 장치와 동적 시험 분석 도표" },
      { title: "AI 기반 스마트 면진·감쇠 장치의 적응성 검증 및 설계 매뉴얼 개발", image: [837, 369, 268, 98], alt: "스마트 면진·감쇠 장치가 적용된 구조 모델" },
    ],
  },
  {
    code: "2-3-1",
    title: "대공간 목조건축 OSC 모듈화를 위한 다축 강재절점-목재 하이브리드 접합 설계 및 기준(안) 구축",
    stages: [
      { title: "대공간 목조건축 OSC 모듈화를 위한 하이브리드 접합 설계 기술 개발", image: [16, 583, 276, 98], alt: "목조 돔의 하이브리드 접합부와 구조 모델" },
      { title: "하이브리드 접합부 설계기준(안) 제출", image: [270, 583, 268, 98], alt: "하이브리드 접합부 상세와 설계기준 도표" },
    ],
  },
  {
    code: "2-3-2",
    title: "OSC 연계형 대공간 목구조 다축 강재 절점부와 목재 설계 자동화 프로그램 개발",
    stages: [
      { title: "OSC 연계형 대공간 목구조 부재 및 접합부 통합 설계 프로그램 개발", image: [584, 583, 275, 98], alt: "목구조 부재·접합부 통합 설계 프로그램 구성도" },
      { title: "S/W 활용 설계 결과의 신뢰성 및 실무 생산성 향상도 평가", image: [837, 583, 268, 98], alt: "설계 자동화 소프트웨어의 검증 및 활용 결과" },
    ],
  },
  {
    code: "2-4-1",
    title: "비정형 목조 대공간 건축물 구조설계 및 구조건전성 평가방법 구축",
    stages: [
      { title: "목조 건축물 구조설계 건전성 예측", image: [16, 797, 276, 98], alt: "목조 건축물 구조건전성 예측 및 해석 결과" },
    ],
  },
  {
    code: "2-4-2",
    title: "비정형 목조 대공간 구조물의 성능기반 통합 내풍안전성 평가 및 설계지원 기술 개발",
    stages: [
      { title: "외피-골조 통합 내풍안전성 평가 적용", image: [584, 797, 275, 98], alt: "외피·골조의 내풍안전성 평가 및 해석 도표" },
      { title: "AI 기반 내풍안전성 예측 모델 구축", image: [837, 797, 268, 98], alt: "대공간 구조물의 내풍안전성 예측 모델" },
    ],
  },
];

export function NaturalClimateDetail({ title }: { title: string }) {
  return <ResearchTaskGrid division={2} title={title} diagramDirectory="research-division-2" tasks={researchTasks} />;
}
