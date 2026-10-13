# Timber project

## 연구단 활동 사진과 자료 추가

공개 메뉴 **연구단 소식 → 연구단 활동**(`/news/activities`)에서 행사 사진과 제목을 확인할 수 있습니다. 카드를 클릭하면 해당 행사의 자료를 원본 비율로 보여줍니다.

새 행사를 올릴 때는 사진 파일을 `public/content/activities/images/`에 넣고 `src/content/activities/activities.yaml`에 아래처럼 항목을 추가한 뒤 빌드·배포합니다. `id`는 행사별로 서로 다른 영문 주소를 사용하고, `date`는 `YYYY-MM-DD` 형식으로 입력합니다. 최신 날짜순으로 표시됩니다. `images`에 사진을 추가하면 한 행사에 여러 장을 표시할 수 있습니다. 현재 등록된 제1차 워크샵은 기존 자료 이미지를 사용합니다.

```yaml
- id: workshop-2
  title:
    ko: "제2차 워크샵"
    en: "2nd Workshop"
  date: "2026-10-12"
  images:
    - src: "/content/activities/images/workshop-2.jpg"
      alt:
        ko: "제2차 워크샵 단체 사진"
        en: "Group photo at the 2nd workshop"
```

## 연구성과 실적 수정

연구성과 페이지(`/results`)의 실적은 `src/data/researchResults.ts`에서 수정합니다. 각 지표의 `completed`에 누적 완료 건수를 입력하고, `resultAsOfDate`에 집계 기준일을 `"2026-10-12"`처럼 입력합니다. `null`은 집계 전, `0`은 확인된 0건이며 목표값인 `first`, `second`는 그대로 둡니다. 입력한 실적의 합계와 전체 목표 대비 달성률은 자동 계산됩니다. 일부 지표만 입력한 경우 차트에 입력한 지표 수와 ‘입력된 실적 기준’ 표시가 나타납니다. 변경 후 빌드·배포하면 사이트에 반영됩니다.

## 로컬 실행과 승인제 회원가입

Node.js 24 이상을 사용합니다. `npm run dev` 한 번으로 사이트(5173 포트)와 인증 서버(3001 포트)가 함께 실행됩니다.

