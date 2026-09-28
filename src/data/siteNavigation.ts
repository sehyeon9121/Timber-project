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
      { label: { ko: '단장 인사말', en: "Director’s Message" }, href: '/about/greeting', empty: true },
      { label: { ko: '연구단 개요', en: 'Project Overview' }, href: '/about/overview' },
      { label: { ko: '비전·목표', en: 'Vision & Goals' }, href: '/about/vision', empty: true },
      { label: { ko: '조직·참여기관', en: 'Organization & Partners' }, href: '/about/organization' },
    ],
  },
  {
    id: 'research', label: { ko: '연구내용', en: 'Research' },
    items: [
      { label: { ko: '연구 목표·추진체계', en: 'Goals & Framework' }, href: '/research/strategy', empty: true },
      { label: { ko: '1세부 연구내용', en: 'Division 1 Research' }, href: '/research/terrestrial-carbon' },
      { label: { ko: '2세부 연구내용', en: 'Division 2 Research' }, href: '/research/natural-climate' },
      { label: { ko: '3세부 연구내용', en: 'Division 3 Research' }, href: '/research/energy-performance' },
      { label: { ko: '4세부 연구내용', en: 'Division 4 Research' }, href: '/research/smart-construction' },
      { label: { ko: '연구성과·논문', en: 'Results & Publications' }, href: '/publications' },
    ],
  },
  {
    id: 'people', label: { ko: '연구진', en: 'Researchers' },
    items: [
      { label: { ko: '단장·부단장', en: 'Director & Deputy Director' }, href: '/team/leadership', empty: true },
      { label: { ko: '세부별 연구책임자', en: 'Division Leads' }, href: '/team' },
      { label: { ko: '참여연구원', en: 'Participating Researchers' }, href: '/team/researchers' },
    ],
  },
  {
    id: 'news', label: { ko: '소식·홍보', en: 'News & Media' },
    items: [
      { label: { ko: '대외 공지사항', en: 'Public Notices' }, href: '/news/notices', empty: true },
      { label: { ko: '연구단 소식', en: 'Project News' }, href: '/news' },
      { label: { ko: '언론보도', en: 'Press Coverage' }, href: '/news/press', empty: true },
      { label: { ko: '홍보자료', en: 'Media Resources' }, href: '/news/media', empty: true },
    ],
  },
  {
    id: 'board', label: { ko: '게시판', en: 'Member Board' }, membersOnly: true,
    items: [
      { label: { ko: '연구 공지사항', en: 'Research Notices' }, href: '/board/notices', empty: true },
      { label: { ko: '연구 관련 게시글', en: 'Research Discussions' }, href: '/board' },
    ],
  },
];
