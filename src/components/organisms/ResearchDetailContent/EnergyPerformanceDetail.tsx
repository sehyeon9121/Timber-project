import { ResearchTaskGrid } from './ResearchTaskGrid';
import type { ResearchTask } from './ResearchTaskGrid';

const researchTasks: ResearchTask[] = [
  {
    code: "3-1-1",
    title: "목조 대공간 건축물의 에너지 및 환경성 성능평가 기술개발",
    stages: [
      { title: "에너지 성능 평가 알고리즘", image: [10, 158, 276, 121], alt: "목구조 대공간 건축물의 에너지 및 환경성 평가 모델" },
      { title: "운영 단계 에너지 절감 및 에너지 운영 지침 개발", image: [265, 158, 267, 121], alt: "대공간 건축물의 운영 단계 에너지 관리 도표" },
    ],
  },
  {
    code: "3-2-1",
    title: "목조 대공간 건축물의 열 환경 및 습기 관리 시스템 기술개발",
    stages: [
      { title: "HVAC 시스템 및 습기 제어 전략 개발", image: [577, 158, 279, 121], alt: "대공간 건축물의 열 환경·습기 제어 및 HVAC 구성도" },
      { title: "습기 관리 및 HVAC 시스템 운영·유지관리 가이드라인 개발", image: [833, 158, 266, 121], alt: "습기 관리 및 HVAC 시스템 운영 절차 도표" },
    ],
  },
  {
    code: "3-3-1",
    title: "목조 대공간 건축물의 IEQ 평가 및 관리 기술개발",
    stages: [
      { title: "통합 실내환경 및 환기 성능평가 알고리즘 개발", image: [10, 409, 276, 123], alt: "실내환경 진단과 환기·냉방 설계 전략 도표" },
      { title: "실내환경 운영·관리 시스템", image: [265, 409, 267, 123], alt: "실내환경 모니터링 및 운영·관리 시스템 구성도" },
    ],
  },
  {
    code: "3-4-1",
    title: "하이브리드 목조 대공간 건축물의 화재예방 시스템 기술개발",
    stages: [
      { title: "화재 안전성 평가기술 & 화재감지 및 소화설비 패키지 개발", image: [577, 409, 279, 123], alt: "화재 안전성 평가 및 화재감지·소화설비 구성도" },
      { title: "목조 대공간 특화 화재 예방 시스템 구축", image: [833, 409, 266, 123], alt: "목조 대공간 건축물의 화재 예방 시스템 구성도" },
    ],
  },
];

export function EnergyPerformanceDetail({ title }: { title: string }) {
  return <ResearchTaskGrid division={3} title={title} diagramDirectory="research-division-3" tasks={researchTasks} />;
}
