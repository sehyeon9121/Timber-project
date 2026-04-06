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
    'nav.joinUs': 'ACT INSTITUTE',
    'nav.newsUpdates': 'News & Updates',
    'nav.climateSnacks': 'Climate Snacks',

    // Home Page - Hero
    'home.hero.subtitle': 'ACT INSTITUTE LAB | Korea University of Technology and Department of Architectural Engineering, KOREATECH',
    'home.hero.title': 'AI Carbon-Neutral Timber Research Institute',
    'home.hero.description': 'Acting for the Planet, Innovating Technology for Timber.',
    // Home Page - About
    'home.about.imageTitle': 'About ACT Lab',
    'home.about.title': ' Lab',
    'home.about.description': 'ACT Lab is a research institute exploring new possibilities for large-span timber structures through the integration of artificial intelligence and architectural engineering. By extending the inherent potential of timber through intelligent design and data-driven technologies, we aim to achieve both structural reliability and environmental responsibility. Moving beyond conceptual design studies, our research focuses on analysis and validation grounded in real-world building conditions, advancing carbon-neutral architecture from theory to a practical and viable choice.',
    'home.research.title': 'Research Topics',
    'home.research.subtitle': 'Research for the Future',
    'home.showcase.title': 'Our Vision',
    'home.showcase.subtitle': 'Building a sustainable future through timber innovation',
    'home.showcase.boxTitle': 'AI Carbon-Neutral Timber Research',
    'home.showcase.boxDesc': 'We pursue innovative research that combines artificial intelligence with timber engineering to realize carbon-neutral large-span architecture.',

    // Showcase Page
    'showcase.heroTitle': 'AI Carbon-Neutral Timber Research',
    'showcase.heroSubtitle': 'Building a sustainable future through timber innovation',
    'showcase.block1Title': 'AI-Driven Structural Design',
    'showcase.block1Desc': 'Leveraging artificial intelligence for next-generation timber structural design and optimization.',
    'showcase.block2Title': 'Carbon-Neutral Architecture',
    'showcase.block2Desc': 'Advancing carbon-neutral architecture from theory to practice through data-driven analysis.',
    'showcase.block3Title': 'Smart Construction Technologies',
    'showcase.block3Desc': 'Integrating smart technologies for efficient construction and long-term maintenance of timber buildings.',

    // Research Themes
    'research.terrestrialCarbon.title': 'AI-Based Design of Large-Span Timber Structures',
    'research.terrestrialCarbon.description': 'Through AI- and data-driven design approaches, we extend the structural limits of large-span timber systems. By integrally analyzing load transfer mechanisms, material efficiency, and geometric optimization, our research advances next-generation timber structural design methods that enhance both stability and performance.',
    'research.naturalClimate.title': 'Technologies for Realizing Carbon-Neutral Architecture',
    'research.naturalClimate.description': 'We quantitatively analyze the carbon reduction potential of timber construction and evaluate carbon-neutral performance across the entire building lifecycle, including design, construction, and operation. Through AI-based analysis and simulation, we present implementable technologies that enable carbon-neutral architecture in real-world applications.',
    'research.smartConstruction.title': 'Smart Construction & Maintenance Technologies',
    'research.smartConstruction.description': 'We develop smart construction and maintenance technologies for large-span timber buildings by integrating IoT sensing, digital twin modeling, and AI-based predictive maintenance to ensure long-term structural safety and operational efficiency.',
    'research.energyPerformance.title': 'Environmental & Energy Performance Evaluation',
    'research.energyPerformance.description': 'We evaluate the environmental and energy performance of large-span timber buildings through lifecycle assessment and simulation technologies, developing standards and methodologies for green building certification and energy optimization.',

    // Research Detail Pages (상세 페이지 전용)
    'researchDetail.terrestrialCarbon.title': 'AI-Based Design of Large-Span Timber Structures',
    'researchDetail.terrestrialCarbon.description': 'Through AI- and data-driven design approaches, we extend the structural limits of large-span timber systems.',
    'researchDetail.naturalClimate.title': 'Technologies for Realizing Carbon-Neutral Architecture',
    'researchDetail.naturalClimate.description': 'We quantitatively analyze the carbon reduction potential of timber construction and evaluate carbon-neutral performance across the entire building lifecycle.',
    'researchDetail.smartConstruction.title': 'Smart Construction & Maintenance Technologies',
    'researchDetail.smartConstruction.description': 'We develop smart construction and maintenance technologies for large-span timber buildings.',
    'researchDetail.energyPerformance.title': 'Environmental & Energy Performance Evaluation',
    'researchDetail.energyPerformance.description': 'We evaluate the environmental and energy performance of large-span timber buildings.',

    // Research Page
    'research.title': 'Research',
    'research.subtitle': 'Our research focuses on understanding how terrestrial ecosystems respond to global change',
    'research.intro': 'The Terrer Lab advances knowledge about the ecological dynamics impacting terrestrial carbon storage in a climate change context. We combine experimental data synthesis with modeling approaches to reduce key uncertainties about the terrestrial carbon sink.',
    'research.themesTitle': 'Research Themes',
    'research.bigQuestionsTitle': 'Big Questions',
    'research.bigQuestionsSubtitle': 'The fundamental questions driving our research',

    // Big Questions Page
    'bigQuestions.title': 'Research Projects',
    'bigQuestions.subtitle': 'Structure of research projects within a national government–funded research program.',
    'bigQuestions.intro': 'Our research is driven by fundamental questions regarding the feasibility of 200-meter-class large-span timber buildings and the future of carbon-neutral construction technologies. These questions define an integrated research direction encompassing structural systems, modular design, environmental and energy performance, as well as construction and maintenance technologies.',
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
    'team.title': 'Introducing ACT Lab',
    'team.team': 'Team',
    'team.alumni': 'Undergraduate Student',

    // Join Us Page
    'joinUs.title': 'Join Us',
    'joinUs.subtitle': 'ACT LAB',
    'joinUs.values': 'VALUES',
    'joinUs.valuesIntro': 'In science, inclusion begins with inclusion in the research environment.',
    'joinUs.valuesDescription': 'At ACT Institute, research begins with mindset before it becomes technology. The challenges of climate change and carbon neutrality cannot be addressed through a single solution, and we believe that diverse perspectives and backgrounds are essential resources for solving structural problems. Through collaboration that transcends disciplinary boundaries, roles, and levels of experience, ACT Institute explores new possibilities for large-span timber structures.',
    'joinUs.belonging1': 'We value problems over affiliations and questions over titles.',
    'joinUs.belonging2': 'ACT Institute fosters an open research environment where diverse',
    'joinUs.belonging3': 'expertise and perspectives are respected.',

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
    'nav.joinUs': 'ACT INSTITUTE',
    'nav.newsUpdates': '뉴스 및 업데이트',
    'nav.climateSnacks': '기후 스낵',

    // Home Page - Hero
    'home.hero.subtitle': 'Development of 200m-scale Wooden Large Space Structure Building Technology',
    'home.hero.title': '200m급 목구조 대공간 건축물 건설 기술개발 연구단',
    'home.hero.description': '200m Span ㅣ 50% Carbon Reduction ㅣ 4 Core Technologies',
    // Home Page - About
    'home.about.imageTitle': 'Project Overview',
    'home.about.title': 'Hi - Wood',
    'home.about.description': '본 연구는 목조 구조를 기반으로 대공간 건축 기술을 고도화하고, 설계·시공·운영 전 과정을 통합하여 탄소중립 건축 실현을 목표로 합니다.',
    'home.research.title': '연구 주제',
    'home.research.subtitle': '미래를 위한 연구',
    'home.showcase.title': '우리의 비전',
    'home.showcase.subtitle': '목재 혁신을 통한 지속 가능한 미래 건설',
    'home.showcase.boxTitle': 'AI 탄소중립 목조 건축 연구',
    'home.showcase.boxDesc': '인공지능과 목조 공학을 결합하여 탄소중립 대공간 건축물을 실현하는 혁신적 연구를 추구합니다.',

    // Showcase Page
    'showcase.heroTitle': 'AI 탄소중립 목조 건축 연구',
    'showcase.heroSubtitle': '목재 혁신을 통한 지속 가능한 미래 건설',
    'showcase.block1Title': 'AI 기반 구조 설계',
    'showcase.block1Desc': '인공지능을 활용한 차세대 목조 구조 설계 및 최적화.',
    'showcase.block2Title': '탄소중립 건축',
    'showcase.block2Desc': '데이터 기반 분석을 통해 탄소중립 건축을 이론에서 실천으로.',
    'showcase.block3Title': '스마트 건설 기술',
    'showcase.block3Desc': '목조 건축물의 효율적인 시공 및 장기 유지관리를 위한 스마트 기술 통합.',

    // Research Themes
    'research.terrestrialCarbon.title': '200m급 대공간 구조',
    'research.terrestrialCarbon.description': '국내 최초 초대형 목조 구조 실현',
    'research.naturalClimate.title': '4대 핵심 기술',
    'research.naturalClimate.description': '구조 · 설계 · 시공 · 운영 통합 기술',
    'research.smartConstruction.title': '기간 2026 ~ 2029',
    'research.smartConstruction.description': '단계별 기술 개발 및 실증 수행',
    'research.energyPerformance.title': '탄소중립 건축',
    'research.energyPerformance.description': '건설 분야 탄소 배출 저감',

    // Research Detail Pages (상세 페이지 전용)
    'researchDetail.terrestrialCarbon.title': 'AI 기반 대공간 목구조 설계',
    'researchDetail.terrestrialCarbon.description': 'AI와 데이터 기반 설계를 통해 대공간 목구조의 구조적 한계를 확장합니다.',
    'researchDetail.naturalClimate.title': '탄소중립 건축 실현 기술',
    'researchDetail.naturalClimate.description': '목재 건축의 탄소 저감 효과를 정량적으로 분석하고 검증합니다.',
    'researchDetail.smartConstruction.title': '스마트 시공 및 유지관리 기술',
    'researchDetail.smartConstruction.description': '목조 대공간 건축물의 스마트 시공·유지관리 기술을 개발합니다.',
    'researchDetail.energyPerformance.title': '친환경·에너지 성능 평가 기술',
    'researchDetail.energyPerformance.description': '목조 대공간 건축물의 환경·에너지 성능을 평가합니다.',

    // Research Page
    'research.title': '연구',
    'research.subtitle': '육상 생태계가 전지구적 변화에 어떻게 반응하는지 이해하는 연구를 수행합니다',
    'research.intro': 'Terrer Lab은 기후 변화 맥락에서 육상 탄소 저장에 영향을 미치는 생태학적 역학에 대한 지식을 발전시킵니다. 실험 데이터 종합과 모델링 접근법을 결합하여 육상 탄소 흡수원에 대한 주요 불확실성을 줄입니다.',
    'research.themesTitle': '연구 주제',
    'research.bigQuestionsTitle': '큰 질문들',
    'research.bigQuestionsSubtitle': '우리 연구를 이끄는 근본적인 질문들',

    // Big Questions Page
    'bigQuestions.title': '연구 과제',
    'bigQuestions.subtitle': '국책 연구과제에서의 연구 과제 구성.',
    'bigQuestions.intro': '우리의 연구는 200m급 목조 대공간 건축물의 실현 가능성과 탄소중립 건설 기술의 미래라는 근본적인 질문에 의해 이끌립니다. 이러한 질문들은 구조 시스템, 모듈화 설계, 환경·에너지 성능, 그리고 시공 및 유지관리 기술에 대한 통합적인 연구 방향을 제시합니다.',
    'bigQuestions.backTo': 'ACT LAB으로 돌아가기',

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
    'team.alumni': '학부생',

    // Join Us Page
    'joinUs.title': 'ACT INSTITUTE',
    'joinUs.subtitle': 'ACT Labd의 태도',
    'joinUs.values': '가치',
    'joinUs.valuesIntro': '과학에서의 포용은 연구실에서의 포용에서 시작됩니다.',
    'joinUs.valuesDescription': 'ACT Institute의 연구는 구조 기술 이전에 태도에서 시작됩니다. 기후 위기와 탄소 중립이라는 과제는 단일한 해법으로 해결될 수 없으며, 우리는 다양한 관점과 배경이 구조적 문제 해결의 핵심 자원이라고 믿습니다. ACT Institute는 전공, 역할, 경험의 경계를 넘는 협업을 통해 목구조 대공간 기술의 새로운 가능성을 탐구합니다.',

    'joinUs.belonging1': '우리는 소속보다 문제를, 직함보다 질문을 중요하게 여깁니다.',
    'joinUs.belonging2': 'ACT Institute는 열린 연구 환경 속에서',
    'joinUs.belonging3': '각자의 전문성과 관점이 존중받는 공간을 지향합니다.',

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
    'footer.copyright': '© 2024 ACT Lab. All rights reserved.',
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
