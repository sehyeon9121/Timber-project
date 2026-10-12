import { ArrowDown, ArrowRight } from 'lucide-react';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  demonstrationRows, strategyDivisions,
  type StrategyCard, type StrategyDivision, type StrategyRow,
} from '@/data/researchStrategy';
import styles from './ResearchStrategyPage.module.css';

function StageCards({ cards, stage, columns = 3 }: { cards: StrategyCard[]; stage: 'initial' | 'advanced'; columns?: number }) {
  return (
    <div className={`${styles.stageCards} ${stage === 'advanced' || columns === 2 ? styles.twoColumns : ''}`}>
      <span className={styles.mobileStage}>{stage === 'initial' ? '1단계' : '2단계'}</span>
      {cards.map(card => (
        <p key={card.text} className={styles.taskCard} style={{
          gridColumn: `${card.column ?? 'auto'} / span ${card.span ?? 1}`,
        }}>{card.text}</p>
      ))}
    </div>
  );
}

function FlowRow({ row, columns }: { row: StrategyRow; columns?: number }) {
  return (
    <div className={`${styles.flowRow} ${styles[row.color]}`}>
      <StageCards cards={row.initial} stage="initial" columns={columns} />
      <div className={styles.connector}>
        <span>{row.topic}</span>
        <ArrowRight className={styles.rightArrow} size={20} aria-hidden="true" />
        <ArrowDown className={styles.downArrow} size={20} aria-hidden="true" />
      </div>
      <StageCards cards={row.advanced} stage="advanced" />
    </div>
  );
}

function StageGuide() {
  return (
    <div className={styles.stageGuide}>
      <div className={styles.guideInitial}>
        <span>1단계</span>
        <div className={styles.years}><span>1차년도</span><span>2차년도</span><span>3차년도</span></div>
      </div>
      <div aria-hidden="true" />
      <div className={styles.guideAdvanced}>
        <span>2단계</span>
        <div className={`${styles.years} ${styles.twoColumns}`}><span>4차년도</span><span>5차년도</span></div>
      </div>
    </div>
  );
}

function Goal({ goal }: { goal: StrategyDivision['goal'] }) {
  const parts = goal.text.split(goal.value);
  return (
    <aside className={styles.goal} aria-label="최종 목표">
      <span className={styles.goalLabel}>최종 목표</span>
      {parts.length === 2 ? (
        <p className={styles.goalText}>{parts[0]}<strong>{goal.value}</strong>{parts[1]}</p>
      ) : (
        <p className={styles.goalText}><strong className={styles.wideGoalValue}>{goal.value}</strong>{goal.text}</p>
      )}
    </aside>
  );
}

function Linkage({ from, to }: { from: string; to: string }) {
  return (
    <div className={styles.linkage}>
      <span className={styles.linkBadge}>연계</span>
      <span>{from}</span>
      <ArrowRight size={16} aria-label="연결" />
      <span>{to}</span>
    </div>
  );
}

function Division({ division }: { division: StrategyDivision }) {
  return (
    <section id={division.id} className={styles.division} aria-labelledby={`${division.id}-title`}>
      <header className={styles.divisionHeader}>
        <div className={styles.divisionTitle}>
          <span className={styles.divisionNumber}>{division.number}</span>
          <h3 id={`${division.id}-title`}>{division.title}</h3>
        </div>
        <ul className={styles.legend} aria-label={`${division.title} 연구 분야`}>
          {division.legend.map(item => (
            <li key={item.label} className={styles[item.color]}><i aria-hidden="true" />{item.label}</li>
          ))}
        </ul>
      </header>
      <div className={styles.divisionBody}>
        <div className={styles.researchFlow}>
          <StageGuide />
          {division.rows.map((row, index) => <FlowRow key={`${division.id}-${index}`} row={row} />)}
        </div>
        <Goal goal={division.goal} />
      </div>
      {division.id === 'design' && <Linkage
        from="AI 모델 고도화 및 구조안전성 검증 적용형 통합 설계 자동화 패키지 개발"
        to="OSC통합설계 자동화"
      />}
      {division.id === 'construction' && <div className={styles.linkageGroup}>
        <Linkage from="구조시스템 정의 및 제작" to="3D LiDAR 이미지 센싱 환경 구축 및 센싱기술" />
        <Linkage from="목재이용법 시행령 및 시행규칙/관련기술 활용지원" to="OSC 모듈 구조시공 통합 기술 고도화 및 적용 가이드 라인 도출" />
      </div>}
    </section>
  );
}

