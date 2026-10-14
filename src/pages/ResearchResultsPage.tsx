import { Target, ArrowRight } from 'lucide-react';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultProgress } from '@/components/molecules/ResultProgress';
import { achievementRate, resultTotals } from '@/data/researchResults';
import type { ResearchResults } from '@/data/researchResults';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import { Button } from '@/components/atoms/Button';
import styles from './ResearchResultsPage.module.css';

export function ResearchResultsPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const { data, loading, error, reload } = useBoardResource<ResearchResults>('/research/results');
  if (!data) return <DetailPageLayout title={ko ? '연구개발' : 'Research and Development'} noHeroImage heroMaxHeight={144}>
    <section className={styles.page}>
      {loading ? <p role="status">{ko ? '연구성과를 불러오는 중…' : 'Loading research results…'}</p> : <>
        <p role="alert">{authErrorMessage(error, language)}</p>
        <Button onClick={reload}>{ko ? '다시 시도' : 'Try again'}</Button>
      </>}
    </section>
  </DetailPageLayout>;
  const resultTargetGroups = data.groups;
  const resultTargets = data.groups.flatMap(group => group.items);
  const resultTargetTotals = resultTotals(data.groups);

  return (
    <DetailPageLayout title={ko ? '연구개발' : 'Research and Development'} noHeroImage heroMaxHeight={144}>
      <section className={styles.page} aria-labelledby="results-title">
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>RESEARCH PERFORMANCE TARGETS</p>
          <h2 id="results-title">{ko ? '연구성과 지표 및 목표' : 'Research Performance Indicators & Targets'}</h2>
          <p className={styles.description}>{ko ? '연구개발의 가치를 학술·기술·인력 성과로 연결합니다. 2026년부터 2030년까지 단계별 목표를 설정하고 체계적으로 추진합니다.' : 'Translate research into academic, technological, and training outcomes through phased targets for 2026–2030.'}</p>
        </header>
        <div className={styles.summary}>
          <div className={styles.total}>
            <div className={styles.totalLabel}><Target size={20} aria-hidden="true" /><span>{ko ? '전체 성과지표 목표 합계' : 'Total Indicator Target'}</span></div>
            <strong>{resultTargetTotals.first + resultTargetTotals.second}</strong>
            <p>{ko ? '12개 성과지표 · 2026–2030' : '12 indicators · 2026–2030'}</p>
          </div>
          <div className={styles.phase}>
            <span>{ko ? '1단계' : 'Phase 1'}<small>2026–2028</small></span>
            <strong>{resultTargetTotals.first}</strong>
            <p>{ko ? '1단계 목표치 합계' : 'Phase 1 target total'}</p>
          </div>
          <div className={`${styles.phase} ${styles.secondPhase}`}>
            <span>{ko ? '2단계' : 'Phase 2'}<small>2029–2030</small></span>
            <strong>{resultTargetTotals.second}</strong>
            <p>{ko ? '2단계 목표치 합계' : 'Phase 2 target total'}</p>
          </div>
        </div>
        <ResultProgress target={resultTargetTotals.first + resultTargetTotals.second}
          completed={resultTargetTotals.completed} reported={resultTargetTotals.reported}
          indicatorCount={resultTargets.length} asOfDate={data.asOfDate} language={language} />
        <p className={styles.targetNote}>{ko ? '초록색은 전체 목표, 빨간색은 현재 달성 실적입니다. 아직 집계하지 않은 실적은 —로 표시합니다.' : 'Green indicates the total target; red indicates achieved results. Unreported results are shown as —.'}</p>
        <section className={styles.annual} aria-labelledby="annual-results-title">
          <header>
            <h3 id="annual-results-title">{ko ? `${data.year}년 ${data.year - 2025}차년도 계획 및 달성 실적` : `${data.year} (Year ${data.year - 2025}) Plans & Results`}</h3>
            <p>{data.asOfDate ? (ko ? `집계 기준일 ${data.asOfDate.replaceAll('-', '. ')}` : `As of ${data.asOfDate}`) : (ko ? '초기 입력값 · 집계 기준일 미등록' : 'Initial values · Reporting date pending')}</p>
          </header>
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={ko ? '연간 연구성과 표' : 'Annual research results table'}>
            <table className={styles.annualTable}>
              <caption className="sr-only">{ko ? '성과지표별 연간 계획, 달성 건수 및 달성률' : 'Annual plans, achieved counts, and achievement rates by indicator'}</caption>
              <thead><tr>{(ko ? ['성과지표명', '연간 계획', '달성', '달성률(%)'] : ['Performance indicator', 'Annual plan', 'Achieved', 'Achievement (%)']).map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
              {data.groups.map(group => <tbody key={group.id}>
                <tr><th colSpan={4} scope="rowgroup" className={styles.annualGroup}>{ko ? group.title.ko : group.title.en}</th></tr>
                {group.items.map(item => <tr key={item.id}>
                  <th scope="row">{ko ? item.label.ko : item.label.en}</th>
                  <td>{item.annualPlan ?? '—'}</td><td>{item.annualCompleted ?? '—'}</td>
                  <td>{achievementRate(item.annualPlan, item.annualCompleted)}</td>
                </tr>)}
              </tbody>)}
            </table>
          </div>
          <p className={styles.targetNote}>{ko ? '달성률은 연간 계획 대비 실적이며, 위 그래프는 전체 연구기간 목표 대비 누적 실적입니다. 미집계 또는 계획 0건의 달성률은 —로 표시합니다.' : 'Annual achievement rates use annual plans; the graph above compares cumulative results against full-project targets. Unreported rates or plans of zero are shown as —.'}</p>
        </section>
        {resultTargetGroups.map((group, index) => (
          <section key={group.id} className={styles.group} aria-labelledby={`${group.id}-title`}>
            <header className={styles.groupHeader}>
              <span className={styles.groupNumber}>0{index + 1}</span>
              <div>
                <h3 id={`${group.id}-title`}>{ko ? group.title.ko : group.title.en}</h3>
                <p>{ko ? group.description.ko : group.description.en}</p>
              </div>
            </header>
            <div className={styles.grid}>
              {group.items.map(item => (
                <article className={styles.card} key={item.id}>
                  <h4>{ko ? item.label.ko : item.label.en}</h4>
                  <div className={styles.cardTotal}>
                    <div className={styles.targetMetric}><strong>{item.first + item.second}</strong><span>{ko ? '전체 목표' : 'Total target'}</span></div>
                    <div className={styles.completedMetric}><strong>{item.completed ?? '—'}</strong><span>{ko ? '현재 달성' : 'Achieved'}{item.completed === null && <small>{ko ? '집계 전' : 'Not reported'}</small>}</span></div>
                  </div>
                  <dl className={styles.breakdown}>
                    <div><dt>{ko ? '1단계' : 'Phase 1'} <small>2026–2028</small></dt><dd>{item.first}</dd></div>
                    <ArrowRight size={16} className={styles.arrow} aria-hidden="true" />
                    <div><dt>{ko ? '2단계' : 'Phase 2'} <small>2029–2030</small></dt><dd>{item.second}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    </DetailPageLayout>
  );
}
