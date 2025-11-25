# 🎭 MuseYou (뮤즈유)

> 문화예술을 함께 즐기는 특별한 플랫폼

[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.81-3ECF8E)](https://supabase.com/)

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

**MuseYou**는 서울시 문화예술 공연 정보를 제공하고, 함께 관람할 파트너를 매칭하며, 
단체 관람 프로그램(문화공구)을 제공하는 플랫폼입니다.

### 비전
문화예술인-지자체-관람객이 서로 상생하는 생태계를 만들어, 
모두가 쉽게 문화예술을 즐길 수 있는 세상을 만듭니다.

### 핵심 가치
- 🤝 **연결**: 문화를 매개로 사람들을 연결합니다
- 🎨 **접근성**: 누구나 쉽게 문화예술을 접할 수 있도록 합니다
- 💡 **혁신**: 새로운 방식으로 문화를 즐기는 경험을 제공합니다

---

## ✨ 주요 기능

### 🎪 서울시 문화예술 공연
- 클래식, 연극, 뮤지컬, 전시 등 다양한 공연 정보 제공
- 실시간 공연 일정 및 예매 정보
- 지역별, 카테고리별 필터링
- 리뷰 및 평점 시스템

### 💕 문화 파트너 매칭
- 취향이 맞는 Muse(문화 동반자) 찾기
- 프로필 기반 매칭 시스템
- 안전한 채팅 및 만남 주선
- 공연 후기 및 경험 공유

### 👥 문화공구 (단체 관람)
- 함께 모여 문화예술을 즐기는 프로그램
- 단체 할인 혜택 제공
- 지역 커뮤니티 활성화
- 정기 모임 및 이벤트

### 🏛️ 지자체 홍보
- 서울시 자치구별 문화예술 행사 정보
- 지역 문화 축제 및 이벤트
- 지자체 문화 정책 소개

### 📝 커뮤니티 게시판
- 공연 후기 및 리뷰
- 문화 정보 공유
- Q&A 및 모임 공지

---

## 🛠️ 기술 스택

### Frontend
| 항목 | 기술 | 버전 | 설명 |
|------|------|------|------|
| 프레임워크 | React + Vite | 18.3 / 6.3 | 빠른 개발 환경 |
| 언어 | TypeScript | 5.0 | 타입 안전성 |
| 라우팅 | React Router | 6.x | SPA 라우팅 |
| 상태관리 | Zustand | 5.x | 경량 상태 관리 |
| UI 컴포넌트 | shadcn/ui | latest | Radix UI 기반 |
| 스타일링 | Tailwind CSS | 3.x | 유틸리티 우선 |
| 폼 관리 | React Hook Form | 7.x | 성능 최적화된 폼 |
| 검증 | Zod | 3.x | 스키마 기반 검증 |
| 아이콘 | Lucide React | latest | Tree-shakeable |
| 애니메이션 | Framer Motion | 11.x | 부드러운 애니메이션 |

### Backend
| 항목 | 기술 | 설명 |
|------|------|------|
| BaaS | Supabase | 인증, DB, Storage |
| 서버 | Hono | 경량 웹 프레임워크 |
| 인증 | Supabase Auth | 이메일/소셜 로그인 |
| 데이터베이스 | PostgreSQL | Supabase DB |
| 스토리지 | Supabase Storage | 이미지 업로드 |

### DevOps
| 항목 | 기술 | 설명 |
|------|------|------|
| 패키지 매니저 | pnpm | 빠른 설치 속도 |
| 린터 | ESLint | 코드 품질 |
| 포매터 | Prettier | 코드 스타일 |
| Git | Conventional Commits | 커밋 규칙 |

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.0 이상
- pnpm 8.0 이상
- Git

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/museyou.git
cd Museyou
```

### 2. 환경 변수 설정
`.env` 파일 생성:
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# (선택) 기타 API Keys
```

### 3. 의존성 설치
```bash
cd app
pnpm install
```

### 4. 개발 서버 실행
```bash
pnpm dev
```

서버가 실행되면 http://localhost:3001 에서 확인할 수 있습니다.

### 5. 빌드
```bash
pnpm build
```

빌드 결과물은 `app/build/` 폴더에 생성됩니다.

---

## 📁 프로젝트 구조

```
Museyou/
├── .cursor/                      # AI 코딩 규칙
│   └── rules/
│       ├── 00-principle.mdc      # 개발 원칙
│       ├── 01-common.mdc         # 공통 규칙
│       ├── 02-wireframe.mdc      # 와이어프레임 단계
│       ├── 03-ui.mdc            # UI 구현
│       ├── 04-func.mdc          # 기능 구현
│       ├── 05-test.mdc          # 테스트
│       └── 06-all-test.mdc      # 전체 통합 테스트
│
├── commons/                      # 공통 유틸 (코드캠프 스타일)
│   ├── api/                      # API 클라이언트
│   ├── hooks/                    # 커스텀 훅
│   ├── stores/                   # Zustand 스토어
│   ├── types/                    # TypeScript 타입
│   └── utils/                    # 유틸리티 함수
│
├── components/                   # 컴포넌트
│   ├── auth/                     # 인증
│   │   ├── login/
│   │   │   ├── index.tsx
│   │   │   ├── hook.ts
│   │   │   ├── queries.ts
│   │   │   └── prompts/         # 설계 문서
│   │   └── signup/
│   │
│   ├── performances/             # 공연
│   │   ├── performance-detail/
│   │   ├── performance-list/
│   │   └── performance-card/
│   │
│   ├── matching/                 # 매칭
│   ├── boards/                   # 게시판
│   ├── common/                   # 공통 컴포넌트
│   └── ui/                       # shadcn/ui
│
├── app/                          # 페이지
│   ├── src/
│   │   ├── components/           # 앱 컴포넌트
│   │   ├── lib/                  # 라이브러리 설정
│   │   └── styles/               # 글로벌 스타일
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                         # 문서
│   ├── DEVELOPMENT_WORKFLOW.md   # 개발 워크플로우
│   └── CONTRIBUTING.md           # 기여 가이드
│
├── assets/                       # 정적 파일
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── README.md                     # 이 파일
├── STRUCTURE_MIGRATION_PLAN.md  # 구조 마이그레이션 계획
├── setup-structure.sh            # 폴더 구조 설정 스크립트
└── .gitmessage                   # Git 커밋 템플릿
```

---

## 📖 개발 가이드

### 필독 문서

#### 1. AI 코딩 규칙 (`.cursor/rules/`)
개발 시 참고해야 할 단계별 가이드입니다.

- **00-principle.mdc**: 개발 원칙 및 워크플로우
- **01-common.mdc**: 프로젝트 공통 규칙
- **02-wireframe.mdc**: 와이어프레임 단계 가이드
- **03-ui.mdc**: UI 구현 가이드
- **04-func.mdc**: 기능 구현 가이드
- **05-test.mdc**: 테스트 가이드
- **06-all-test.mdc**: 전체 통합 테스트 및 코드 품질 검증

#### 2. 개발 워크플로우
```
Phase 1: 와이어프레임 (02-wireframe.mdc)
   ↓
Phase 2: UI 구현 (03-ui.mdc)
   ↓
Phase 3: 기능 구현 (04-func.mdc)
   ↓
Phase 4: 테스트 (05-test.mdc)
   ↓
Phase 5: 전체 통합 테스트 (06-all-test.mdc)
   ↓
✅ 배포 준비 완료
```

### 개발 명령어
```bash
# 개발 서버
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 타입 체크
npx tsc --noEmit
```

### Git 커밋 규칙
```bash
# 커밋 시 템플릿 자동 적용
git commit

# 커밋 메시지 형식
<타입>: <제목> (50자 이내)

[본문]

[푸터]
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

**예시:**
```
feat: 공연 검색 기능 추가

- 키워드 기반 공연 검색 구현
- 실시간 자동완성 기능
- 검색 기록 localStorage 저장

Closes #42
```

### 코드 품질 규칙

#### 1. TypeScript any 금지
```typescript
// ❌ Bad
const data: any = await fetchData();

// ✅ Good
interface Performance {
  id: string;
  title: string;
  // ...
}
const data: Performance[] = await fetchData();
```

#### 2. DRY 원칙 (Don't Repeat Yourself)
- 같은 코드를 3번 이상 복사하면 **즉시 공통화**
- 재사용 가능한 로직은 `commons/utils/`로 분리
- 재사용 가능한 컴포넌트는 `components/common/`으로 분리

#### 3. 컴포넌트 설계
- 파일 길이: 300줄 이하
- 하나의 컴포넌트는 하나의 역할만
- 복잡한 로직은 커스텀 훅으로 분리

---

## 🤝 기여하기

### 기여 절차

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/museyou.git
   cd Museyou
   ```

2. **브랜치 생성**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **개발**
   - `.cursor/rules/` 가이드 참고
   - 커밋 규칙 준수

4. **테스트**
   ```bash
   pnpm lint
   npx tsc --noEmit
   pnpm build
   ```

5. **Pull Request**
   - 명확한 제목과 설명 작성
   - 관련 이슈 번호 연결

### PR 체크리스트
- [ ] ESLint 에러 0개
- [ ] TypeScript 에러 0개
- [ ] `any` 타입 사용 0건
- [ ] 중복 코드 없음
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 커밋 메시지 규칙 준수

---

## 🎓 학습 자료

### 프로젝트 문서
- [폴더 구조 마이그레이션 계획](./STRUCTURE_MIGRATION_PLAN.md)
- [개발 워크플로우](./docs/DEVELOPMENT_WORKFLOW.md)
- [기여 가이드](./docs/CONTRIBUTING.md)

### 외부 자료
- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📊 성능 목표

| 항목 | 목표 | 현재 |
|------|------|------|
| First Contentful Paint | < 1.8s | - |
| Largest Contentful Paint | < 2.5s | - |
| Time to Interactive | < 3.8s | - |
| Lighthouse Performance | > 90 | - |
| Lighthouse Accessibility | > 90 | - |
| 번들 크기 (gzipped) | < 500KB | - |

---

## 🔒 보안

- Supabase Row Level Security (RLS) 적용
- XSS 방어
- CSRF 보호
- 환경 변수로 민감 정보 관리
- HTTPS 통신

---

## 🗺️ 로드맵

### Phase 1: MVP (현재)
- [x] 기본 프로젝트 구조
- [x] 인증 시스템
- [x] 공연 목록/상세
- [x] 기본 UI 컴포넌트

### Phase 2: 핵심 기능
- [ ] 매칭 시스템
- [ ] 채팅 기능
- [ ] 결제 시스템
- [ ] 알림 시스템

### Phase 3: 확장
- [ ] 모바일 앱
- [ ] 추천 알고리즘
- [ ] 소셜 기능 강화
- [ ] 지역 확대

---

## 👥 팀

- **개발자**: [이름]
- **디자이너**: [이름]
- **기획자**: [이름]

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

---

## 📞 문의

- **Email**: contact@museyou.com
- **GitHub Issues**: [이슈 등록](https://github.com/yourusername/museyou/issues)
- **Discord**: [커뮤니티 참여](https://discord.gg/museyou)

---

## 🎉 감사의 말

이 프로젝트는 다음을 사용하여 개발되었습니다:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

그리고 오픈소스 커뮤니티의 모든 기여자분들께 감사드립니다.

---

**Made with ❤️ by MuseYou Team**

**⭐ 이 프로젝트가 마음에 드신다면 Star를 눌러주세요!**
