export const boardTemplates = [
  {
    id: 'meeting',
    label: { KO: '회의록', EN: 'Meeting minutes' },
    fields: {
      KO: ['회의 일자', '회의 장소', '참석자', '회의 주제', '회의 내용', '결정 사항', '후속 조치 및 담당자'],
      EN: ['Meeting date', 'Location', 'Attendees', 'Topic', 'Discussion', 'Decisions', 'Follow-up actions and owners'],
    },
  },
  {
    id: 'progress',
    label: { KO: '연구 진행 보고', EN: 'Research progress' },
    fields: {
      KO: ['보고 기간', '연구 주제', '진행 내용', '주요 결과', '문제점 및 협의 사항', '향후 계획'],
      EN: ['Reporting period', 'Research topic', 'Progress', 'Key results', 'Issues and discussion points', 'Next steps'],
    },
  },
  {
    id: 'resource',
    label: { KO: '자료 공유', EN: 'Resource sharing' },
    fields: {
      KO: ['자료명', '자료 소개', '관련 연구 / 세부', '자료 링크', '활용 방법 및 참고 사항'],
      EN: ['Resource title', 'Description', 'Related research / division', 'Resource link', 'Usage and notes'],
    },
  },
] as const;

export type BoardTemplateId = 'free' | typeof boardTemplates[number]['id'];

export function boardTemplateBody(id: BoardTemplateId, language: 'KO' | 'EN') {
  const template = boardTemplates.find(item => item.id === id);
  return template?.fields[language].map(field => `${field}: \n`).join('\n') ?? '';
}
