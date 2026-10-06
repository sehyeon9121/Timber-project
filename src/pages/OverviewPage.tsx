import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ArrowRight, Trees, PencilRuler, Leaf, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LocalizedText } from '@/types';
import styles from './OverviewPage.module.css';

// Summarized from the agreement research plan: PDF pp. 1, 25–29, 35–40.
const fields = [
  {
    number: '01', icon: Trees,
    title: { ko: '고성능 하이브리드 대단면 부재', en: 'High-performance Hybrid Timber Members' },
    description: { ko: '목재 가공, 대단면 부재의 설계·제작, 하이브리드 단면과 내화·내구성능 기술을 개발합니다.', en: 'Develop timber processing, large-section member design and fabrication, hybrid sections, and fire resistance and durability technologies.' },
    href: '/research/terrestrial-carbon',
  },
  {
    number: '02', icon: PencilRuler,
    title: { ko: 'OSC 모듈화 및 탄소중립 설계', en: 'OSC Modularization & Carbon-neutral Design' },
    description: { ko: '구조시스템과 접합부 설계, AI 기반 구조제어, 구조안전성 평가를 통해 목조 대공간 설계 기술을 확보합니다.', en: 'Advance large-span timber design through structural systems, connection design, AI-based structural control, and structural safety assessment.' },
    href: '/research/natural-climate',
  },
  {
    number: '03', icon: Leaf,
    title: { ko: '친환경 및 에너지 평가', en: 'Environmental & Energy Performance' },
    description: { ko: '에너지와 실내환경 성능을 평가하고, 열·습기 관리 및 화재예방 기술을 개발합니다.', en: 'Evaluate energy and indoor environmental performance, and develop thermal and moisture management and fire prevention technologies.' },
    href: '/research/energy-performance',
  },
  {
    number: '04', icon: Building2,
    title: { ko: '스마트 시공 및 유지관리', en: 'Smart Construction & Maintenance' },
    description: { ko: 'OSC 기반 시공 최적화, 디지털 트윈, 복합센싱을 연계하여 건축물의 시공과 유지관리를 고도화합니다.', en: 'Integrate OSC construction optimization, digital twins, and multi-sensor monitoring to advance construction and maintenance.' },
    href: '/research/smart-construction',
  },
];

