# Terrer Lab Website Clone - Implementation Plan

## Overview

**Target**: https://www.terrerlab.com/
**Tech Stack**: React 19 + TypeScript + Vite
**Architecture**: Atomic Design (Extreme Componentization)

---

## Phase 1: Project Setup & Core Infrastructure

### 1.1 Dependencies Installation
```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install framer-motion          # Animations
npm install lucide-react           # Icons
```

### 1.2 Project Structure (Atomic Design)
```
src/
├── components/
│   ├── atoms/                     # 원자 컴포넌트 (가장 작은 단위)
│   │   ├── Text/
│   │   │   ├── Text.tsx
│   │   │   ├── Text.styles.ts
│   │   │   └── index.ts
│   │   ├── Heading/
│   │   │   ├── Heading.tsx        # h1~h6 래퍼
│   │   │   ├── Heading.styles.ts
│   │   │   └── index.ts
│   │   ├── Paragraph/
│   │   │   ├── Paragraph.tsx
│   │   │   └── index.ts
│   │   ├── Span/
│   │   │   ├── Span.tsx
│   │   │   └── index.ts
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   ├── Icon/
│   │   │   ├── Icon.tsx           # 모든 아이콘 래퍼
│   │   │   └── index.ts
│   │   ├── Image/
│   │   │   ├── Image.tsx          # img 래퍼 (lazy loading 포함)
│   │   │   └── index.ts
│   │   ├── Link/
│   │   │   ├── Link.tsx           # a 태그 래퍼
│   │   │   ├── Link.styles.ts
│   │   │   └── index.ts
│   │   ├── Divider/
│   │   │   ├── Divider.tsx        # 구분선
│   │   │   └── index.ts
│   │   ├── Spacer/
│   │   │   ├── Spacer.tsx         # 여백
│   │   │   └── index.ts
│   │   ├── Container/
│   │   │   ├── Container.tsx      # 컨테이너 래퍼
│   │   │   └── index.ts
│   │   ├── Overlay/
│   │   │   ├── Overlay.tsx        # 오버레이 (gradient 등)
│   │   │   └── index.ts
│   │   └── BackgroundImage/
│   │       ├── BackgroundImage.tsx
│   │       └── index.ts
│   │
│   ├── molecules/                 # 분자 컴포넌트 (원자 조합)
│   │   ├── IconText/
│   │   │   ├── IconText.tsx       # Icon + Text
│   │   │   └── index.ts
│   │   ├── NavLink/
│   │   │   ├── NavLink.tsx        # Link + Text (네비게이션용)
│   │   │   └── index.ts
│   │   ├── DropdownMenu/
│   │   │   ├── DropdownMenu.tsx   # Button + Link 리스트
│   │   │   └── index.ts
│   │   ├── LogoImage/
│   │   │   ├── LogoImage.tsx      # Link + Image (로고)
│   │   │   └── index.ts
│   │   ├── SocialIcon/
│   │   │   ├── SocialIcon.tsx     # Link + Icon (소셜 링크)
│   │   │   └── index.ts
│   │   ├── MenuButton/
│   │   │   ├── MenuButton.tsx     # Button + Icon (햄버거 메뉴)
│   │   │   └── index.ts
│   │   ├── SectionTitle/
│   │   │   ├── SectionTitle.tsx   # Icon + Span + Heading + Icon
│   │   │   └── index.ts
│   │   ├── ProfileImage/
│   │   │   ├── ProfileImage.tsx   # Image + Container (프로필 사진)
│   │   │   └── index.ts
│   │   ├── QuoteBlock/
│   │   │   ├── QuoteBlock.tsx     # blockquote 래퍼
│   │   │   └── index.ts
│   │   ├── BulletList/
│   │   │   ├── BulletList.tsx     # ul/li 래퍼
│   │   │   └── index.ts
│   │   ├── ScrollIndicator/
│   │   │   ├── ScrollIndicator.tsx # Link + Icon (스크롤 화살표)
│   │   │   └── index.ts
│   │   └── CopyrightText/
│   │       ├── CopyrightText.tsx  # Text + Link 조합
│   │       └── index.ts
│   │
│   ├── organisms/                 # 유기체 컴포넌트 (분자 조합)
│   │   ├── NavigationBar/
│   │   │   ├── NavigationBar.tsx  # LogoImage + NavLink[] + DropdownMenu[]
│   │   │   ├── NavigationBar.styles.ts
│   │   │   └── index.ts
│   │   ├── MobileNavigation/
│   │   │   ├── MobileNavigation.tsx # MenuButton + NavLink[]
│   │   │   └── index.ts
│   │   ├── HeroContent/
│   │   │   ├── HeroContent.tsx    # Span + Heading + Paragraph + ScrollIndicator
│   │   │   └── index.ts
│   │   ├── AboutContent/
│   │   │   ├── AboutContent.tsx   # ProfileImage + Heading + Paragraph
│   │   │   └── index.ts
│   │   ├── ResearchThemeCard/
│   │   │   ├── ResearchThemeCard.tsx # Link + Heading + Paragraph
│   │   │   └── index.ts
│   │   ├── BigQuestionCard/
│   │   │   ├── BigQuestionCard.tsx # Link + Icon + Paragraph
│   │   │   └── index.ts
│   │   ├── AffiliationLogo/
│   │   │   ├── AffiliationLogo.tsx # LogoImage (외부 링크)
│   │   │   └── index.ts
│   │   ├── TeamMemberCard/
│   │   │   ├── TeamMemberCard.tsx # ProfileImage + Heading + Paragraph + SocialIcon[]
│   │   │   └── index.ts
│   │   ├── AlumniCard/
│   │   │   ├── AlumniCard.tsx     # ProfileImage + Heading (축소 버전)
│   │   │   └── index.ts
│   │   ├── PublicationItem/
│   │   │   ├── PublicationItem.tsx # Text + Link 조합
│   │   │   └── index.ts
│   │   ├── NewsItem/
│   │   │   ├── NewsItem.tsx       # Span + Heading + Paragraph
│   │   │   └── index.ts
│   │   ├── FooterContent/
│   │   │   ├── FooterContent.tsx  # CopyrightText + Link
│   │   │   └── index.ts
│   │   └── BigQuestionContent/
│   │       ├── BigQuestionContent.tsx # Heading + Paragraph + QuoteBlock + BulletList
│   │       └── index.ts
│   │
│   ├── templates/                 # 템플릿 컴포넌트 (페이지 레이아웃)
│   │   ├── PageLayout/
│   │   │   ├── PageLayout.tsx     # NavigationBar + children + FooterContent
│   │   │   └── index.ts
│   │   ├── HeroSection/
│   │   │   ├── HeroSection.tsx    # BackgroundImage + Overlay + HeroContent
│   │   │   └── index.ts
│   │   ├── ContentSection/
│   │   │   ├── ContentSection.tsx # Container + SectionTitle + children
│   │   │   └── index.ts
│   │   ├── GridSection/
│   │   │   ├── GridSection.tsx    # Container + Grid layout
│   │   │   └── index.ts
│   │   ├── TwoColumnSection/
│   │   │   ├── TwoColumnSection.tsx # Container + 2열 레이아웃
│   │   │   └── index.ts
│   │   └── DetailPageLayout/
│   │       ├── DetailPageLayout.tsx # Container + Heading + Content
│   │       └── index.ts
│   │
│   └── pages/                     # 페이지 컴포넌트 (최종 조합)
│       ├── HomePage/
│       │   ├── HomePage.tsx
│       │   └── index.ts
│       ├── PublicationsPage/
│       │   ├── PublicationsPage.tsx
│       │   └── index.ts
│       ├── PeoplePage/
│       │   ├── PeoplePage.tsx
│       │   └── index.ts
│       ├── JoinUsPage/
│       │   ├── JoinUsPage.tsx
│       │   └── index.ts
│       ├── NewsPage/
│       │   ├── NewsPage.tsx
│       │   └── index.ts
│       ├── ClimateSnacksPage/
│       │   ├── ClimateSnacksPage.tsx
│       │   └── index.ts
│       ├── BlogPage/
│       │   ├── BlogPage.tsx
│       │   └── index.ts
│       └── BigQuestionPage/
│           ├── BigQuestionPage.tsx
│           └── index.ts
│
├── data/
│   ├── teamMembers.ts
│   ├── publications.ts
│   ├── bigQuestions.ts
│   └── news.ts
├── hooks/
│   ├── useScrollAnimation.ts
│   └── useMediaQuery.ts
├── utils/
│   └── cn.ts                      # className 유틸리티
├── types/
│   └── index.ts                   # 공통 타입 정의
├── styles/
│   └── index.css
├── App.tsx
└── main.tsx
```

