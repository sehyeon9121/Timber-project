import { Link } from 'react-router-dom';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { teamMembers } from '@/data/teamMembers';
import type { LocalizedText } from '@/types';
import styles from './LeadershipPage.module.css';

const deputy = teamMembers.find(member => member.id === 'division4-representative');

// Leadership roles and introductions are draft copy for review.
const profiles = [
  {
    id: 'director',
    role: { ko: '연구단장', en: 'Research Director' },
    name: { ko: '이승재', en: 'Seungjae Lee' },
    affiliation: { ko: '한국기술교육대학교 정교수', en: 'Professor, Korea University of Technology and Education' },
    image: `${import.meta.env.BASE_URL}images/leeseunglab/director-greeting.jpg`,
    introduction: {
      ko: '200m급 목구조 대공간 건축물 건설 기술개발 연구단을 이끌며, 참여기관과 연구진의 역량을 연결하여 지속 가능한 목조건축 기술의 발전을 추진합니다.',
      en: 'Leading the research group for 200m-class large-span timber construction, Professor Lee brings together partner institutions and researchers to advance sustainable timber architecture.',
    },
    responsibility: { ko: '연구단 운영 및 연구개발 총괄 · 참여기관 협력', en: 'Research leadership and coordination with partner institutions' },
    focus: { ko: '초대형 목구조 대공간 건축 기술', en: 'Large-span timber construction technologies' },
    href: '/about/greeting',
    link: { ko: '단장 인사말 보기', en: 'Read the Director’s Message' },
  },
  {
    id: 'deputy',
    role: { ko: '부단장', en: 'Deputy Director' },
    name: deputy?.name ?? { ko: '최경규', en: 'Choi, Kyoung-Kyu' },
    affiliation: { ko: '숭실대학교 교수 · 4세부 책임자', en: 'Professor, Soongsil University · Division 4 Lead' },
    image: deputy?.image,
    introduction: {
      ko: '서울대학교에서 건축구조 전공으로 석사 및 박사 학위를 취득하였으며, 건축구조공학과 구조 안전 분야의 연구를 수행하고 있습니다. 최근에는 AI와 디지털 기술을 활용한 스마트 건설 및 컴퓨터비전 기반 품질관리 연구에 집중하고 있습니다.',
      en: 'Professor Choi earned his M.S. and Ph.D. in structural engineering from Seoul National University. His research spans structural engineering and safety, with a recent focus on AI, digital technologies, and computer vision-based quality control for smart construction.',
    },
    responsibility: { ko: '연구단 운영 지원 · 4세부 연구개발 총괄', en: 'Supporting research group operations and leading Division 4' },
    focus: { ko: '건축구조공학 · AI 기반 스마트 건설 · 디지털 품질관리', en: 'Structural engineering · AI for smart construction · Digital quality control' },
    href: '/research/smart-construction',
    link: { ko: '4세부 연구내용 보기', en: 'Explore Division 4 Research' },
  },
];

export function LeadershipPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const localize = (text: string | LocalizedText) => typeof text === 'string' ? text : ko ? text.ko : text.en;

  return (
    <DetailPageLayout title={ko ? '단장·부단장' : 'Director & Deputy Director'} noHeroImage heroMaxHeight={144}>
      <div className={styles.container}>
        {profiles.map(profile => (
          <article key={profile.id} className={styles.profile} aria-labelledby={`${profile.id}-name`}>
            {profile.image && <img className={styles.portrait} src={profile.image} alt={localize(profile.name)} />}
            <div className={styles.info}>
              <span className={styles.role}>{localize(profile.role)}</span>
              <h2 id={`${profile.id}-name`} className={styles.name}>{localize(profile.name)}</h2>
              <p className={styles.affiliation}>{localize(profile.affiliation)}</p>
              <p className={styles.introduction}>{localize(profile.introduction)}</p>
              <dl className={styles.details}>
                <div><dt>{ko ? '담당 역할' : 'Responsibilities'}</dt><dd>{localize(profile.responsibility)}</dd></div>
                <div><dt>{ko ? '연구 분야' : 'Research Focus'}</dt><dd>{localize(profile.focus)}</dd></div>
              </dl>
              <Link className={styles.link} to={profile.href}>{localize(profile.link)} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </DetailPageLayout>
  );
}
