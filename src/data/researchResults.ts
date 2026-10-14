import type { LocalizedText } from '@/types';
import defaults from '../../shared/research-results-defaults.json';

export interface ResultTarget {
  id: string;
  label: LocalizedText;
  first: number;
  second: number;
  weight: number;
  completed: number | null;
  annualPlan: number | null;
  annualCompleted: number | null;
}
export interface ResultGroup {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  items: ResultTarget[];
}
export interface ResearchResults {
  year: number;
  asOfDate: string | null;
  revision: number;
  updatedAt: string | null;
  groups: ResultGroup[];
}
export interface ResultValues {
  first: number;
  second: number;
  completed: number | null;
  annualPlan: number | null;
  annualCompleted: number | null;
}
export const defaultResearchResults: ResearchResults = { ...defaults, revision: 0, updatedAt: null };
export const resultTargetGroups: ResultGroup[] = defaultResearchResults.groups;
export const resultTargets = resultTargetGroups.flatMap(group => group.items);
export function resultTotals(groups: ResultGroup[]) {
  return groups.flatMap(group => group.items).reduce((total, item) => ({
    first: total.first + item.first,
    second: total.second + item.second,
    completed: total.completed + (item.completed ?? 0),
    reported: total.reported + (item.completed === null ? 0 : 1),
  }), { first: 0, second: 0, completed: 0, reported: 0 });
}
export function achievementRate(plan: number | null, completed: number | null) {
  return plan !== null && plan > 0 && completed !== null ? (completed / plan * 100).toFixed(1) : '—';
}
export const resultTargetTotals = resultTotals(resultTargetGroups);
export const resultAsOfDate = defaultResearchResults.asOfDate;