---

## Phase 2: Atoms (원자 컴포넌트)

### 2.1 Text Atoms
| Component | Props | Description |
|-----------|-------|-------------|
| `Text` | `children, variant, color, weight, size` | 모든 텍스트 렌더링 |
| `Heading` | `level (1-6), children, variant` | h1~h6 래퍼 |
| `Paragraph` | `children, variant` | p 태그 래퍼 |
| `Span` | `children, variant` | span 래퍼 |

### 2.2 Interactive Atoms
| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `children, variant, onClick, disabled` | 버튼 |
| `Link` | `href, children, external, variant` | a 태그 래퍼 |
| `Icon` | `name, size, color` | lucide-react 아이콘 래퍼 |

### 2.3 Media Atoms
| Component | Props | Description |
|-----------|-------|-------------|
| `Image` | `src, alt, width, height, lazy` | img 래퍼 |
| `BackgroundImage` | `src, children, overlay` | 배경 이미지 컨테이너 |

### 2.4 Layout Atoms
| Component | Props | Description |
|-----------|-------|-------------|
| `Container` | `children, maxWidth, padding` | 컨테이너 |
| `Spacer` | `size (xs/sm/md/lg/xl)` | 여백 |
| `Divider` | `variant, thickness, color` | 구분선 |
| `Overlay` | `children, gradient, opacity` | 오버레이 |