```powershell
npm ci
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다. 기존 사이트 페이지는 공개되며 로그인, 회원가입 메뉴가 추가됩니다.

### 마스터 계정 등록

서버를 운영하는 사람이 별도의 터미널에서 실행합니다. 로그인에는 아이디와 비밀번호를 사용하며 이메일은 연락용으로만 저장합니다.

```powershell
npm run master:create -- ERS master@example.com "관리자 이름"
```

비밀번호와 확인 비밀번호를 터미널에 입력합니다. 입력한 비밀번호는 화면에 표시되지 않습니다. 12~128자를 사용하세요. 기본 관리자 계정이나 기본 비밀번호는 없습니다. 이미 등록된 아이디나 이메일은 마스터 등록에 사용할 수 없습니다. 기존 관리자 아이디와 비밀번호를 변경할 때는 `npm run master:update -- ERS`를 실행합니다. 변경하면 기존 관리자 세션이 만료됩니다.

운영 Turso DB의 관리자 정보를 변경할 때는 `node --env-file=.env server/update-master.mjs ERS`를 실행합니다.

로그인하면 메인화면(`/`)으로 이동합니다. 마스터 계정으로 로그인한 경우 네비게이션 오른쪽에 **가입 승인 관리** 메뉴가 표시됩니다. 이 메뉴로 `/admin` 화면에 들어가 가입 요청을 승인하거나 거절하고 처리 기록을 확인합니다. 서버도 마스터 권한을 검사하므로 일반 회원은 관리자 API를 사용할 수 없습니다.

### 가입과 로그인 흐름

1. `/signup`에서 이름, 아이디, 연락용 이메일, 소속, 비밀번호를 입력합니다. 아이디는 영문으로 시작하는 영문·숫자·밑줄 3~32자이며 대소문자를 구별하지 않습니다.
2. 가입 요청은 `pending`(승인 대기) 상태로 저장됩니다. 이 상태에서는 로그인할 수 없습니다.
3. 마스터가 `/admin`에서 요청을 승인(`approved`)하거나 거절(`rejected`)합니다.
4. 승인된 회원은 로그인해서 `/members` 회원 공간에 접근합니다. 거절된 계정은 로그인할 수 없습니다.

기존 계정은 처음 새 버전을 실행할 때 아이디가 자동 부여됩니다. 관리자는 `ERS`, 기존 회원은 `user` 뒤에 기존 계정 번호가 붙습니다(예: `user2`). 이메일은 로그인에 사용할 수 없으며 기존 비밀번호는 유지됩니다.

회원 공간은 계정 정보 화면입니다. 별도의 회원 전용 게시판이 `/board`에 있으며 상단 **뉴스 → 게시판 → 한국어** 순서의 메뉴로 접근할 수 있습니다. 이메일 인증, 승인 알림 메일, 비밀번호 재설정은 이번 로컬 구현에 포함되지 않습니다.

### 회원 전용 게시판

- 관리자 승인을 받고 로그인한 회원만 글 목록, 내용, 작성 화면과 게시판 API에 접근할 수 있습니다. 비회원·승인 대기·거절 계정은 게시글을 조회하거나 작성할 수 없습니다.
- `/board`에서 최신 글 목록을 보고, **글쓰기**로 제목과 내용을 입력합니다. 제목은 최대 120자, 내용은 최대 10,000자이며 한 페이지에 20개씩 표시됩니다.
- 글을 작성한 회원만 수정할 수 있습니다. 삭제는 작성자 또는 마스터만 가능하며, 삭제 전 확인 화면이 표시됩니다.
- 작성자는 서버의 로그인 정보로 결정합니다. 글에는 작성자 이름과 작성·수정 일시가 표시되며 이메일이나 비밀번호 정보는 노출하지 않습니다.
- 글은 `posts`, 공지사항은 `notices`, 회원 정보는 `users` 테이블에 저장됩니다. Turso 환경 변수가 있으면 Turso를 사용하고, 없는 로컬 개발 환경에서는 SQLite를 사용합니다.
- 연구단 활동·1~4세부 게시판과 공지사항에서 글 작성·수정 시 **파일·사진 첨부**를 선택할 수 있습니다. 파일별 최대 20MB, 글당 최대 10개이며 JPG/PNG/GIF/WebP, PDF, HWP/HWPX, Word/Excel/PowerPoint, ZIP, TXT, CSV를 지원합니다. 내용은 일반 텍스트로 표시합니다.
- 사진은 글 상세 화면에서 원본 비율로 미리 보고, 파일명 또는 사진을 눌러 원본을 다운로드합니다. 승인된 로그인 회원만 미리보기·다운로드 API에 접근할 수 있습니다. 게시글 작성자만 첨부를 추가·삭제할 수 있고, 공지사항 첨부는 관리자만 변경합니다. 글을 삭제하면 첨부 원본과 목록도 삭제됩니다.
- 글이 먼저 저장되고 파일은 순서대로 업로드됩니다. 중간에 실패하면 작성 내용과 완료된 첨부가 유지되며 **다시 저장**하면 이어서 처리합니다. 미완료 첨부는 작성자에게만 표시되고 수정 화면에서 삭제할 수 있습니다.

### 데이터와 세션

- Turso 연결 시 회원·승인 상태·세션·글·첨부 목록이 동일한 Turso DB에 저장됩니다. Turso 설정이 없는 로컬 개발 환경의 DB는 `server/data/auth.sqlite`입니다.
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

현재 GitHub Pages 설정은 정적 사이트만 배포합니다. 승인제 회원 기능을 운영하려면 로그인 API와 계정·게시글을 저장할 영구 DB가 함께 필요합니다.

Vercel에서는 `api/index.mjs`가 기존 로그인·관리자 승인·게시판 API를 실행합니다. `vercel.json`은 `/api` 요청을 이 함수로 연결하고, `/login`, `/admin`, `/board` 같은 화면 주소의 직접 접속과 새로고침을 지원합니다. Vercel의 DB 설정이 없으면 로컬 파일이나 임시 DB로 대체하지 않고 서비스 연결 오류(503)를 반환합니다.

로컬에서 생성한 관리자·회원 계정은 `server/data/auth.sqlite`에만 저장되며 GitHub와 Vercel로 전송되지 않습니다. 기존 계정을 유지하려면 운영 DB로 안전하게 이전해야 합니다. DB 파일을 Git에 추가하거나 공개 파일 경로에 넣지 마세요.

운영 시 Node 서버가 `dist` 사이트와 `/api`를 같은 도메인에서 제공하도록 구성하고 HTTPS 역방향 프록시를 연결합니다. `NODE_ENV=production`, `SITE_ORIGIN=https://실제사이트주소`를 지정하고 빌드 후 `npm start`로 실행합니다. 운영 쿠키에는 Secure가 추가됩니다. SQLite는 단일 서버와 지속 디스크를 전제로 합니다. HTTPS 접속과 DB 백업을 구성한 뒤 운영하세요.

### Vercel + Turso DB 연결

기존 Turso libSQL DB 연결을 유지합니다. 첨부 원본은 아래의 비공개 Vercel Blob 저장소에 저장하며, DB에는 첨부 목록과 파일 경로만 저장합니다. 파일 기능에는 별도의 Blob 저장소 연결이 필요합니다.

1. Turso에서 빈 libSQL DB를 생성하고 Database URL과 읽기·쓰기 권한의 Auth Token을 발급합니다.
2. Vercel 프로젝트의 **Settings → Environment Variables**에 아래 세 값을 등록합니다. Production 환경에 적용하세요.

| 이름 | 값 |
| --- | --- |
| `TURSO_DATABASE_URL` | Turso의 `libsql://…turso.io` 주소 |
| `TURSO_AUTH_TOKEN` | DB 연결 토큰 |
| `SITE_ORIGIN` | `https://www.wlss.re.kr` (메인 도메인의 최종 접속 주소) |

