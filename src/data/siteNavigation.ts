import type { LocalizedText } from '@/types';

export interface SiteMenuItem {
  label: LocalizedText;
  href: string;
  empty?: boolean;
}

export interface SiteMenuGroup {
  id: string;
  label: LocalizedText;
  membersOnly?: boolean;
  items: SiteMenuItem[];
}

// Desktop, mobile, and empty-page routes share the same menu definitions.
export const siteNavigation: SiteMenuGroup[] = [
  {
    id: 'about', label: { ko: '연구단 소개', en: 'About' },
    items: [
      { label: { ko: '단장 인사말', en: "Director’s Message" }, href: '/about/greeting' },
      { label: { ko: '연구단 개요', en: 'Project Overview' }, href: '/about/overview' },
      { label: { ko: '비전·목표', en: 'Vision & Goals' }, href: '/about/vision' },
      { label: { ko: '조직·참여기관', en: 'Organization & Partners' }, href: '/about/organization' },
    ],
  },
  {
    id: 'people', label: { ko: '연구진', en: 'Researchers' },
    items: [
      { label: { ko: '단장·부단장', en: 'Director & Deputy Director' }, href: '/team/leadership' },
      { label: { ko: '세부별 연구책임자', en: 'Division Leads' }, href: '/team' },
      { label: { ko: '공동연구원', en: 'Co-Researchers' }, href: '/team/researchers' },
    ],
  },
  {
    id: 'research', label: { ko: '연구내용', en: 'Research' },
    items: [
      { label: { ko: '연구 목표·추진체계', en: 'Goals & Framework' }, href: '/research/strategy' },
      { label: { ko: '1세부 연구내용', en: 'Division 1 Research' }, href: '/research/terrestrial-carbon' },
      { label: { ko: '2세부 연구내용', en: 'Division 2 Research' }, href: '/research/natural-climate' },
      { label: { ko: '3세부 연구내용', en: 'Division 3 Research' }, href: '/research/energy-performance' },
      { label: { ko: '4세부 연구내용', en: 'Division 4 Research' }, href: '/research/smart-construction' },
    ],
  },
  {
    id: 'results', label: { ko: '연구성과', en: 'Research Results' },
    items: [
      { label: { ko: '연구개발', en: 'Research and Development' }, href: '/results' },
    ],
  },
  {
    id: 'news', label: { ko: '연구단 소식', en: 'Project News' },
    items: [
      { label: { ko: '언론보도', en: 'Press Coverage' }, href: '/news/press' },
      { label: { ko: '세부별 활동 내용', en: 'Division Activities' }, href: '/board' },
    ],
  },
  {
    id: 'board', label: { ko: '게시판', en: 'Board' },
    items: [
      { label: { ko: '연구단 공지사항', en: 'Research Notices' }, href: '/board/notices' },
    ],
  },
];