---

## Phase 3: Molecules (분자 컴포넌트)

### 3.1 Navigation Molecules
| Component | Composition | Description |
|-----------|-------------|-------------|
| `NavLink` | `Link + Text` | 네비게이션 링크 |
| `DropdownMenu` | `Button + NavLink[]` | 드롭다운 메뉴 |
| `MenuButton` | `Button + Icon` | 햄버거 메뉴 버튼 |
| `LogoImage` | `Link + Image` | 클릭 가능한 로고 |

### 3.2 Content Molecules
| Component | Composition | Description |
|-----------|-------------|-------------|
| `IconText` | `Icon + Text` | 아이콘과 텍스트 |
| `SectionTitle` | `Icon + Span + Heading + Icon` | 섹션 제목 (장식 포함) |
| `ProfileImage` | `Image + Container` | 프로필 사진 |
| `SocialIcon` | `Link + Icon` | 소셜 링크 아이콘 |

### 3.3 Typography Molecules
| Component | Composition | Description |
|-----------|-------------|-------------|
| `QuoteBlock` | `Container + Paragraph` | 인용문 블록 |
| `BulletList` | `Container + Text[]` | 불릿 리스트 |
| `CopyrightText` | `Text + Link` | 저작권 텍스트 |

### 3.4 Interactive Molecules
| Component | Composition | Description |
|-----------|-------------|-------------|
| `ScrollIndicator` | `Link + Icon` | 스크롤 화살표 |

---

## Phase 4: Organisms (유기체 컴포넌트)

### 4.1 Layout Organisms
| Component | Composition | Description |
|-----------|-------------|-------------|
| `NavigationBar` | `LogoImage + NavLink[] + DropdownMenu[]` | 헤더 네비게이션 |
| `MobileNavigation` | `MenuButton + NavLink[]` | 모바일 네비게이션 |
| `FooterContent` | `CopyrightText + Link[]` | 푸터 컨텐츠 |

### 4.2 Hero Organisms
| Component | Composition | Description |
|-----------|-------------|-------------|
| `HeroContent` | `Span + Heading + Paragraph + ScrollIndicator` | 히어로 텍스트 |

### 4.3 Section Organisms
| Component | Composition | Description |
|-----------|-------------|-------------|
| `AboutContent` | `ProfileImage + Heading + Paragraph` | 소개 섹션 컨텐츠 |
| `ResearchThemeCard` | `Link + Heading + Paragraph` | 연구 테마 카드 |
| `BigQuestionCard` | `Link + Icon + Paragraph` | Big Question 카드 |
| `AffiliationLogo` | `LogoImage` | 제휴 로고 |

