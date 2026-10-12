import { BarChart3 } from 'lucide-react';
import styles from './ResultProgress.module.css';

export interface ResultProgressProps {
  target: number;
  completed: number;
  reported: number;
  indicatorCount: number;
  asOfDate: string | null;
  language: 'KO' | 'EN';
}

export function ResultProgress({ target, completed, reported, indicatorCount, asOfDate, language }: ResultProgressProps) {
  const ko = language === 'KO';
  const hasResults = reported > 0;
  const percent = target > 0 ? completed / target * 100 : 0;
  const percentLabel = percent.toLocaleString(ko ? 'ko-KR' : 'en-US', { maximumFractionDigits: 1 });
  const partial = reported < indicatorCount;

  return (
    <section className={styles.panel} aria-labelledby="result-progress-title">
      <div className={styles.header}>
        <div>
          <h3 id="result-progress-title"><BarChart3 size={21} aria-hidden="true" />{ko ? '전체 목표 대비 달성 현황' : 'Progress Toward the Overall Target'}</h3>
          <p>{ko ? `${indicatorCount}개 성과지표의 건수 합계 기준 달성률` : `Achievement rate based on the combined counts of ${indicatorCount} indicators`}</p>
        </div>
        <span className={styles.status}>{asOfDate
          ? (ko ? `집계 기준일 ${asOfDate.replaceAll('-', '. ')}` : `As of ${asOfDate}`)
          : (ko ? '집계 기준일 미등록' : 'Reporting date pending')}</span>
      </div>
      <div className={styles.metrics}>
        <div className={styles.counts}>
          <div className={styles.achieved}><span>{ko ? '현재 달성' : 'Achieved'}</span><strong>{hasResults ? completed : '—'}</strong></div>
          <span className={styles.slash} aria-hidden="true">/</span>
          <div className={styles.target}><span>{ko ? '전체 목표' : 'Total target'}</span><strong>{target}</strong></div>
        </div>
        <div className={styles.rate}><span>{ko ? '달성률' : 'Achievement rate'}</span><strong>{hasResults ? percentLabel : '—'}<small>%</small></strong></div>
      </div>
      <div className={styles.track} role="progressbar" aria-labelledby="result-progress-title"
        aria-valuemin={0} aria-valuemax={target} aria-valuenow={hasResults ? Math.min(completed, target) : undefined}
        aria-valuetext={hasResults ? `${completed} / ${target} (${percentLabel}%)` : (ko ? '실적 집계 전' : 'Results not yet reported')}>
        <div className={styles.fill} style={{ width: `${hasResults ? Math.min(percent, 100) : 0}%` }} />
      </div>
      <div className={styles.scale} aria-hidden="true"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
      <div className={styles.footer}>
        <div className={styles.legend}><span className={styles.achievedDot} />{ko ? '달성' : 'Achieved'}<span className={styles.remainingDot} />{ko ? '남은 목표' : 'Remaining target'}</div>
        <p>{!hasResults ? (ko ? '실적 집계 전' : 'Results not yet reported')
          : partial ? (ko ? `${reported}/${indicatorCount}개 지표 입력 · 입력된 실적 기준` : `${reported}/${indicatorCount} indicators reported · Based on reported results`)
          : (ko ? `${indicatorCount}개 지표 실적 반영` : `All ${indicatorCount} indicators reported`)}</p>
      </div>
    </section>
  );
}
