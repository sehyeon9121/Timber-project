import styles from './ResearchTaskGrid.module.css';

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
  return (
    <div className={styles.detail}>
      <div className={styles.banner}>
        <span className={styles.division}>{division}세부</span>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.legend} aria-label="연구 추진 단계">
          <span className={styles.firstStage}>1단계</span>
          <span className={styles.secondStage}>2단계</span>
        </div>
      </div>
      <div className={styles.taskGrid}>
        {tasks.map(task => (
          <section key={task.code} className={styles.task} aria-labelledby={`research-${task.code}`}>
            <div className={styles.taskHeading}>
              <span className={styles.taskCode}>{task.code}</span>
              <h2 id={`research-${task.code}`} className={styles.taskTitle}>{task.title}</h2>
            </div>
            <div className={styles.stages}>
              {task.stages.map((stage, index) => (
                <div key={stage.title} className={`${styles.stage} ${index === 0 ? styles.stageOne : styles.stageTwo}`}>
                  <div className={styles.stageHeading}>
                    <span className={styles.stageLabel}>{index + 1}단계</span>
                    <h3 className={styles.stageTitle}>{stage.title}</h3>
                  </div>
                  <ResearchDiagram region={stage.image} alt={stage.alt} directory={diagramDirectory} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
