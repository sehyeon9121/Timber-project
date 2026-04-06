/**
 * Climate Snacks 데이터 로더
 * /content/climate-snacks/ 폴더의 YAML 파일을 로드합니다.
 */

// YAML 파일 import
import sessionsData from '@content/climate-snacks/sessions.yaml';

// Climate Snacks 세션 타입
export interface ClimateSnackSession {
  id: string;
  speaker: string;
  affiliation?: string;
  topic: string;
  description: string;
  videoUrl?: string;
  thumbnail?: string;
}

// YAML에서 로드된 데이터의 raw 타입
interface RawClimateSnackSession {
  id: string;
  speaker: string;
  affiliation?: string;
  topic: string;
  description: string;
  video_url?: string;
  thumbnail?: string;
}

// Raw 데이터를 ClimateSnackSession 타입으로 변환
function transformSessions(raw: RawClimateSnackSession[] | null | undefined): ClimateSnackSession[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((session) => ({
    id: session.id,
    speaker: session.speaker,
    affiliation: session.affiliation,
    topic: session.topic,
    description: session.description,
    videoUrl: session.video_url,
    thumbnail: session.thumbnail,
  }));
}

// Climate Snacks 세션 목록
export const climateSnacksSessions: ClimateSnackSession[] = transformSessions(
  sessionsData as RawClimateSnackSession[]
);