### 4.4 People Organisms
| Component | Composition | Description |
|-----------|-------------|-------------|
| `TeamMemberCard` | `ProfileImage + Heading + Paragraph + SocialIcon[]` | 팀원 카드 |
| `AlumniCard` | `ProfileImage + Heading` | 동문 카드 |

### 4.5 Content Organisms
| Component | Composition | Description |
|-----------|-------------|-------------|
| `PublicationItem` | `Text + Link` | 출판물 항목 |
| `NewsItem` | `Span + Heading + Paragraph` | 뉴스 항목 |
| `BigQuestionContent` | `Heading + Paragraph + QuoteBlock + BulletList` | Big Question 상세 |

---

## Phase 5: Templates (템플릿 컴포넌트)

| Template | Composition | Usage |
|----------|-------------|-------|
| `PageLayout` | `NavigationBar + children + FooterContent` | 모든 페이지 래퍼 |
| `HeroSection` | `BackgroundImage + Overlay + HeroContent` | 홈페이지 히어로 |
| `ContentSection` | `Container + SectionTitle + children` | 일반 섹션 |
| `GridSection` | `Container + Grid + children` | 그리드 레이아웃 섹션 |
| `TwoColumnSection` | `Container + 2열 레이아웃` | 2열 레이아웃 섹션 |
| `DetailPageLayout` | `Container + Heading + children` | 상세 페이지 |

---

## Phase 6: Pages (페이지 컴포넌트)

### HomePage 구성
```
PageLayout
├── HeroSection
│   ├── BackgroundImage (Earth/satellite)
│   ├── Overlay (gradient)
│   └── HeroContent
│       ├── Span ("TERRER LAB | Department...")
│       ├── Heading ("Ecological Understanding...")
│       ├── Paragraph ("We leverage field...")
│       └── ScrollIndicator
├── TwoColumnSection (About)
│   └── AboutContent
│       ├── ProfileImage
│       ├── Heading ("Terrer Lab")
│       └── Paragraph (description)
├── ContentSection (Research Themes)
│   ├── SectionTitle
│   │   ├── Icon (leaf)
│   │   ├── Span ("our INTERSECTED STUDIES")
│   │   ├── Heading ("Research Themes")
│   │   └── Icon (leaf)
│   └── GridSection
│       ├── ResearchThemeCard (Terrestrial Carbon)
│       └── ResearchThemeCard (Natural Climate)
├── ContentSection (Big Questions)
│   ├── SectionTitle
│   └── GridSection
│       └── BigQuestionCard[] (x8)
└── ContentSection (Affiliations)
    ├── SectionTitle
    └── GridSection
        ├── AffiliationLogo (MIT)
        └── AffiliationLogo (MIT CEE)
```

### PeoplePage 구성
```
PageLayout
├── Heading ("Meet the Terrer Lab")
├── ContentSection (Team)
│   ├── Heading ("Team")
│   └── GridSection
│       └── TeamMemberCard[] (x17)
└── ContentSection (Alumni)
    ├── Heading ("Alumni")
    └── GridSection
        └── AlumniCard[] (x9)
```

---

## Phase 7: Styling & Design System

### 7.1 Color Palette
```css
:root {
  --color-primary: #2B5329;       /* Dark green */
  --color-secondary: #F5A623;     /* Orange/gold */
  --color-accent: #4A90A4;        /* Teal accent */
  --color-text: #333333;
  --color-text-light: #666666;
  --color-bg: #FFFFFF;
  --color-bg-dark: #1A1A1A;
  --color-bg-section: #F8F8F8;
}
```

### 7.2 Spacing Scale (Spacer sizes)
```typescript
const spacerSizes = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};
```

### 7.3 Typography Scale
```typescript
const headingLevels = {
  h1: { size: '3rem', weight: 700 },
  h2: { size: '2rem', weight: 600 },
  h3: { size: '1.5rem', weight: 600 },
  h4: { size: '1.25rem', weight: 500 },
  h5: { size: '1.125rem', weight: 500 },
  h6: { size: '1rem', weight: 500 },
};
```

---

