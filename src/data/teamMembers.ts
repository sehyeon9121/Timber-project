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
  name: string;
  position: string;
  bio: string;
  image: string;
  scholar_url?: string;
  email: string;
}

// Base URL for static assets
const BASE_URL = import.meta.env.BASE_URL || '/';

// Raw 데이터를 TeamMember 타입으로 변환
function transformTeamMembers(raw: RawTeamMember[], type: 'team' | 'alumni'): TeamMember[] {
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
