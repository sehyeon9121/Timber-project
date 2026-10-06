import { Target, ArrowRight } from 'lucide-react';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { resultTargetGroups, resultTargetTotals } from '@/data/researchResults';
import styles from './ResearchResultsPage.module.css';

export function ResearchResultsPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';

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
        <p className={styles.targetNote}>{ko ? '아래 수치는 연구개발 목표치이며, 달성 실적을 의미하지 않습니다.' : 'The figures below are research targets and do not represent achieved results.'}</p>
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
                  <div className={styles.cardTotal}><strong>{item.first + item.second}</strong><span>{ko ? '전체 목표' : 'Total target'}</span></div>
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
