import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './GreetingPage.module.css';

// Replace these temporary paragraphs when the official greeting is ready.
const greeting = {
  KO: [
    '안녕하십니까. 연구단장 이승재입니다. 우리 연구단 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.',
    '우리 연구단은 200m급 초대형 목구조 대공간 건축 기술 개발을 통해 지속 가능한 건축의 새로운 가능성을 열어가고자 합니다. 목재의 가치를 바탕으로 설계, 구조, 시공 및 유지관리 기술을 연결하며 미래 건축을 위한 연구에 힘쓰고 있습니다.',
    '이를 위해 대학, 연구기관, 산업계의 전문가들이 함께 지혜를 모으고 있습니다. 긴밀한 협력과 꾸준한 도전을 통해 연구성과가 실제 건축 현장으로 이어질 수 있도록 최선을 다하겠습니다.',
    '앞으로도 우리 연구단의 활동에 많은 관심과 응원을 부탁드립니다. 여러분과 함께 더 나은 건축의 미래를 만들어가겠습니다. 감사합니다.',
  ],
  EN: [
    'Welcome to our research group. I am Seungjae Lee, the research director, and I am delighted to welcome you to our website.',
    'Our research group explores new possibilities for sustainable architecture through the development of 200m-class large-span timber structures. We bring together design, structural engineering, construction, and maintenance to advance timber architecture.',
    'Experts from universities, research institutions, and industry work together toward this goal. Through close collaboration and continued research, we aim to bring our findings into real construction practice.',
    'Thank you for your interest and support. We look forward to building a better future for architecture together.',
  ],
};

export function GreetingPage() {
  const { language } = useLanguage();
  const ko = language === 'KO';

  return (
    <DetailPageLayout title={ko ? '단장 인사말' : 'Director’s Message'} noHeroImage heroMaxHeight={144}>
      <section className={styles.greeting} aria-labelledby="director-name">
        <header className={styles.profile}>
          <h2 id="director-name" className={styles.name}>
            {ko ? '연구 단장 이승재' : 'Research Director Seungjae Lee'}
          </h2>
          <p className={styles.affiliation}>
            {ko ? '소속 한국기술교육대학교 정교수' : 'Professor, Korea University of Technology and Education'}
          </p>
        </header>
        <div className={styles.content}>
          <div className={styles.message}>
            {greeting[language].map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <img
            className={styles.portrait}
            src={`${import.meta.env.BASE_URL}images/leeseunglab/director-greeting.jpg`}
            alt={ko ? '연구 단장 이승재' : 'Research Director Seungjae Lee'}
            width={765}
            height={1024}
          />
        </div>
      </section>
    </DetailPageLayout>
  );
}
