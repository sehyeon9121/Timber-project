/**
 * 뉴스 데이터 로더
 * /content/news/ 폴더의 YAML 파일을 로드합니다.
 */

import type { NewsItemData } from '@/types';

// YAML 파일 import
import newsData from '@content/news/news.yaml';

// YAML에서 로드된 데이터의 raw 타입
interface RawNewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  href: string;
}

// Base URL for static assets
const BASE_URL = import.meta.env.BASE_URL || '/';

// Raw 데이터를 NewsItemData 타입으로 변환
function transformNews(raw: RawNewsItem[]): NewsItemData[] {
  return raw.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    excerpt: item.excerpt,
    // 이미지 경로를 BASE_URL + /content/news/ 기준으로 변환
    image: item.image ? `${BASE_URL}content/news/${item.image}` : undefined,
    href: item.href,
  }));
}

// 뉴스 목록 (최신순)
export const newsItems: NewsItemData[] = transformNews(newsData as RawNewsItem[]);
