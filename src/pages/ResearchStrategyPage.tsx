import { useResearchTranslation } from '@/hooks/useResearchTranslation';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  demonstrationRows, strategyDivisions,
  type StrategyCard, type StrategyDivision, type StrategyRow,
} from '@/data/researchStrategy';
import styles from './ResearchStrategyPage.module.css';

function StageCards({ cards, stage, columns = 3 }: { cards: StrategyCard[]; stage: 'initial' | 'advanced'; columns?: number }) {
  const tr = useResearchTranslation();
  return (
    <div className={`${styles.stageCards} ${stage === 'advanced' || columns === 2 ? styles.twoColumns : ''}`}>
      <span className={styles.mobileStage}>{stage === 'initial' ? tr('1단계') : tr('2단계')}</span>
      {cards.map(card => (
        <p key={card.text} className={styles.taskCard} style={{
          gridColumn: `${card.column ?? 'auto'} / span ${card.span ?? 1}`,
        }}>{tr(card.text)}</p>
      ))}
    </div>
  );
}

function FlowRow({ row, columns }: { row: StrategyRow; columns?: number }) {
  const tr = useResearchTranslation();
  return (
    <div className={`${styles.flowRow} ${styles[row.color]}`}>
      <StageCards cards={row.initial} stage="initial" columns={columns} />
      <div className={styles.connector}>
        <span>{tr(row.topic)}</span>
        <ArrowRight className={styles.rightArrow} size={20} aria-hidden="true" />
        <ArrowDown className={styles.downArrow} size={20} aria-hidden="true" />
      </div>
      <StageCards cards={row.advanced} stage="advanced" />
    </div>
  );
}

function StageGuide() {
  const tr = useResearchTranslation();
  return (
    <div className={styles.stageGuide}>
      <div className={styles.guideInitial}>
        <span>{tr("1단계")}</span>
        <div className={styles.years}><span>{tr("1차년도")}</span><span>{tr("2차년도")}</span><span>{tr("3차년도")}</span></div>
      </div>
      <div aria-hidden="true" />
      <div className={styles.guideAdvanced}>
        <span>{tr("2단계")}</span>
        <div className={`${styles.years} ${styles.twoColumns}`}><span>{tr("4차년도")}</span><span>{tr("5차년도")}</span></div>
      </div>
    </div>
  );
}

function Goal({ goal }: { goal: StrategyDivision['goal'] }) {
  const tr = useResearchTranslation();
  const parts = tr(goal.text).split(goal.value);
  return (
    <aside className={styles.goal} aria-label={tr("최종 목표")}>
      <span className={styles.goalLabel}>{tr("최종 목표")}</span>
      {parts.length === 2 ? (
        <p className={styles.goalText}>{parts[0]}<strong>{goal.value}</strong>{parts[1]}</p>
      ) : (
        <p className={styles.goalText}><strong className={styles.wideGoalValue}>{goal.value}</strong>{tr(goal.text)}</p>
      )}
    </aside>
  );
}

function Linkage({ from, to }: { from: string; to: string }) {
  const tr = useResearchTranslation();
  return (
    <div className={styles.linkage}>
      <span className={styles.linkBadge}>{tr("연계")}</span>
      <span>{tr(from)}</span>
      <ArrowRight size={16} aria-label={tr("연결")} />
      <span>{tr(to)}</span>
    </div>
  );
}

