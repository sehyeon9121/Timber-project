import { ArrowRight, Trees, PencilRuler, Zap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocalizedText } from '@/types';
import styles from './VisionPage.module.css';

// Targets follow the supplied research-goal reference; descriptions are draft copy.
const goals = [
  {
    number: '01', icon: Trees, color: 'material', href: '/research/terrestrial-carbon',
    division: { ko: '1세부 · 재료', en: 'Division 1 · Materials' },
    metric: '1,000 × 1,000',
    title: { ko: '저탄소 고성능 국산목재 개발', en: 'Low-carbon, high-performance domestic timber' },
    description: { ko: '국산목재의 활용 가능성을 넓히고, 초대형 목구조를 구현하기 위한 고성능 재료 및 부재 기술을 개발합니다.', en: 'Develop high-performance timber materials and members to expand the use of domestic wood in large-span structures.' },
    target: { ko: '국산목재 개발 목표', en: 'Domestic timber development target' },
  },
  {
    number: '02', icon: PencilRuler, color: 'design', href: '/research/natural-climate',
    division: { ko: '2세부 · 설계', en: 'Division 2 · Design' },
    metric: '70%',
    title: { ko: '탄소 배출량 저감 설계 기술', en: 'Design for reduced carbon emissions' },
    description: { ko: '목구조의 특성을 반영한 구조·접합 설계와 디지털 설계 기술을 연결하여 저탄소 대공간 건축을 실현합니다.', en: 'Combine timber structural and connection design with digital technologies to enable low-carbon large-span buildings.' },
    target: { ko: '탄소 배출량 저감 목표', en: 'Carbon emissions reduction target' },
  },
  {
    number: '03', icon: Zap, color: 'energy', href: '/research/energy-performance',
    division: { ko: '3세부 · 환경', en: 'Division 3 · Environment' },
    metric: '50%',
    title: { ko: '운영 에너지 절감 기술', en: 'Energy-efficient building operation' },
    description: { ko: '환경·에너지 성능 평가와 효율적인 운영관리 기술을 통해 건축물의 운영 에너지를 줄이고 쾌적한 실내환경을 조성합니다.', en: 'Reduce operational energy and support comfortable indoor environments through performance evaluation and efficient building management.' },
    target: { ko: '운영 에너지 단축 목표', en: 'Operational energy reduction target' },
  },
  {
    number: '04', icon: Building2, color: 'construction', href: '/research/smart-construction',
    division: { ko: '4세부 · 시공', en: 'Division 4 · Construction' },
    metric: '10%',
    title: { ko: 'OSC 기반 스마트 시공 기술', en: 'Smart construction with OSC' },
    description: { ko: '탈현장 건설(OSC)과 디지털 품질관리 기술을 활용하여 시공 효율을 높이고, 현장 공기를 단축하는 건설 기술을 개발합니다.', en: 'Use off-site construction (OSC) and digital quality control to improve construction efficiency and shorten on-site schedules.' },
    target: { ko: '공기 단축 목표', en: 'Construction time reduction target' },
  },
];

export function VisionPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const localize = (text: LocalizedText) => ko ? text.ko : text.en;

  return (
    <DetailPageLayout title={ko ? '비전·목표' : 'Vision & Goals'} noHeroImage heroMaxHeight={144}>
      <div className={styles.page}>
        <section className={styles.vision} aria-labelledby="vision-title">
          <div className={styles.visionText}>
            <p className={styles.eyebrow}>OUR VISION</p>
            <h2 id="vision-title">{ko ? <>목재로 여는 대공간,<br />탄소중립 건축의 미래</> : <>A future of large-span timber<br />and carbon-neutral architecture</>}</h2>
            <p className={styles.visionDescription}>{ko ? '건설 분야 탄소중립 실현을 위한 비정형 목조 대공간 건축물의 재료·설계·환경·시공 및 유지관리 기술을 자립화하고, 글로벌 시장을 선도합니다.' : 'Advance domestic capabilities in materials, design, environment, construction, and maintenance for free-form large-span timber buildings, supporting carbon neutrality and global competitiveness.'}</p>
            <div className={styles.keyGoal}>
              <strong>200<span>m</span></strong>
              <p>{ko ? <>급 목구조 대공간<br />건축물 건설 기술개발</> : <>class large-span timber<br />construction technology</>}</p>
            </div>
          </div>
          <img className={styles.visionImage} src={`${import.meta.env.BASE_URL}images/leeseunglab/test-homepage.jpg`} alt={ko ? '목구조 대공간 건축물 구상 이미지' : 'Concept image of a large-span timber building'} />
        </section>

        <section className={styles.goals} aria-labelledby="goals-title">
          <header className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>RESEARCH GOALS</p>
            <h2 id="goals-title">{ko ? '4대 핵심 연구개발 목표' : 'Four Core Research Goals'}</h2>
            <p>{ko ? '재료에서 설계, 환경, 시공까지. 네 가지 핵심 기술을 연결해 초대형 목조건축의 가능성을 넓힙니다.' : 'Connecting materials, design, environment, and construction to expand the possibilities of large-span timber architecture.'}</p>
          </header>
          <div className={styles.goalGrid}>
            {goals.map(({ icon: Icon, ...goal }) => (
              <article key={goal.number} className={`${styles.goalCard} ${styles[goal.color]}`}>
                <header className={styles.cardHeader}><span>{localize(goal.division)}</span><Icon size={24} strokeWidth={1.6} aria-hidden="true" /></header>
                <strong className={styles.metric}>{goal.metric}</strong>
                <p className={styles.target}>{localize(goal.target)}</p>
                <h3>{localize(goal.title)}</h3>
                <p className={styles.description}>{localize(goal.description)}</p>
                <Link to={goal.href} className={styles.cardLink}>{ko ? '세부 연구내용 보기' : 'Explore this research'}<ArrowRight size={16} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.integration} aria-labelledby="integration-title">
          <div>
            <p className={styles.sectionLabel}>FROM RESEARCH TO PRACTICE</p>
            <h2 id="integration-title">{ko ? '핵심 기술을 넘어, 실증과 현장 적용으로' : 'From core technologies to demonstration and practice'}</h2>
            <p>{ko ? '개별 기술의 개발과 통합 검증을 통해 연구성과의 실용화를 추진하고, 지속 가능한 목조건축의 기반을 마련합니다.' : 'Integrate and validate the core technologies to support practical application and establish a foundation for sustainable timber construction.'}</p>
            <Link to="/research/strategy" className={styles.cardLink}>{ko ? '연구 목표·추진체계 보기' : 'View Goals & Framework'}<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.readiness}>
            <span>{ko ? '기술성숙도 목표' : 'Technology readiness target'}</span>
            <div><span>TRL 3</span><ArrowRight size={22} aria-hidden="true" /><strong>TRL 8</strong></div>
            <p>{ko ? '개발 전 → 개발 후' : 'Before → After development'}</p>
            <small>{ko ? '기술 성격에 따라 TRL 7~9' : 'TRL 7–9 depending on the technology'}</small>
          </div>
        </section>
      </div>
    </DetailPageLayout>
  );
}