## Phase 8: Routing Configuration

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/pages/publications" element={<PublicationsPage />} />
  <Route path="/pages/people" element={<PeoplePage />} />
  <Route path="/pages/join-us" element={<JoinUsPage />} />
  <Route path="/pages/news" element={<NewsPage />} />
  <Route path="/pages/climate-snacks" element={<ClimateSnacksPage />} />
  <Route path="/pages/blog" element={<BlogPage />} />
  <Route path="/big-questions/:questionId" element={<BigQuestionPage />} />
</Routes>
```

---

## Phase 9: Data Structures

### 9.1 Team Member
```typescript
interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  scholarUrl?: string;
  email: string;
  type: 'team' | 'alumni';
}
```

### 9.2 Big Question
```typescript
interface BigQuestion {
  id: number;
  question: string;
  content: string[];
  highlights: string[];
  bulletPoints: string[];
  icon: string;
}
```

### 9.3 Publication
```typescript
interface Publication {
  id: string;
  year: number;
  authors: string;
  title: string;
  journal: string;
  doiUrl?: string;
}
```

---

## Implementation Order

| Order | Task | Components | Complexity |
|-------|------|------------|------------|
| 1 | Dependencies & Tailwind setup | - | Low |
| 2 | Atoms: Text, Heading, Paragraph, Span | 4 | Low |
| 3 | Atoms: Button, Link, Icon | 3 | Low |
| 4 | Atoms: Image, BackgroundImage | 2 | Low |
| 5 | Atoms: Container, Spacer, Divider, Overlay | 4 | Low |
| 6 | Molecules: NavLink, LogoImage, MenuButton | 3 | Medium |
| 7 | Molecules: DropdownMenu, IconText, SocialIcon | 3 | Medium |
| 8 | Molecules: SectionTitle, ProfileImage, ScrollIndicator | 3 | Medium |
| 9 | Organisms: NavigationBar, MobileNavigation | 2 | High |
| 10 | Organisms: FooterContent | 1 | Low |
| 11 | Templates: PageLayout | 1 | Medium |
| 12 | Organisms: HeroContent | 1 | Medium |
| 13 | Templates: HeroSection | 1 | High |
| 14 | Organisms: AboutContent, ResearchThemeCard | 2 | Medium |
| 15 | Organisms: BigQuestionCard, AffiliationLogo | 2 | Medium |
| 16 | Templates: ContentSection, GridSection, TwoColumnSection | 3 | Medium |
| 17 | Pages: HomePage | 1 | High |
| 18 | Organisms: TeamMemberCard, AlumniCard | 2 | Medium |
| 19 | Pages: PeoplePage | 1 | Medium |
| 20 | Organisms: PublicationItem | 1 | Low |
| 21 | Pages: PublicationsPage | 1 | Medium |
| 22 | Organisms: BigQuestionContent | 1 | Medium |
| 23 | Templates: DetailPageLayout | 1 | Low |
| 24 | Pages: BigQuestionPage | 1 | Medium |
| 25 | Pages: NewsPage, BlogPage, ClimateSnacksPage, JoinUsPage | 4 | Medium |
| 26 | Responsive Design | - | High |
| 27 | Animations (framer-motion) | - | Medium |

**Total Components**:
- Atoms: 13
- Molecules: 12
- Organisms: 15
- Templates: 6
- Pages: 8
- **Total: 54 components**

---

## Component Naming Conventions

1. **파일명**: PascalCase (`TeamMemberCard.tsx`)
2. **폴더명**: PascalCase (`TeamMemberCard/`)
3. **Props Interface**: `{ComponentName}Props` (`TeamMemberCardProps`)
4. **Styles**: `{ComponentName}.styles.ts`
5. **Export**: 각 폴더에 `index.ts`로 re-export

---

## Assets Required

1. **Images**:
   - Hero background (Earth/satellite)
   - Team member photos (17)
   - Alumni photos (9)
   - MIT logo
   - MIT CEE logo

2. **Icons** (lucide-react):
   - Leaf (section decorations)
   - ChevronDown (scroll indicator, dropdowns)
   - Menu (hamburger)
   - Mail (email links)
   - ExternalLink (external links)
   - Custom SVG icons for Big Questions (8)
