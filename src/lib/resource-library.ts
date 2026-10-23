export const resourceCategories = ['reports', 'materials', 'minutes', 'forms'] as const;
export type ResourceCategory = typeof resourceCategories[number];
export const resourceInfo = {
  reports: { label: ['보고서', 'Reports'], description: ['최종 작성된 연구 보고서를 한곳에서 확인하세요.', 'Browse completed research reports.'], empty: ['등록된 보고서가 없습니다.', 'No reports have been published.'] },
  materials: { label: ['자료', 'Materials'], description: ['연구와 업무에 필요한 자료를 함께 나눕니다.', 'Share useful resources for research and daily work.'], empty: ['등록된 자료가 없습니다.', 'No materials have been published.'] },
  minutes: { label: ['회의록', 'Meeting Minutes'], description: ['회의에서 나눈 논의와 결정 사항을 기록합니다.', 'Keep a record of discussions and decisions.'], empty: ['등록된 회의록이 없습니다.', 'No meeting minutes have been published.'] },
  forms: { label: ['서식', 'Forms'], description: ['보고서 작성에 필요한 서식을 찾아 내려받으세요.', 'Find and download templates for your reports.'], empty: ['등록된 서식이 없습니다.', 'No forms have been published.'] },
};
export function resourceCategory(value: unknown): ResourceCategory | undefined {
  return resourceCategories.find(category => category === value);
}
export function resourceHref(category: ResourceCategory) { return `/board/resources?tab=${category}`; }
