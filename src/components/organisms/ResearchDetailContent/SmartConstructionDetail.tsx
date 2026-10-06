import { ResearchTaskGrid } from './ResearchTaskGrid';
import type { ResearchTask } from './ResearchTaskGrid';

const researchTasks: ResearchTask[] = [
  {
    code: "4-1-1",
    title: "목조 대공간 건축물 통합 유지관리 및 스마트 모니터링 시스템 개발",
    stages: [
      { title: "데이터 수집 인프라 구축과 지능형 분석 모델 및 통합 플랫폼 개발", image: [8, 148, 268, 119], alt: "목조 건축물의 데이터 수집·분석 및 스마트 모니터링 도표" },
      { title: "시스템 실증 및 표준 유지관리 매뉴얼 구축", image: [253, 148, 259, 119], alt: "대공간 건축물의 유지관리 실증 및 모니터링 도표" },
    ],
  },
  {
    code: "4-1-2",
    title: "목조 대공간 건축물의 유지관리용 디지털트윈 구축 기술개발",
    stages: [
      { title: "유지관리에 적합한 디지털 트윈 구축", image: [556, 151, 264, 115], alt: "목조 대공간 건축물의 유지관리용 디지털 트윈 구성도" },
      { title: "유지관리 디지털 트윈 가이드·매뉴얼 작성", image: [800, 151, 259, 115], alt: "디지털 트윈 유지관리 가이드 및 매뉴얼 도표" },
    ],
  },
  {
    code: "4-1-3",
    title: "목조 대공간 건축물의 시공 및 유지관리 기술 및 법제도개선 연구",
    stages: [
      { title: "디지털 점검·진단 제도화 요소 포함한 법·제도 개선(안) 도출", image: [8, 383, 268, 118], alt: "디지털 점검·진단 및 유지관리 법·제도 개선 도표" },
      { title: "디지털 장비·디지털 트윈 연계 운영·확산 패키지 구축", image: [253, 383, 259, 118], alt: "디지털 장비와 디지털 트윈 연계 운영 구성도" },
    ],
  },
  {
    code: "4-2-1",
    title: "목조 대공간 건축물의 아웃리거 구조 시스템 및 시공기술 개발",
    stages: [
      { title: "설계 제조 기술 개발", image: [556, 383, 264, 118], alt: "아웃리거 구조 시스템 설계·제조 도표" },
      { title: "시공기술 확보", image: [800, 383, 259, 118], alt: "대공간 건축물의 시공 장비 및 시공 절차 도표" },
    ],
  },
  {
    code: "4-3-1",
    title: "대공간 목구조 지원시설 OSC 모듈 구조시스템 및 시공 최적화 기술 개발",
    stages: [
      { title: "OSC 모듈 구조안전성 평가 및 DES·BIM 연계 시공 시나리오 구축", image: [8, 638, 268, 116], alt: "OSC 모듈 구조안전성 평가 및 BIM 시공 도표" },
      { title: "OSC 모듈의 종합 성능 검증 및 구조·시공 통합 가이드라인", image: [253, 638, 259, 116], alt: "OSC 모듈의 종합 성능 검증 및 구조·시공 구성도" },
    ],
  },
  {
    code: "4-4-1",
    title: "3차원 LiDAR 이미지 센싱 기반 시공 중 정밀성 및 안전성 평가",
    stages: [
      { title: "3D LiDAR 기반 공간 형상화 및 AI 평가 맞춤형 PCD 변환 모듈", image: [556, 642, 264, 112], alt: "LiDAR 이미지 센싱과 공간 형상화·PCD 변환 도표" },
      { title: "3D LiDAR 공간 형상화 및 변조 레이저 활용 진동수 계측 모듈", image: [800, 642, 259, 112], alt: "LiDAR 공간 형상화와 레이저 진동수 계측 도표" },
    ],
  },
  {
    code: "4-4-2",
    title: "목조 대공간 건축물의 운영단계 스마트 복합센싱 기술 개발",
    stages: [
      { title: "3D PCD 기반 형상 변형 모니터링 및 구조건전도 지수(SHI) 개발", image: [8, 874, 268, 118], alt: "3D PCD 기반 형상 변형 및 구조건전도 모니터링 구성도" },
      { title: "스마트 복합센싱 네트워크 설계 및 최적화", image: [253, 874, 259, 118], alt: "스마트 복합센싱 네트워크 설계 구성도" },
    ],
  },
  {
    code: "4-4-3",
    title: "스마트 센싱을 이용한 공학목재의 물성 변화 평가 기술",
    stages: [
      { title: "구조용 공학목재 내부 함수율·응력 및 접합부 변형 센싱 기술", image: [556, 874, 264, 118], alt: "공학목재의 내부 함수율·응력 및 접합부 변형 센싱 구성도" },
      { title: "대공간 목조 건축물 공학목재 열화 조건 확립 및 내구설계 매뉴얼", image: [800, 874, 259, 118], alt: "공학목재의 열화 조건 및 내구설계 평가 도표" },
    ],
  },
];

export function SmartConstructionDetail({ title }: { title: string }) {
  return <ResearchTaskGrid division={4} title={title} diagramDirectory="research-division-4" tasks={researchTasks} />;
}