function Division({ division }: { division: StrategyDivision }) {
  const { language } = useLanguage();
  const tr = useResearchTranslation();
  return (
    <section id={division.id} className={styles.division} aria-labelledby={`${division.id}-title`}>
      <header className={styles.divisionHeader}>
        <div className={styles.divisionTitle}>
          <span className={styles.divisionNumber}>{tr(division.number)}</span>
          <h3 id={`${division.id}-title`}>{tr(division.title)}</h3>
        </div>
        <ul className={styles.legend} aria-label={`${tr(division.title)} ${language === 'KO' ? '연구 분야' : 'research areas'}`}>
          {division.legend.map(item => (
            <li key={item.label} className={styles[item.color]}><i aria-hidden="true" />{tr(item.label)}</li>
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
        from={tr("AI 모델 고도화 및 구조안전성 검증 적용형 통합 설계 자동화 패키지 개발")}
        to={tr("OSC통합설계 자동화")}
      />}
      {division.id === 'construction' && <div className={styles.linkageGroup}>
        <Linkage from={tr("구조시스템 정의 및 제작")} to={tr("3D LiDAR 이미지 센싱 환경 구축 및 센싱기술")} />
        <Linkage from={tr("목재이용법 시행령 및 시행규칙/관련기술 활용지원")} to={tr("OSC 모듈 구조시공 통합 기술 고도화 및 적용 가이드 라인 도출")} />
      </div>}
    </section>
  );
}

export function ResearchStrategyPage() {
  const tr = useResearchTranslation();
  const { language } = useLanguage();
  return (
    <DetailPageLayout title={language === 'KO' ? '연구 목표·추진체계' : 'Goals & Framework'} noHeroImage>
      <div className={styles.page}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>{tr("다. 연구개발내용 구성의 타당성 및 연계성")}</p>
          <h2>{tr("연구개발내용의 구성")}</h2>
        </header>

        <div className={styles.roadmap} aria-label={tr("연구개발 단계")}>
          <div className={styles.firstPhase}>
            <span>{tr("[1단계]")}</span>
            <h3>{tr("50~100m급 기술개발 및 실증")}</h3>
            <div className={styles.phaseYears}><span>{tr("1차년도")}</span><ArrowRight size={16} aria-hidden="true" /><span>{tr("2차년도")}</span><ArrowRight size={16} aria-hidden="true" /><span>{tr("3차년도")}</span></div>
            <p>{tr("실증화 조기 달성을 위한 핵심기술 조기 확보")}</p>
          </div>
          <div className={styles.secondPhase}>
            <span>{tr("[2단계]")}</span>
            <h3>{tr("200m급 기술 고도화")}</h3>
            <div className={styles.phaseYears}><span>{tr("4차년도")}</span><ArrowRight size={16} aria-hidden="true" /><span>{tr("5차년도")}</span></div>
            <p>{tr("고도화 기술개발")}</p>
          </div>
          <div className={styles.finalPhase}><ArrowRight size={25} aria-hidden="true" /><span>{tr("최종 목표")}</span></div>
        </div>

        <nav className={styles.sectionLinks} aria-label={tr("연구 분야 바로가기")}>
          {strategyDivisions.map(division => <a key={division.id} href={`#${division.id}`}>{tr(division.number)}<span>{tr(division.title)}</span></a>)}
          <a href="#demonstration">{tr("추진계획")}<span>{tr("실증")}</span></a>
        </nav>

        <div className={styles.frameworkGroup}>
          <h2 className={styles.groupTitle}>{tr("하이브리드 목조 대공간 건축물 설계 및 시공 구조기준(안)")}</h2>
          <Division division={strategyDivisions[0]} />
          <Linkage from={tr("하이브리드 부재")} to={tr("파라메트릭 형상 DB, 구조생성설계")} />
          <Division division={strategyDivisions[1]} />
        </div>

        <div className={styles.frameworkGroup}>
          <h2 className={styles.groupTitle}>{tr("디지털 트윈 기반 에너지 및 유지관리 통합 모니터링 시스템")}</h2>
          <Division division={strategyDivisions[2]} />
          <Division division={strategyDivisions[3]} />
        </div>

        <section id="demonstration" className={`${styles.division} ${styles.demonstration}`} aria-labelledby="demonstration-title">
          <header className={styles.divisionHeader}>
            <div className={styles.divisionTitle}><span className={styles.planBadge}>{tr("추진계획")}</span><h3 id="demonstration-title">{tr("실증")}</h3></div>
            <ul className={styles.legend} aria-label={tr("실증 연구 분야")}>
              <li className={styles.green}><i aria-hidden="true" />{tr("연구단")}</li>
              <li className={styles.amber}><i aria-hidden="true" />{tr("관광공사")}</li>
            </ul>
          </header>
          <div className={styles.divisionBody}>
            <div className={styles.researchFlow}>
              <StageGuide />
              {demonstrationRows.map(row => <FlowRow key={row.color} row={row} columns={2} />)}
              <ol className={styles.milestones} aria-label={tr("실증 추진계획")}>
                <li>{tr("실시 설계 제작 도서 완료")}</li>
                <li>{tr("GLT부재제작 및 착공")}</li>
                <li>{tr("SHOW DWG 착수")}</li>
              </ol>
            </div>
            <aside className={`${styles.goal} ${styles.demonstrationGoal}`} aria-label={tr("실증 최종 목표")}>
              <span className={styles.goalLabel}>{tr("최종 목표")}</span>
              <p className={styles.goalText}>{tr("조기실증 완료 및 ")}<b>{tr("200m급")}</b>{tr(" 고도화 기술개발")}</p>
            </aside>
          </div>
        </section>
        <p className={styles.reference}>{tr("본문 p. 83 참조")}</p>
      </div>
    </DetailPageLayout>
  );
}
