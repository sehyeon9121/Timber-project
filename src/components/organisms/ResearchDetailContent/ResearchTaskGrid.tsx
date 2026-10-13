import styles from './ResearchTaskGrid.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResearchTranslation } from '@/hooks/useResearchTranslation';

export type ImageRegion = [x: number, y: number, width: number, height: number];

export interface ResearchTask {
  code: string;
  title: string;
  stages: { title: string; image: ImageRegion; alt: string }[];
}

interface ResearchTaskGridProps {
  division: number;
  title: string;
  diagramDirectory: string;
  tasks: ResearchTask[];
}

function ResearchDiagram({ region, alt, directory }: { region: ImageRegion; alt: string; directory: string }) {
  const [x, y, width, height] = region;
  return (
    <div className={styles.diagram}>
      <img src={`${import.meta.env.BASE_URL}images/leeseunglab/${directory}/${x}-${y}.png`} alt={alt} width={width} height={height} />
    </div>
  );
}

export function ResearchTaskGrid({ division, title, diagramDirectory, tasks }: ResearchTaskGridProps) {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const tr = useResearchTranslation();
  return (
    <div className={styles.detail}>
      <div className={styles.banner}>
        <span className={styles.division}>{ko ? `${division}세부` : `Division ${division}`}</span>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.legend} aria-label={tr('연구 추진 단계')}>
          <span className={styles.firstStage}>{tr('1단계')}</span>
          <span className={styles.secondStage}>{tr('2단계')}</span>
        </div>
      </div>
      <div className={styles.taskGrid}>
        {tasks.map(task => (
          <section key={task.code} className={styles.task} aria-labelledby={`research-${task.code}`}>
            <div className={styles.taskHeading}>
              <span className={styles.taskCode}>{task.code}</span>
              <h2 id={`research-${task.code}`} className={styles.taskTitle}>{tr(task.title)}</h2>
            </div>
            <div className={styles.stages}>
              {task.stages.map((stage, index) => (
                <div key={stage.title} className={`${styles.stage} ${index === 0 ? styles.stageOne : styles.stageTwo}`}>
                  <div className={styles.stageHeading}>
                    <span className={styles.stageLabel}>{ko ? `${index + 1}단계` : `Phase ${index + 1}`}</span>
                    <h3 className={styles.stageTitle}>{tr(stage.title)}</h3>
                  </div>
                  <ResearchDiagram region={stage.image} alt={tr(stage.alt)} directory={diagramDirectory} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
