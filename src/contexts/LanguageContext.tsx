import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'EN' | 'KO';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Navigation
    'nav.home': 'Home',
    'nav.research': 'Research',
    'nav.publications': 'Publications',
    'nav.people': 'People',
    'nav.news': 'News',
    'nav.ourTeam': 'Our Team',
    'nav.joinUs': 'Join Us',
    'nav.newsUpdates': 'News & Updates',
    'nav.climateSnacks': 'Climate Snacks',

    // Home Page - Hero
    'home.hero.subtitle': 'ACT INSTITUTE LAB | Korea University of Technology and Department of Architectural Engineering, KOREATECH',
    'home.hero.title': 'AI Carbon-Neutral Timber Research Institute',
    'home.hero.description': 'Acting for the Planet, Innovating Technology for Timber.',
    // Home Page - About
    'home.about.title': ' Lab',
    'home.about.description': 'The focus of the Terrer Lab is terrestrial ecosystem ecology. We study how climate change and anthropogenic activities affect ecosystems, and, conversely, how ecosystem dynamics modulate climate change. We synthesize large datasets of field observations and remote sensing data using meta-analysis, machine learning, and other statistical methods to better understand the global functioning of terrestrial ecosystems.',
    'home.research.title': 'Research Themes',
    'home.research.subtitle': 'OUR INTERSECTED STUDIES',
    'home.bigQuestions.title': 'Our Big Questions',
    'home.bigQuestions.subtitle': 'RESEARCH INTERESTS',
    'home.bigQuestions.q1': 'How much carbon can we recapture in soils with cropland restoration?',
    'home.bigQuestions.q2': 'What are the feedbacks that link biodiversity and carbon storage?',
    'home.bigQuestions.q3': 'How much nitrogen can plants absorb from the soil yearly?',
    'home.bigQuestions.q4': 'Has climate change helped sequestering soil carbon?',
    'home.bigQuestions.q5': 'How do changes in vegetation dynamics affect biophysical properties in terrestrial ecosystems?',
    'home.bigQuestions.q6': 'How do the increasing extreme storms affect the terrestrial carbon cycle?',
    'home.bigQuestions.q7': 'What is the impact of nutrient limitation on the terrestrial carbon sink?',
    'home.bigQuestions.q8': 'What is the contribution of peatlands to the global carbon cycle?',

    // Research Themes
    'research.terrestrialCarbon.title': 'Terrestrial Carbon Ecology',
    'research.terrestrialCarbon.description': 'We advance knowledge about the ecological dynamics impacting terrestrial carbon storage in a climate change context (e.g., elevated CO₂, warming, fire, extreme weather, nitrogen deposition). The primary goals are to unravel the mechanisms of the terrestrial carbon sink, and to reduce key uncertainties about the sink in climate models.',
    'research.naturalClimate.title': 'Natural Climate Solutions',
    'research.naturalClimate.description': 'We develop data-driven estimates of the mitigation potential of natural climate solutions. By synthesizing data collected by satellites and from published field studies, we seek to reduce spatial and temporal uncertainties about the effectiveness of soil- and forest-based pathways.',

    // Research Page
    'research.title': 'Research',
    'research.subtitle': 'Our research focuses on understanding how terrestrial ecosystems respond to global change',
    'research.intro': 'The Terrer Lab advances knowledge about the ecological dynamics impacting terrestrial carbon storage in a climate change context. We combine experimental data synthesis with modeling approaches to reduce key uncertainties about the terrestrial carbon sink.',
    'research.themesTitle': 'Research Themes',
    'research.bigQuestionsTitle': 'Big Questions',
    'research.bigQuestionsSubtitle': 'The fundamental questions driving our research',

    // Big Questions Page
    'bigQuestions.title': 'Big Questions',
    'bigQuestions.subtitle': 'The fundamental questions driving our research into terrestrial carbon dynamics.',
    'bigQuestions.intro': 'Our research is driven by fundamental questions about how terrestrial ecosystems function and respond to global change. These "big questions" guide our investigations into carbon storage, nutrient cycling, and climate feedbacks.',
    'bigQuestions.backTo': 'Back to Big Questions',

    // Publications Page
    'publications.title': 'Publications',
    'publications.subtitle': 'Explore our published research and scientific contributions',

    // People Page
    'people.title': 'Lab Members',
    'people.subtitle': 'Meet our team of researchers and students',
    'people.principalInvestigator': 'Principal Investigator',
    'people.phdStudents': 'PhD Students',
    'people.masterStudents': 'Master Students',
    'people.researchAssistants': 'Research Assistants',

    // Team Page
    'team.title': 'Meet the Terrer Lab',
    'team.team': 'Team',
    'team.alumni': 'Alumni',

    // Join Us Page
    'joinUs.title': 'Join Us',
    'joinUs.subtitle': 'Be a part of the Terrer Lab at MIT',
    'joinUs.values': 'VALUES',
    'joinUs.valuesIntro': 'Inclusion in science starts by inclusion in the lab.',
    'joinUs.valuesDescription': 'Climate change is a global challenge, but its impacts and solutions are different around the world. We believe diversity is a key factor to provide solutions to tackle this challenge worldwide. Thus, the Terrer Lab embrace diversity as a necessity and an advantage for our common goal.',
    'joinUs.belonging1': 'We strive to foster belonging and empowerment.',
    'joinUs.belonging2': 'We value the visible and invisible qualities that make you who you are.',
    'joinUs.belonging3': 'We listen and engage with our diverse communities.',

    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with the Terrer Lab team.',
    'contact.address': 'Address',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.followUs': 'Follow Us',
    'contact.ourLocation': 'Our Location',
    'contact.joinTeam': 'Join Our Team',
    'contact.joinTeamDescription': 'We are always looking for talented researchers passionate about understanding terrestrial carbon dynamics and natural climate solutions.',
    'contact.contactOpportunities': 'Contact Us About Opportunities',

    // News Page
    'news.title': 'News',
    'news.subtitle': 'Take a look at the latest updates from the Terrer Lab',
    'news.latestNews': 'Latest News',

    // Climate Snacks Page
    'climateSnacks.title': 'Climate Snacks',
    'climateSnacks.subtitle': 'Climate Snacks are accessible conversations about climate change',
    'climateSnacks.description': 'Our goal is to attract a wide audience, including curious non-academics, academics from other disciplines, and specialists. You can see the previous sessions recordings here:',

    // Common
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.backToTop': 'Back to Top',

    // Language
    'language.english': 'English',
    'language.korean': 'Korean',

    // Footer
    'footer.copyright': '© 2024 Terrer Lab. All rights reserved.',
    'footer.contact': 'Contact',
    'footer.location': 'Location',
  },
  KO: {
    // Navigation
    'nav.home': '홈',
    'nav.research': '연구',
    'nav.publications': '출판물',
    'nav.people': '구성원',
    'nav.news': '뉴스',
    'nav.ourTeam': '연구팀',
    'nav.joinUs': '참여하기',
    'nav.newsUpdates': '뉴스 및 업데이트',
    'nav.climateSnacks': '기후 스낵',

    // Home Page - Hero
    'home.hero.subtitle': 'ACT INSITUTE LAB | 한국기술교육대학교 건축공학과',
    'home.hero.title': 'AI 탄소중립 목조 연구소',
    'home.hero.description': '지구를 위해 행동하고, 목재를 위해 기술을 혁신하다.',
    // Home Page - About
    'home.about.title': 'ACT Lab',
    'home.about.description': 'ACT Lab은 AI와 건축 공학의 결합을 통해 대공간 목구조의 새로운 가능성을 탐구하는 연구소입니다. 우리는 목재라는 재료가 지닌 잠재력을 지능형 설계와 데이터 기반 기술로 확장하여, 구조적 안정성과 환경적 책임을 동시에 달성하고자 합니다. 설계검토에 그치지 않고 실제 건축 환경을 고려한 분석과 검증을 통해, 탄소중립 건축이 이론이 아닌 현실적인 선택이 될 수 있도록 연구를 이어가고 있습니다.',
    'home.research.title': '연구 주제',
    'home.research.subtitle': '미래를 위한 연구',
    'home.bigQuestions.title': '우리의 큰 질문들',
    'home.bigQuestions.subtitle': '연구 관심사',
    'home.bigQuestions.q1': '농경지 복원을 통해 토양에서 얼마나 많은 탄소를 재포집할 수 있을까?',
    'home.bigQuestions.q2': '생물다양성과 탄소 저장을 연결하는 피드백은 무엇인가?',
    'home.bigQuestions.q3': '식물이 토양에서 매년 얼마나 많은 질소를 흡수할 수 있을까?',
    'home.bigQuestions.q4': '기후 변화가 토양 탄소 격리에 도움이 되었을까?',
    'home.bigQuestions.q5': '식생 역학의 변화가 육상 생태계의 생물물리학적 특성에 어떤 영향을 미치는가?',
    'home.bigQuestions.q6': '증가하는 극한 폭풍이 육상 탄소 순환에 어떤 영향을 미치는가?',
    'home.bigQuestions.q7': '영양분 제한이 육상 탄소 흡수원에 미치는 영향은 무엇인가?',
    'home.bigQuestions.q8': '이탄지가 전지구적 탄소 순환에 기여하는 바는 무엇인가?',

    // Research Themes
    'research.terrestrialCarbon.title': 'AI 기반 대공간 목구조 설계',
    'research.terrestrialCarbon.description': 'AI와 데이터 기반 설계를 통해 대공간 목구조의 구조적 한계를 확장합니다. 하중 전달, 재료 효율, 형상 최적화를 통합적으로 분석하여 안정성과 성능을 동시에 만족하는 차세대 목조 대공간 설계 해법을 연구합니다.',
    'research.naturalClimate.title': '탄소중립 건축 실현 기술',
    'research.naturalClimate.description': '목재 건축의 탄소 저감 효과를 정량적으로 분석하고, 설계·시공·운영 전 과정에서 탄소중립 성능을 검증합니다. AI 기반 분석과 시뮬레이션을 통해 실현 가능한 탄소중립 건축 기술을 제시합니다. ',

    // Research Page
    'research.title': '연구',
    'research.subtitle': '육상 생태계가 전지구적 변화에 어떻게 반응하는지 이해하는 연구를 수행합니다',
    'research.intro': 'Terrer Lab은 기후 변화 맥락에서 육상 탄소 저장에 영향을 미치는 생태학적 역학에 대한 지식을 발전시킵니다. 실험 데이터 종합과 모델링 접근법을 결합하여 육상 탄소 흡수원에 대한 주요 불확실성을 줄입니다.',
    'research.themesTitle': '연구 주제',
    'research.bigQuestionsTitle': '큰 질문들',
    'research.bigQuestionsSubtitle': '우리 연구를 이끄는 근본적인 질문들',

    // Big Questions Page
    'bigQuestions.title': '큰 질문들',
    'bigQuestions.subtitle': '육상 탄소 역학에 대한 연구를 이끄는 근본적인 질문들.',
    'bigQuestions.intro': '우리의 연구는 육상 생태계가 어떻게 기능하고 전지구적 변화에 어떻게 반응하는지에 대한 근본적인 질문에 의해 이끌립니다. 이러한 "큰 질문들"은 탄소 저장, 영양분 순환, 기후 피드백에 대한 우리의 조사를 안내합니다.',
    'bigQuestions.backTo': '큰 질문들로 돌아가기',

    // Publications Page
    'publications.title': '출판물',
    'publications.subtitle': '출판된 연구 성과와 학술적 기여를 확인하세요',

    // People Page
    'people.title': '연구실 구성원',
    'people.subtitle': '연구원과 학생들을 소개합니다',
    'people.principalInvestigator': '책임 연구원',
    'people.phdStudents': '박사과정',
    'people.masterStudents': '석사과정',
    'people.researchAssistants': '연구 조교',

    // Team Page
    'team.title': 'ACT LAB을 소개합니다',
    'team.team': '팀',
    'team.alumni': '협력기관',

    // Join Us Page
    'joinUs.title': '참여하기',
    'joinUs.subtitle': 'MIT Terrer Lab의 일원이 되세요',
    'joinUs.values': '가치',
    'joinUs.valuesIntro': '과학에서의 포용은 연구실에서의 포용에서 시작됩니다.',
    'joinUs.valuesDescription': '기후 변화는 전 세계적인 도전이지만, 그 영향과 해결책은 전 세계적으로 다릅니다. 우리는 다양성이 이 도전에 전 세계적으로 대응하기 위한 해결책을 제공하는 핵심 요소라고 믿습니다. 따라서 Terrer Lab은 다양성을 공동 목표를 위한 필수 요소이자 이점으로 받아들입니다.',
    'joinUs.belonging1': '우리는 소속감과 역량 강화를 촉진하기 위해 노력합니다.',
    'joinUs.belonging2': '우리는 당신을 당신답게 만드는 보이는 것과 보이지 않는 특성을 소중히 여깁니다.',
    'joinUs.belonging3': '우리는 다양한 커뮤니티의 이야기를 듣고 함께합니다.',

    // Contact Page
    'contact.title': '연락처',
    'contact.subtitle': 'Terrer Lab 팀에 연락하세요.',
    'contact.address': '주소',
    'contact.email': '이메일',
    'contact.phone': '전화',
    'contact.followUs': '팔로우하기',
    'contact.ourLocation': '위치',
    'contact.joinTeam': '팀에 합류하세요',
    'contact.joinTeamDescription': '육상 탄소 역학과 자연 기후 솔루션을 이해하는 데 열정적인 재능 있는 연구원을 항상 찾고 있습니다.',
    'contact.contactOpportunities': '기회에 대해 문의하기',

    // News Page
    'news.title': '뉴스',
    'news.subtitle': 'Terrer Lab의 최신 소식을 확인하세요',
    'news.latestNews': '최신 뉴스',

    // Climate Snacks Page
    'climateSnacks.title': '기후 스낵',
    'climateSnacks.subtitle': '기후 스낵은 기후 변화에 대한 접근하기 쉬운 대화입니다',
    'climateSnacks.description': '우리의 목표는 호기심 많은 비전문가, 다른 분야의 학자, 전문가를 포함한 폭넓은 청중을 끌어들이는 것입니다. 이전 세션 녹화본은 여기에서 볼 수 있습니다:',

    // Common
    'common.readMore': '더 보기',
    'common.viewAll': '전체 보기',
    'common.backToTop': '맨 위로',

    // Language
    'language.english': '영어',
    'language.korean': '한국어',

    // Footer
    'footer.copyright': '© 2024 Terrer Lab. All rights reserved.',
    'footer.contact': '연락처',
    'footer.location': '위치',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // localStorage에서 저장된 언어 불러오기
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved === 'EN' || saved === 'KO') {
        return saved;
      }
    }
    return 'EN';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