export function ResearchStrategyPage() {
  const { language } = useLanguage();
  return (
    <DetailPageLayout title={language === 'KO' ? '연구 목표·추진체계' : 'Goals & Framework'} noHeroImage>
      <div className={styles.page}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>다. 연구개발내용 구성의 타당성 및 연계성</p>
          <h2>연구개발내용의 구성</h2>
        </header>

        <div className={styles.roadmap} aria-label="연구개발 단계">
          <div className={styles.firstPhase}>
            <span>[1단계]</span>
            <h3>50~100m급 기술개발 및 실증</h3>
            <div className={styles.phaseYears}><span>1차년도</span><ArrowRight size={16} aria-hidden="true" /><span>2차년도</span><ArrowRight size={16} aria-hidden="true" /><span>3차년도</span></div>
            <p>실증화 조기 달성을 위한 핵심기술 조기 확보</p>
          </div>
          <div className={styles.secondPhase}>
            <span>[2단계]</span>
            <h3>200m급 기술 고도화</h3>
            <div className={styles.phaseYears}><span>4차년도</span><ArrowRight size={16} aria-hidden="true" /><span>5차년도</span></div>
            <p>고도화 기술개발</p>
          </div>
          <div className={styles.finalPhase}><ArrowRight size={25} aria-hidden="true" /><span>최종 목표</span></div>
        </div>

        <nav className={styles.sectionLinks} aria-label="연구 분야 바로가기">
          {strategyDivisions.map(division => <a key={division.id} href={`#${division.id}`}>{division.number}<span>{division.title}</span></a>)}
          <a href="#demonstration">추진계획<span>실증</span></a>
        </nav>

        <div className={styles.frameworkGroup}>
          <h2 className={styles.groupTitle}>하이브리드 목조 대공간 건축물 설계 및 시공 구조기준(안)</h2>
          <Division division={strategyDivisions[0]} />
          <Linkage from="하이브리드 부재" to="파라메트릭 형상 DB, 구조생성설계" />
          <Division division={strategyDivisions[1]} />
        </div>

        <div className={styles.frameworkGroup}>
          <h2 className={styles.groupTitle}>디지털 트윈 기반 에너지 및 유지관리 통합 모니터링 시스템</h2>
          <Division division={strategyDivisions[2]} />
          <Division division={strategyDivisions[3]} />
        </div>

        <section id="demonstration" className={`${styles.division} ${styles.demonstration}`} aria-labelledby="demonstration-title">
          <header className={styles.divisionHeader}>
            <div className={styles.divisionTitle}><span className={styles.planBadge}>추진계획</span><h3 id="demonstration-title">실증</h3></div>
            <ul className={styles.legend} aria-label="실증 연구 분야">
              <li className={styles.green}><i aria-hidden="true" />연구단</li>
              <li className={styles.amber}><i aria-hidden="true" />관광공사</li>
            </ul>
          </header>
          <div className={styles.divisionBody}>
            <div className={styles.researchFlow}>
              <StageGuide />
              {demonstrationRows.map(row => <FlowRow key={row.color} row={row} columns={2} />)}
              <ol className={styles.milestones} aria-label="실증 추진계획">
                <li>실시 설계 제작 도서 완료</li>
                <li>GLT부재제작 및 착공</li>
                <li>SHOW DWG 착수</li>
              </ol>
            </div>
            <aside className={`${styles.goal} ${styles.demonstrationGoal}`} aria-label="실증 최종 목표">
              <span className={styles.goalLabel}>최종 목표</span>
              <p className={styles.goalText}>조기실증 완료 및 <b>200m급</b> 고도화 기술개발</p>
            </aside>
          </div>
        </section>
        <p className={styles.reference}>본문 p. 83 참조</p>
      </div>
    </DetailPageLayout>
  );
}
