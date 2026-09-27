# Timber project

## 로컬 실행과 승인제 회원가입

Node.js 24 이상을 사용합니다. `npm run dev` 한 번으로 사이트(5173 포트)와 인증 서버(3001 포트)가 함께 실행됩니다.

```powershell
npm ci
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다. 기존 사이트 페이지는 공개되며 로그인, 회원가입 메뉴가 추가됩니다.

### 마스터 계정 등록

서버를 운영하는 사람이 별도의 터미널에서 실행합니다. 이메일이 로그인 아이디입니다.

```powershell
npm run master:create -- master@example.com "관리자 이름"
```

비밀번호와 확인 비밀번호를 터미널에 입력합니다. 입력한 비밀번호는 화면에 표시되지 않습니다. 12~128자를 사용하세요. 기본 관리자 계정이나 기본 비밀번호는 없습니다. 이미 가입 요청된 이메일은 마스터 등록에 사용할 수 없습니다.

로그인하면 메인화면(`/`)으로 이동합니다. 마스터 계정으로 로그인한 경우 네비게이션 오른쪽에 **가입 승인 관리** 메뉴가 표시됩니다. 이 메뉴로 `/admin` 화면에 들어가 가입 요청을 승인하거나 거절하고 처리 기록을 확인합니다. 서버도 마스터 권한을 검사하므로 일반 회원은 관리자 API를 사용할 수 없습니다.

### 가입과 로그인 흐름

1. `/signup`에서 이름, 이메일, 소속, 비밀번호를 입력합니다.
2. 가입 요청은 `pending`(승인 대기) 상태로 저장됩니다. 이 상태에서는 로그인할 수 없습니다.
3. 마스터가 `/admin`에서 요청을 승인(`approved`)하거나 거절(`rejected`)합니다.
4. 승인된 회원은 로그인해서 `/members` 회원 공간에 접근합니다. 거절된 계정은 로그인할 수 없습니다.

회원 공간은 계정 정보 화면입니다. 별도의 회원 전용 게시판이 `/board`에 있으며 상단 **뉴스 → 게시판 → 한국어** 순서의 메뉴로 접근할 수 있습니다. 이메일 인증, 승인 알림 메일, 비밀번호 재설정은 이번 로컬 구현에 포함되지 않습니다.

### 회원 전용 게시판

- 관리자 승인을 받고 로그인한 회원만 글 목록, 내용, 작성 화면과 게시판 API에 접근할 수 있습니다. 비회원·승인 대기·거절 계정은 게시글을 조회하거나 작성할 수 없습니다.
- `/board`에서 최신 글 목록을 보고, **글쓰기**로 제목과 내용을 입력합니다. 제목은 최대 120자, 내용은 최대 10,000자이며 한 페이지에 20개씩 표시됩니다.
- 글을 작성한 회원만 수정할 수 있습니다. 삭제는 작성자 또는 마스터만 가능하며, 삭제 전 확인 화면이 표시됩니다.
- 작성자는 서버의 로그인 정보로 결정합니다. 글에는 작성자 이름과 작성·수정 일시가 표시되며 이메일이나 비밀번호 정보는 노출하지 않습니다.
- 글은 기존 SQLite DB의 `posts` 테이블에 저장되어 서버를 재시작해도 유지됩니다. 기존 회원 정보는 그대로 유지됩니다.
- 내용은 일반 텍스트로 표시합니다. HTML 실행, 댓글, 파일 첨부는 포함하지 않습니다.

### 데이터와 세션

- DB는 `server/data/auth.sqlite`에 저장됩니다. 서버를 재시작해도 계정과 승인 상태가 유지됩니다.
- DB와 환경 파일은 Git에서 제외됩니다. DB를 삭제하면 마스터 계정을 포함한 모든 계정이 삭제되므로 운영 데이터는 백업하세요.
- 비밀번호는 salt가 포함된 scrypt 해시로 저장됩니다. [OWASP의 scrypt 설정](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)을 적용합니다.
- 로그인 세션은 8시간 후 만료됩니다. 세션 쿠키는 HttpOnly와 SameSite=Strict를 사용하며, 서버 DB에는 세션 토큰의 해시를 저장합니다.
- 회원 전용 데이터는 반드시 인증이 적용된 서버 API에서 제공해야 합니다. `public/`이나 프런트엔드 코드에 넣은 파일은 공개 자료입니다.

선택 환경 변수: `AUTH_DB_PATH`(DB 경로), `AUTH_PORT`(기본 3001), `AUTH_HOST`(기본 127.0.0.1), `SITE_ORIGIN`(허용할 사이트 주소). 개발 환경에서는 `http://localhost:5173`, `http://127.0.0.1:5173`, `http://[::1]:5173`과 이 컴퓨터의 IPv4 네트워크 주소(5173 포트)를 허용합니다. Vite가 표시하는 Network 주소로 접속해도 가입·로그인이 동작합니다. 다른 포트나 별도 도메인을 사용한다면 `SITE_ORIGIN`을 지정하세요. 설정한 경우 해당 주소만 허용되며, 운영 환경에서도 지정한 HTTPS 주소만 허용됩니다. 접속 호스트를 바꾸면 기존 쿠키가 공유되지 않으므로 같은 주소를 계속 사용하세요.

### 검증

```powershell
npm run test:auth
npm run test:board
npm run build
```

### 운영 배포

현재 GitHub Pages 설정은 정적 사이트만 배포합니다. 승인제 회원 기능을 운영하려면 Node 서버와 지속 저장 공간이 필요합니다. 이번 변경은 로컬 실행용이며 서버를 외부에 배포하지 않습니다.

운영 시 Node 서버가 `dist` 사이트와 `/api`를 같은 도메인에서 제공하도록 구성하고 HTTPS 역방향 프록시를 연결합니다. `NODE_ENV=production`, `SITE_ORIGIN=https://실제사이트주소`를 지정하고 빌드 후 `npm start`로 실행합니다. 운영 쿠키에는 Secure가 추가됩니다. SQLite는 단일 서버와 지속 디스크를 전제로 합니다. HTTPS 접속과 DB 백업을 구성한 뒤 운영하세요.

## Original Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