토큰은 서버에서만 사용합니다. `VITE_`로 시작하는 변수, 프런트엔드 코드, Git 파일, 채팅에 토큰을 넣지 마세요. `wlss.re.kr`는 `www.wlss.re.kr`로 이동하므로 Production의 `SITE_ORIGIN`도 `https://www.wlss.re.kr`로 지정한 뒤 Redeploy해야 합니다. 이전 Vercel 주소가 남아 있으면 회원가입·관리자 로그인·글 등록 요청이 모두 거절됩니다. 다른 커스텀 도메인으로 바꿀 때도 브라우저에 최종 표시되는 HTTPS 주소와 맞춥니다. 별도의 Preview 주소는 승인된 운영 주소와 다르므로 로그인·회원가입 요청이 거절됩니다.

3. 기존 계정을 유지하려면 이 컴퓨터에서 `.env.example`을 `.env`로 복사하고 동일한 Turso URL·토큰을 입력한 뒤 실행합니다. `.env`는 Git에서 제외됩니다.

```powershell
npm run db:migrate
```

이 도구는 원본 SQLite DB를 읽기 전용으로 열고 계정·비밀번호 해시·승인 상태·게시글을 하나의 트랜잭션으로 이전한 뒤 내용 일치를 검증합니다. 기존 ID와 작성자 연결도 유지됩니다. 로컬 세션은 이전하지 않으므로 운영 사이트에서 다시 로그인하세요. 같은 내용을 재실행하면 중복 없이 완료 상태를 표시하며, 대상 DB에 다른 내용이 있으면 덮어쓰지 않고 중단합니다. 계정·게시글을 운영에서 사용하기 시작한 뒤에는 다시 이전하지 마세요.

기존 DB 대신 새로 시작한다면 위 이전 명령을 실행하지 않고 다음 명령으로 운영 DB에 관리자 계정을 만듭니다. 기존 가입 이메일을 관리자 계정으로 덮어쓰지는 않습니다.

```powershell
node --env-file=.env server/create-master.mjs ERS master@example.com "관리자 이름"
```

4. 수정한 코드를 Vercel에 배포하고 환경 변수를 적용한 상태로 **Redeploy**합니다. Node.js 버전은 24.x, 빌드 명령은 `npm run build`, 출력 폴더는 `dist`를 사용합니다.
5. `/api/health`가 `{"ok":true}`를 반환하는지 확인합니다. `/login`에서 기존 관리자·승인된 회원 계정으로 로그인합니다. 가입 신청자는 기존과 같이 관리자 승인을 받아야 합니다.

Turso 환경 변수가 없는 로컬 실행에서는 기존 SQLite DB를 계속 사용합니다. 운영 DB를 로컬 DB로 바꾸면 운영에서 작성한 새 데이터는 로컬에 자동으로 복사되지 않으므로, 되돌리기 전에 운영 DB를 별도로 백업해야 합니다.

### 비공개 첨부파일 저장소 연결

1. Vercel의 해당 프로젝트 → **Storage → Create Storage → Blob → Private**로 비공개 저장소를 만듭니다. Public 저장소는 사용하지 마세요.
2. 저장소를 이 프로젝트에 연결하고 Production 환경 변수에 `BLOB_READ_WRITE_TOKEN`을 설정합니다. 기존 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SITE_ORIGIN`도 유지합니다. 토큰 값은 Git·프런트엔드·채팅에 넣지 않습니다.
3. 이 코드를 배포하고 환경 변수를 적용해 Redeploy합니다. `attachments` 테이블은 기존 데이터를 유지하면서 자동 생성됩니다.
4. 관리자 또는 승인된 회원으로 로그인해 각 게시판에서 사진·문서를 첨부합니다. 다른 승인된 회원의 다운로드와 로그아웃 상태의 접근 차단도 확인합니다.

브라우저가 파일을 Blob에 직접 전송하므로 큰 파일은 Vercel 함수의 요청 본문을 통과하지 않습니다. 서버는 로그인·작성 권한을 검사해 파일 경로와 크기가 제한된 업로드 토큰을 발급합니다. 완료 알림은 SDK의 서명을 검증하며, 실제 크기·형식을 확인한 파일만 다운로드에 공개합니다. 비공개 원본은 인증 API를 통해 스트리밍합니다.

Blob이 연결되지 않은 운영 서버에서는 글 기능은 유지하고 첨부 요청에 503 오류를 반환합니다. 임시 디스크로 대체하지 않습니다. 로컬 개발에서는 `server/data/attachments/`를 사용하며 `ATTACHMENT_DIR`로 경로를 바꿀 수 있습니다. 로컬 첨부를 운영으로 옮기는 기능은 포함되지 않아, 첨부가 있는 로컬 DB에 `db:migrate`를 실행하면 파일 누락을 막기 위해 중단합니다.

첨부 기능 검증: `npm run test:attachments`. 전체 회귀 검증: `npm test`, `npm run build`.

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
