# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language (소통 언어)

**모든 메시지는 한국어로 작성한다.**

## Project Overview

This is a clone project of https://www.terrerlab.com/

## Clone Requirements (복제 요구사항)

**완전한 복제를 목표로 한다:**
- 폰트: 원본 사이트와 동일한 폰트 사용
- 애니메이션: 모든 hover, scroll, transition 효과 복제
- 레이아웃: 픽셀 단위로 정확한 배치
- 반응형: 모든 브레이크포인트에서 동일한 동작
- 기능: 모든 인터랙션 (드롭다운, 스크롤 등) 완전 구현
- 테스트: 구현 후 Playwright로 직접 테스트하여 원본과 비교 검증

## Tech Stack

- React 19 with TypeScript
- Vite 7 (build tool and dev server)
- ESLint 9 with TypeScript and React plugins

## Git Rules (Git 규칙)

**Git push는 사용자가 직접 수행한다. Claude는 push하지 않는다.**

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Type check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

- `src/main.tsx` - Application entry point, renders App with StrictMode
- `src/App.tsx` - Root component
- `public/` - Static assets served at root
- `vite.config.ts` - Vite configuration with React plugin

## TypeScript Configuration

Uses project references with separate configs:
- `tsconfig.app.json` - App source code
- `tsconfig.node.json` - Node/Vite config files

## Component Architecture (Extreme Componentization)

**핵심 원칙: 모든 것을 컴포넌트로 분리한다. 사소한 것까지도.**

### 컴포넌트 분리 규칙

1. **Atomic Components (원자 컴포넌트)** - 가장 작은 단위
   - `Text` - 모든 텍스트 렌더링
   - `Heading` - h1~h6 래퍼
   - `Paragraph` - p 태그 래퍼
   - `Span` - span 래퍼
   - `Icon` - 모든 아이콘
   - `Image` - img 래퍼
   - `Link` - a 태그 래퍼
   - `Button` - 버튼
   - `Input` - 입력 필드
   - `Divider` - 구분선
   - `Spacer` - 여백

2. **Molecule Components (분자 컴포넌트)** - 원자 조합
   - `IconText` - 아이콘 + 텍스트
   - `LabeledInput` - 레이블 + 입력
   - `NavLink` - 네비게이션 링크
   - `LogoImage` - 로고 이미지
   - `SocialIcon` - 소셜 아이콘 링크
   - `MenuButton` - 메뉴 버튼

3. **Organism Components (유기체 컴포넌트)** - 분자 조합
   - `NavigationBar` - 네비게이션 바
   - `HeroSection` - 히어로 섹션
   - `CardItem` - 카드 아이템
   - `Footer` - 푸터
   - `ContactForm` - 연락 폼

4. **Template Components (템플릿 컴포넌트)** - 페이지 레이아웃
   - `PageLayout` - 기본 페이지 레이아웃
   - `SectionLayout` - 섹션 레이아웃
   - `GridLayout` - 그리드 레이아웃

5. **Page Components (페이지 컴포넌트)** - 최종 페이지
   - `HomePage`, `PublicationsPage`, `PeoplePage` 등

### 디렉토리 구조

```
src/
├── components/
│   ├── atoms/
│   │   ├── Text/
│   │   │   ├── Text.tsx
│   │   │   ├── Text.styles.ts
│   │   │   └── index.ts
│   │   ├── Heading/
│   │   ├── Button/
│   │   ├── Icon/
│   │   ├── Image/
│   │   ├── Link/
│   │   ├── Divider/
│   │   └── Spacer/
│   ├── molecules/
│   │   ├── IconText/
│   │   ├── NavLink/
│   │   ├── LogoImage/
│   │   └── MenuButton/
│   ├── organisms/
│   │   ├── NavigationBar/
│   │   ├── HeroSection/
│   │   ├── CardSection/
│   │   └── Footer/
│   ├── templates/
│   │   ├── PageLayout/
│   │   └── SectionLayout/
│   └── pages/
│       ├── HomePage/
│       ├── PublicationsPage/
│       ├── PeoplePage/
│       └── ...
├── hooks/
├── utils/
└── styles/
```

### 컴포넌트 작성 규칙

1. **단일 책임**: 하나의 컴포넌트는 하나의 역할만 수행
2. **Props 명확화**: 모든 props는 TypeScript interface로 정의
3. **재사용성**: 하드코딩 금지, 모든 값은 props로 전달
4. **스타일 분리**: 스타일은 별도 파일로 분리 (CSS Modules 또는 styled-components)
5. **index.ts 필수**: 각 컴포넌트 폴더에 index.ts로 export

### 예시: 텍스트도 컴포넌트로

```tsx
// ❌ 하지 말 것
<p className="description">Some text here</p>

// ✅ 해야 할 것
<Paragraph variant="description">
  <Text>Some text here</Text>
</Paragraph>
```

### 예시: 여백도 컴포넌트로

```tsx
// ❌ 하지 말 것
<div style={{ marginTop: '20px' }}>...</div>

// ✅ 해야 할 것
<Spacer size="lg" />
<Content>...</Content>
```

### 예시: 구분선도 컴포넌트로

```tsx
// ❌ 하지 말 것
<hr className="divider" />

// ✅ 해야 할 것
<Divider variant="horizontal" thickness="thin" color="gray" />
```
