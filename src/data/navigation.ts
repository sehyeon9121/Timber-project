import type { NavItem } from '@/types';

export const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Research', href: '/#research' },
];

export const publicationsDropdownItems: NavItem[] = [
  { label: 'SCIE', href: '/publications/scie' },
  { label: 'KCI', href: '/publications/kci' },
  { label: 'Int. Conference', href: '/publications/international-conference' },
  { label: 'Dom. Conference', href: '/publications/domestic-conference' },
  { label: 'SCOPUS', href: '/publications/scopus' },
];

export const peopleDropdownItems: NavItem[] = [
  { label: 'Our Team', href: '/team' },
  { label: 'Join Us', href: '/join-us' },
];

export const newsDropdownItems: NavItem[] = [
  { label: 'News & Updates', href: '/news' },
  { label: 'Climate Snacks', href: '/climate-snacks' },
];
