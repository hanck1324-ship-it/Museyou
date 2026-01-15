# 🎭 MuseYou (뮤즈유)

> 문화예술을 함께 즐기고, 파트너를 찾고, 지자체 문화 프로그램을 한 곳에서 발견하는 플랫폼

[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/Vite-SWC-646CFF)](https://vitejs.dev/) [![Supabase](https://img.shields.io/badge/Supabase-DB%2FAuth-3ECF8E)](https://supabase.com/)

---

## 왜 만들었나요?

- 서울·수도권 문화예술 정보를 한눈에 모아 **검색·필터링·상세보기**까지 빠르게 경험하도록.
- 공연을 함께 볼 **문화 동반자(Muse)**를 찾고, 상호작용(좋아요/매칭/메시지)을 지원하도록.
- 자치구 문화 프로그램을 모아 **지역 커뮤니티 활성화**와 참여 장벽을 낮추도록.
- 코드캠프 스타일의 **프롬프트 중심 개발 규칙**을 도입해, 누구나 30분 내 온보딩 가능한 프로젝트를 만들기 위해.

현재 상태: 문서/프롬프트 시스템 100% 구축 ✅, 실제 기능 고도화(Phase 4) 대기 중 ⏳  
참고: `IMPLEMENTATION_STATUS.md`, `MUSEYOU_UPGRADE_PLAN.md`

---

## 핵심 기능 한눈에 보기

- **공연/전시 탐색**: 카테고리·지역·가격·날짜 필터 + 검색, 카드형 리스트, 디테일 다이얼로그.
- **좋아요 & 개인화**: 로그인 후 공연 좋아요 토글, 좋아요 목록 초기 로드.
- **문화 파트너 매칭**: 매칭 카드, 프로필/메시지/좋아요 액션, 매칭 성공 토스트.
- **단체 관람 공동구매**: 공연/전시별 최소 인원 모집 → 목표 인원 달성 시 할인 확정, 미달 시 환불 또는 대체 옵션 안내, 진행 상황·마감일까지 실시간 진행률 표시, 알림(푸시/이메일)로 상태 공유, **환불 규칙**: 지정된 기간까지는 일정 비율 환불, 마감 시점 이후에는 환불 불가 옵션 설정
- **지자체 홍보**: 자치구별 문화 프로그램/프로모션 카드 노출.
- **인증/세션**: Supabase Auth 연동, 로그인/회원가입 다이얼로그, 세션 기반 상태 복구.
- **커뮤니티**: `/boards/*` 라우트로 게시판 페이지 진입 가능.
- **에러·네트워크 안정성**: 전역 `ErrorBoundary` + 네트워크 모니터링(`setupNetworkMonitor`).

---

## 프롬프트 기반 개발 방식

프롬프트로 설계·UI·기능을 미리 정의하고, 이를 기반으로 구현합니다.  
문서 전체 목록: `PROMPTS_GUIDE.md`, `components/README.md`

- `components/**/prompts/01.wireframe.txt` : 레이아웃/반응형/상태 정의
- `components/**/prompts/02.ui.txt` : 색상·타이포·간격·다크모드 등 디자인 시스템
- `components/**/prompts/03.func.txt` : Props, 상태, 이벤트, Supabase 연동, 테스트 계획
- 공통 규칙: `.cursor/rules/*.mdc` (원칙, 공통, wireframe, ui, func, test, all-test)

주요 Prompt 예시
- 공연 카드: `components/performances/performance-card/prompts/` (좋아요·장바구니·공유·평점·최적화)
- 공연 상세: `components/performances/performance-detail/prompts/` (지도, 갤러리, 예매, 추천)
- 매칭 카드: `components/matching/matching-card/prompts/` (스와이프, 애니메이션, 프로필 모달)
- 인증 다이얼로그: `components/auth/auth-dialog/prompts/` (소셜 로그인, 비밀번호 재설정, 이메일 인증)
- 공통 네비게이션: `components/common/navigation/prompts/`

---

## 기술 스택

- **언어/도구**: React 18, TypeScript, Vite(SWC) + React Router
- **UI**: shadcn/ui(Radix 기반), Tailwind CSS, lucide-react, embla-carousel
- **상태/폼/검증**: Zustand, React Hook Form, Zod
- **데이터**: Supabase (Auth/DB/Storage), Apollo Client(준비), GraphQL
- **지도/차트/애니메이션**: react-kakao-maps-sdk, Recharts, Framer Motion(Motion)
- **품질**: ESLint, TypeScript strict, Prettier, Conventional Commits, .cursor 규칙

---

## 로컬 실행

사전 요구사항: Node 18+, pnpm 8+

```bash
# 1) 의존성 설치
pnpm install

# 2) 환경변수(.env) 예시
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3) 개발 서버 (Vite, 기본 3000 포트)
pnpm dev

# 4) 빌드 / 린트
pnpm build
pnpm lint
```

참고: package 스크립트가 Next 용으로 남아있을 수 있습니다. 현재 코드는 Vite + React Router 구조이므로 실행은 `pnpm dev` 기준으로 안내합니다. (정리는 추후 스크립트 정합성 단계에서 수행)

---

## 프로젝트 구조 (요약)

```
Museyou/
├── src/                      # 현재 작동 중인 React + Vite 소스
│   ├── main.tsx / RootApp.tsx
│   ├── App.tsx               # 홈/공연/매칭/프로모션 탭 UI
│   ├── boards/               # 게시판 라우터 및 페이지
│   ├── components/           # UI/도메인 컴포넌트
│   ├── lib/                  # api, apollo, validations, utils
│   ├── store/                # Zustand 스토어
│   └── styles/               # 글로벌 스타일
│
├── components/               # 프롬프트 전용 설계 문서
│   ├── performances/performance-card/prompts/
│   ├── performances/performance-detail/prompts/
│   ├── matching/matching-card/prompts/
│   └── auth/auth-dialog/prompts/
│
├── docs/                     # 워크플로우/개선 가이드
├── .cursor/rules/            # AI 코딩 규칙 세트
├── PROMPTS_GUIDE.md          # 프롬프트 사용법
├── IMPLEMENTATION_STATUS.md  # 진행 현황(문서 100% / 구현 0% 진행 전)
├── MUSEYOU_UPGRADE_PLAN.md   # 업그레이드 로드맵
└── vite.config.ts / tsconfig.json / tailwind.config.ts
```

---

## 개발 워크플로우

1. **프롬프트 읽기**: 대상 컴포넌트의 01/02/03 파일 확인 → 요구사항·디자인·기능 파악  
2. **규칙 준수**: `.cursor/rules/` 단계별 가이드(wireframe → ui → func → test)  
3. **구현**: wireframe → UI 스타일링 → 기능/연동 → 테스트  
4. **검증**: ESLint, TS, (필요 시) Vitest/Playwright 준비  
5. **커밋**: Conventional Commits + `.gitmessage` 템플릿  
6. **PR**: 체크리스트 충족 후 제출

---

## 우선순위 작업(Phase 1 추천)

- 공연 카드: 좋아요 기능, 장바구니/공유, 이미지·성능 최적화  
- 공연 상세: Kakao Map 통합, 갤러리, 예매/공유/추천  
- 매칭 카드: 스와이프 인터랙션, 프로필 모달, 채팅 연동  
- 인증: 소셜 로그인(카카오/구글), 비밀번호 재설정, 이메일 인증  
자세한 요구사항은 각 `components/**/prompts`와 `docs/COMPONENT_IMPROVEMENT_GUIDE.md` 참고.

---

## 팀 내 약속

- `any` 금지, 중복 로직 공통화, 컴포넌트 단일 책임
- 파일 300줄 이하 권장, 복잡 로직은 커스텀 훅 분리
- 에러는 `handleError` / `ErrorBoundary`로 수집·표시, 사용자 친화 메시지 사용
- 네트워크 상태 감지(`setupNetworkMonitor`)로 오프라인 대비

---

## 문의 / 링크

- Issues: GitHub Issues 활용
- 문서: `PROMPTS_GUIDE.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/COMPONENT_IMPROVEMENT_GUIDE.md`

---

**Made with ❤️ by MuseYou Team**  
프로젝트가 도움이 되셨다면 ⭐️ 를 눌러주세요!
