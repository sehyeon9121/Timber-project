import type { ParticipatingInstitution } from '@/types';

export interface Partnership {
  id: string;
  title: string;
  description: string;
  icon: string;
  institutions: ParticipatingInstitution[];
}

export const partnerships: Partnership[] = [
  {
    id: 'academic',
    title: '학술 공동 연구 기관',
    description:
      '본 연구는 대학과의 학술 공동 연구를 통해 초대형 목조 대공간 건축 기술의 연구 기반과 전문성을 강화합니다. 다양한 전공과 연구 역량을 연계하여 구조, 설계, 환경, 시공 분야를 아우르는 통합적 연구 협력 체계를 구축합니다.',
    icon: 'GraduationCap',
    institutions: [
      { name: '서울대학교', logo: 'logo-university1.png', url: 'https://www.snu.ac.kr' },
      { name: '연세대학교', logo: 'logo-university2.png', url: 'https://www.yonsei.ac.kr' },
      { name: '한양대학교', logo: 'logo-university3.png', url: 'https://www.hanyang.ac.kr' },
      { name: '부산대학교', logo: 'logo-university4.png', url: 'https://www.pusan.ac.kr' },
      { name: '서울시립대학교', logo: 'logo-university5.png', url: 'https://www.uos.ac.kr' },
      { name: '전북대학교', logo: 'logo-university6.png', url: 'https://www.jbnu.ac.kr' },
      { name: '전남대학교', logo: 'logo-university7.png', url: 'https://www.jnu.ac.kr' },
      { name: '숭실대학교', logo: 'logo-university8.jpg', url: 'https://ssu.ac.kr' },
      { name: '한밭대학교', logo: 'logo-university9.png', url: 'https://www.hanbat.ac.kr' },
    ],
  },
  {
    id: 'research',
    title: '연구·시험·실증 협력 기관',
    description:
      '본 연구는 국가 연구기관 및 전문 연구소와의 협력을 통해 초대형 목조 대공간 건축 기술에 대한 시험, 평가, 실증 기반을 강화합니다. 이를 통해 핵심 기술의 신뢰성과 공공적 활용 가능성을 확보하고, 국가 차원의 탄소중립 건설 기술 확산에 기여하고자 합니다.',
    icon: 'FlaskConical',
    institutions: [
      { name: '한국건설기술연구원', logo: 'logo-research1.png', url: 'https://www.kict.re.kr/' },
      {
        name: '국립산림과학원',
        logo: 'logo-research2.png',
        url: 'https://nifos.forest.go.kr/kfsweb/kfs/subIdx/Index.do?mn=UKFR',
      },
      {
        name: '한국건설생활환경시험연구원',
        logo: 'logo-research3.png',
        url: 'https://www.kcl.re.kr/site/main/index001.do',
      },
      { name: '한국강구조학회', logo: 'logo-research5.jpg', url: 'https://kssc.or.kr/home/' },
    ],
  },
  {
    id: 'industry',
    title: '산업 연계 및 기술 확산 파트너',
    description:
      '본 연구는 건설 및 엔지니어링 산업체와의 협력을 통해 초대형 목조 대공간 건축 기술의 현장 적용 가능성과 실현성을 검토합니다. 이를 바탕으로 설계·시공·사업화 단계까지 연계되는 협력 체계를 구축하여 연구 성과의 실질적인 활용과 기술 확산을 추진합니다.',
    icon: 'Factory',
    institutions: [
      { name: '포스코 이앤씨', logo: 'logo-institute1.png' },
      { name: '아리수 엔지니어링', logo: 'logo-institute2.jpg' },
      { name: '(주)하이멕', logo: 'logo-institute3.png' },
      { name: 'dA architecture group', logo: 'logo-institute4.jpg' },
      { name: '티아이구조기술사사무소', logo: 'logo-institute5.jpg' },
      { name: 'CS구조엔지니어링', logo: 'logo-institute6.png' },
    ],
  },
];