export function OverviewPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const localize = (text: LocalizedText) => ko ? text.ko : text.en;

  return (
    <DetailPageLayout title={ko ? '연구단 개요' : 'Project Overview'} noHeroImage heroMaxHeight={144}>
      <div className={styles.page}>
        <section className={styles.introduction} aria-labelledby="overview-title">
          <div>
            <p className={styles.eyebrow}>PROJECT OVERVIEW</p>
            <h2 id="overview-title">{ko ? <>200m급 목구조 대공간<br />건축물 건설 기술개발 연구단</> : <>Research Group for<br />200m-scale Large-span Timber Construction</>}</h2>
            <p className={styles.lead}>{ko ? '재료에서 설계, 환경, 시공과 유지관리까지. 목조 대공간 건축의 전 과정을 연결하는 건설 기술을 개발합니다.' : 'Connecting materials, design, environment, construction, and maintenance to advance large-span timber building technologies.'}</p>
            <p className={styles.body}>{ko ? '우리 연구단은 건설 분야의 탄소중립 실현을 위해 비정형 목조 대공간 건축물에 필요한 핵심 기술의 자립화를 추진합니다. 한국기술교육대학교 산학협력단을 중심으로 대학, 연구기관, 산업계가 협력하여 국내 기술 기반을 강화하고 글로벌 시장 경쟁력을 확보하고자 합니다.' : 'Our research group develops domestic capabilities in core technologies for free-form large-span timber buildings to support carbon neutrality in construction. Led by the Industry-University Cooperation Foundation of Korea University of Technology and Education, universities, research institutes, and industry collaborate to strengthen domestic capabilities and global competitiveness.'}</p>
          </div>
          <figure className={styles.figure}>
            <img src={`${import.meta.env.BASE_URL}images/leeseunglab/test-homepage.jpg`} alt={ko ? '목구조 대공간 건축물 구상 이미지' : 'Concept image of a large-span timber building'} />
            <figcaption>{ko ? '200m급 목구조 대공간 건축물 구상 이미지' : 'Concept image for 200m-scale large-span timber construction'}</figcaption>
          </figure>
        </section>

        <dl className={styles.facts} aria-label={ko ? '연구개발과제 기본정보' : 'Project Facts'}>
          <div><dt>{ko ? '연구기간' : 'Project Period'}</dt><dd>2026.04.01 – 2030.12.31 <small>{ko ? '(57개월)' : '(57 months)'}</small></dd></div>
          <div><dt>{ko ? '주관연구개발기관' : 'Lead Institution'}</dt><dd>{ko ? '한국기술교육대학교 산학협력단' : 'Industry-University Cooperation Foundation, KOREATECH'}</dd></div>
          <div><dt>{ko ? '연구책임자' : 'Principal Investigator'}</dt><dd>{ko ? '이승재 교수' : 'Professor Seungjae Lee'}</dd></div>
          <div><dt>{ko ? '사업 소관·전문기관' : 'Ministry & Funding Agency'}</dt><dd>{ko ? '국토교통부 · 국토교통과학기술진흥원' : 'Ministry of Land, Infrastructure and Transport · KAIA'}</dd></div>
        </dl>

        <section className={styles.section} aria-labelledby="fields-title">
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>FOUR RESEARCH DIVISIONS</p>
            <h2 id="fields-title">{ko ? '4개 세부 연구의 통합과 협력' : 'Four Divisions, One Integrated Approach'}</h2>
            <p>{ko ? '재료·설계·환경·시공 기술을 유기적으로 연계하여 목조 대공간 건축물의 핵심 요소기술을 확보합니다.' : 'Connect materials, design, environment, and construction to establish core technologies for large-span timber buildings.'}</p>
          </header>
          <div className={styles.fieldGrid}>
            {fields.map(({ icon: Icon, ...field }) => (
              <article key={field.number} className={styles.field}>
                <div className={styles.fieldLabel}><span>{ko ? `${Number(field.number)}세부` : `Division ${Number(field.number)}`}</span><Icon size={22} aria-hidden="true" /></div>
                <h3>{localize(field.title)}</h3>
                <p>{localize(field.description)}</p>
                <Link className={styles.link} to={field.href}>{ko ? '연구내용 보기' : 'Explore Research'}<ArrowRight size={16} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="phases-title">
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>DEVELOPMENT ROADMAP</p>
            <h2 id="phases-title">{ko ? '실증에서 200m급 기술 고도화까지' : 'From Demonstration to 200m-scale Technologies'}</h2>
          </header>
          <div className={styles.phases}>
            <article className={styles.firstPhase}>
              <span>{ko ? '1단계' : 'Phase 1'} · 2026–2028</span>
              <h3>{ko ? '50~100m급 핵심 기술 개발 및 실증' : 'Develop & Demonstrate 50–100m-scale Technologies'}</h3>
              <p>{ko ? '핵심 요소기술의 정의와 개발을 거쳐 테스트베드에 적용하고, 실증을 통해 기술의 적용성을 검증합니다.' : 'Define and develop core technologies, apply them to a test bed, and assess their practical applicability through demonstration.'}</p>
            </article>
            <article className={styles.secondPhase}>
              <span>{ko ? '2단계' : 'Phase 2'} · 2029–2030</span>
              <h3>{ko ? '200m급 핵심 기술 개발 및 고도화' : 'Develop & Advance 200m-scale Technologies'}</h3>
              <p>{ko ? '실증 결과를 바탕으로 200m급 목조 대공간 건축물에 필요한 기술을 고도화하고, 실용화 기반을 구축합니다.' : 'Build on demonstration outcomes to advance technologies for 200m-scale large-span timber buildings and establish a foundation for practical application.'}</p>
            </article>
          </div>
          <Link className={styles.link} to="/research/strategy">{ko ? '연구 목표·추진체계 보기' : 'View Goals & Framework'}<ArrowRight size={16} aria-hidden="true" /></Link>
        </section>

        <section className={styles.demonstration} aria-labelledby="demonstration-title">
          <div>
            <p className={styles.eyebrow}>DEMONSTRATION PLAN</p>
            <h2 id="demonstration-title">{ko ? '강릉 오죽한옥마을 실증 계획' : 'Demonstration Plan at Ojuk Hanok Village, Gangneung'}</h2>
            <p>{ko ? '국산 목재 GLT 시스템을 적용하는 실증사업을 통해 개발 기술의 현장 적용성을 확인하고, 200m급 기술 확장을 위한 기반을 마련할 계획입니다.' : 'The planned demonstration uses a domestic glulam (GLT) system to assess practical applicability and establish a foundation for scaling up to 200m technologies.'}</p>
          </div>
          <dl className={styles.demonstrationFacts}>
            <div><dt>{ko ? '계획 면적' : 'Planned Area'}</dt><dd>3,000<span>㎡</span></dd></div>
            <div><dt>{ko ? '계획 장축' : 'Planned Long Axis'}</dt><dd>67<span>m</span></dd></div>
            <div><dt>{ko ? '적용 기술' : 'Technology'}</dt><dd>GLT</dd></div>
          </dl>
        </section>
      </div>
    </DetailPageLayout>
  );
}
