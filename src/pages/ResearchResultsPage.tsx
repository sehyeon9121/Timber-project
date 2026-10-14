import { Target, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultProgress } from '@/components/molecules/ResultProgress';
import { resultTotals } from '@/data/researchResults';
import type { ResearchResults } from '@/data/researchResults';
import { useBoardResource } from '@/hooks/useBoardResource';
import { authErrorMessage } from '@/lib/auth-api';
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/contexts/auth-context';
import { ResearchResultsEditor } from '@/components/organisms/ResearchResultsEditor';
import styles from './ResearchResultsPage.module.css';

export function ResearchResultsPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
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
          {user?.role === 'master' && <div className={styles.editControls}>
            <Button type="button" aria-expanded={editing} aria-controls="research-results-editor" onClick={() => { setEditing(current => !current); setSaved(false); }}>
              {editing ? (ko ? '수정 닫기' : 'Close editor') : (ko ? '지표 값 수정' : 'Edit indicator values')}
            </Button>
            <span>{ko ? '관리자로 로그인하여 목표·달성 실적과 집계 기준일을 수정할 수 있습니다.' : 'As an administrator, you can edit targets, results, and the reporting date.'}</span>
          </div>}
          {saved && <p role="status" className={styles.savedNotice}>{ko ? '지표 값과 집계 기준일을 저장했습니다.' : 'Indicator values and the reporting date have been saved.'}</p>}
        </header>
        {user?.role === 'master' && editing && <section id="research-results-editor" className={styles.editPanel} aria-label={ko ? '지표 값 수정' : 'Edit indicator values'}>
          <ResearchResultsEditor onSaved={() => { setEditing(false); setSaved(true); reload(); }} />
        </section>}
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
