/**
 * 팀원 데이터 로더
 * /content/team/ 폴더의 YAML 파일들을 로드합니다.
 */

import type { TeamMember } from '@/types';

// YAML 파일 import
import teamData from '@content/team/team.yaml';
import alumniData from '@content/team/alumni.yaml';

// YAML에서 로드된 데이터의 raw 타입
interface RawTeamMember {
  id: string;
  name: string | { en: string; ko: string };
  position: string | { en: string; ko: string };
  bio: string | { en: string; ko: string };
  image: string;
  scholar_url?: string;
  email: string;
  affiliation?: {
    en: string;
    ko: string;
  };
  division?: number;
  is_representative?: boolean;
}

// Base URL for static assets
const BASE_URL = import.meta.env.BASE_URL || '/';

// Raw 데이터를 TeamMember 타입으로 변환
function transformTeamMembers(raw: RawTeamMember[] | null | undefined, type: 'team' | 'alumni'): TeamMember[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((member) => ({
    id: member.id,
    name: member.name,
    position: member.position,
    bio: member.bio,
    // 이미지 경로를 BASE_URL + /content/team/ 기준으로 변환
    image: member.image ? `${BASE_URL}content/team/${member.image}` : '',
    scholarUrl: member.scholar_url,
    email: member.email,
    type,
    affiliation: member.affiliation,
    division: member.division,
    isRepresentative: member.is_representative,
  }));
}

// 현재 팀원 목록
export const teamMembers: TeamMember[] = transformTeamMembers(
  teamData as RawTeamMember[],
  'team'
);

// 동문 목록
export const alumni: TeamMember[] = transformTeamMembers(
  alumniData as RawTeamMember[],
  'alumni'
);

// 전체 멤버 (팀원 + 동문)
export const allMembers: TeamMember[] = [...teamMembers, ...alumni];

// 세부별 그룹 타입
export interface DivisionGroup {
  division: number;
  representative: TeamMember | null;
  members: TeamMember[];
}

// 세부별로 멤버 그룹핑
export function getTeamByDivision(): DivisionGroup[] {
  const divisionMap = new Map<number, { representative: TeamMember | null; members: TeamMember[] }>();

  for (const member of teamMembers) {
    const div = member.division ?? 0;
    if (!divisionMap.has(div)) {
      divisionMap.set(div, { representative: null, members: [] });
    }
    const group = divisionMap.get(div)!;
    if (member.isRepresentative && !group.representative) {
      // 첫 번째 대표만 메인 카드로, 이후 대표는 멤버 리스트로
      group.representative = member;
    } else {
      group.members.push(member);
    }
  }

  // 세부 번호 순으로 정렬 (1, 2, 3, 4)
  return Array.from(divisionMap.entries())
    .filter(([div]) => div > 0)
    .sort(([a], [b]) => a - b)
    .map(([division, group]) => ({
      division,
      representative: group.representative,
      members: group.members,
    }));
}
