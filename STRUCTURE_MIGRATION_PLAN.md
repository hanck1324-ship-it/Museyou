# 📁 MuseYou 폴더 구조 재편성 계획

> 코드캠프 프로젝트 구조를 MuseYou에 적용

---

## 📊 현재 구조 vs 목표 구조

### 현재 (MuseYou)
```
Museyou/
├── app/
│   └── src/
│       ├── components/
│       ├── lib/
│       ├── store/
│       └── styles/
└── src/ (중복!)
```

**문제점:**
- app/src와 src 폴더 중복
- commons 폴더 없음
- 컴포넌트별 prompts 폴더 불완전
- 타입 정의 분산
- hooks 폴더 없음

### 목표 (코드캠프 스타일)
```
Museyou/
├── app/                          # 메인 페이지 (Vite 진입점)
│   ├── page.tsx                  # 홈 페이지
│   ├── performances/             # 공연 페이지
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── matching/                 # 매칭 페이지
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
│
├── components/                   # 컴포넌트 (코드캠프 패턴)
│   ├── auth/                     # 인증 컴포넌트
│   │   ├── login/
│   │   │   ├── index.tsx
│   │   │   ├── hook.ts
│   │   │   ├── queries.ts
│   │   │   ├── styles.module.css
│   │   │   └── prompts/
│   │   │       ├── 01.wireframe.txt
│   │   │       ├── 02.ui.txt
│   │   │       └── 03.func.txt
│   │   └── signup/
│   │       └── (동일 구조)
│   │
│   ├── performances/             # 공연 컴포넌트
│   │   ├── performance-detail/
│   │   │   ├── index.tsx
│   │   │   ├── hook.ts
│   │   │   ├── queries.ts
│   │   │   ├── styles.module.css
│   │   │   └── prompts/
│   │   ├── performance-list/
│   │   └── performance-card/
│   │
│   ├── matching/                 # 매칭 컴포넌트
│   ├── boards/                   # 게시판 컴포넌트
│   │
│   ├── common/                   # 공통 컴포넌트
│   │   ├── navigation-bar/
│   │   │   ├── index.tsx
│   │   │   ├── styles.module.css
│   │   │   └── prompts/
│   │   ├── layout-wrapper/
│   │   ├── bottom-nav/
│   │   └── README.md
│   │
│   └── ui/                       # shadcn/ui 컴포넌트
│
├── commons/                      # 공통 유틸 (코드캠프 스타일)
│   ├── api/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePerformance.ts
│   │   └── useInfiniteScroll.ts
│   │
│   ├── stores/
│   │   ├── auth.store.ts
│   │   ├── performance.store.ts
│   │   └── prompts/
│   │       └── store-guide.txt
│   │
│   ├── types/
│   │   ├── performance.ts
│   │   ├── user.ts
│   │   └── common.ts
│   │
│   └── utils/
│       ├── format.ts
│       ├── validation.ts
│       └── storage.ts
│
├── lib/                          # 외부 라이브러리 설정
│   ├── supabase/
│   │   └── client.ts
│   └── utils/
│       └── cn.ts
│
├── assets/                       # 정적 파일
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── public/                       # Public 파일
│
├── docs/                         # 문서 (코드캠프 스타일)
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── REFACTORING_GUIDE.md
│   └── CONTRIBUTING.md
│
├── .cursor/                      # AI 코딩 규칙
│   └── rules/
│       ├── 00-principle.mdc
│       ├── 01-common.mdc
│       ├── 02-wireframe.mdc
│       ├── 03-ui.mdc
│       ├── 04-func.mdc
│       └── code-quality.mdc
│
├── README.md
├── STRUCTURE_MIGRATION_PLAN.md  # 이 파일
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 마이그레이션 단계

### Phase 1: 폴더 구조 생성 (10분)

```bash
# 1. commons 폴더 생성
mkdir -p commons/api
mkdir -p commons/hooks
mkdir -p commons/stores/prompts
mkdir -p commons/types
mkdir -p commons/utils

# 2. components 재구성
mkdir -p components/auth/login/prompts
mkdir -p components/auth/signup/prompts

mkdir -p components/performances/performance-detail/prompts
mkdir -p components/performances/performance-list/prompts
mkdir -p components/performances/performance-card/prompts

mkdir -p components/matching/matching-card/prompts
mkdir -p components/matching/user-profile/prompts

mkdir -p components/boards/board-detail/prompts
mkdir -p components/boards/board-list/prompts
mkdir -p components/boards/board-new/prompts

mkdir -p components/common/navigation-bar/prompts
mkdir -p components/common/layout-wrapper
mkdir -p components/common/bottom-nav/prompts

# 3. app 페이지 구조
mkdir -p app/performances/[id]
mkdir -p app/matching
mkdir -p app/boards/[id]
mkdir -p app/login
mkdir -p app/signup

# 4. docs 폴더
mkdir -p docs

# 5. assets 폴더
mkdir -p assets/icons
mkdir -p assets/images
mkdir -p assets/fonts
```

### Phase 2: 파일 이동 및 재구성 (30분)

#### 2-1. store → commons/stores
```bash
# 기존 store 폴더 이동
mv app/src/store/* commons/stores/
```

#### 2-2. types 통합 → commons/types
```bash
# 기존 types 파일들 이동
mv app/src/types/* commons/types/ 2>/dev/null || true
```

#### 2-3. lib/api → commons/api
```bash
# API 관련 파일 이동
cp app/src/lib/api/* commons/api/
```

#### 2-4. 컴포넌트 재구성

**인증 컴포넌트:**
```bash
# app/src/components/auth → components/auth
mv app/src/components/auth/AuthDialog.tsx components/auth/login/index.tsx
```

**공연 컴포넌트:**
```bash
# app/src/components/performances → components/performances
mv app/src/components/performances/PerformanceDetail.tsx components/performances/performance-detail/index.tsx
mv app/src/components/performances/PerformanceCard.tsx components/performances/performance-card/index.tsx
mv app/src/components/performances/styles.module.css components/performances/performance-detail/styles.module.css
```

**공통 컴포넌트:**
```bash
# navigation 이미 있음
# 추가 공통 컴포넌트 정리
```

### Phase 3: 파일 생성 (코드캠프 패턴) (1시간)

각 컴포넌트마다 다음 파일 생성:

#### 표준 컴포넌트 구조
```
component-name/
├── index.tsx                    # 메인 컴포넌트
├── hook.ts                      # 비즈니스 로직 훅
├── queries.ts                   # API 쿼리 (Supabase)
├── styles.module.css            # 스타일
└── prompts/
    ├── 01.wireframe.txt         # 와이어프레임
    ├── 02.ui.txt                # UI 디자인
    └── 03.func.txt              # 기능 명세
```

---

## 📝 생성할 파일 목록

### A. 공통 파일 (commons/)

#### commons/api/
```typescript
// commons/api/client.ts
import { supabase } from '@/lib/supabase/client';

export const api = {
  // API 클라이언트 설정
};

// commons/api/queries.ts
export const QUERIES = {
  FETCH_PERFORMANCES: 'fetchPerformances',
  FETCH_PERFORMANCE: 'fetchPerformance',
  // ...
};

// commons/api/mutations.ts
export const MUTATIONS = {
  CREATE_REVIEW: 'createReview',
  UPDATE_PROFILE: 'updateProfile',
  // ...
};
```

#### commons/hooks/
```typescript
// commons/hooks/useAuth.ts
export function useAuth() {
  // 인증 관련 로직
}

// commons/hooks/usePerformance.ts
export function usePerformance(id: string) {
  // 공연 관련 로직
}

// commons/hooks/useInfiniteScroll.ts
export function useInfiniteScroll() {
  // 무한 스크롤 로직
}
```

#### commons/types/
```typescript
// commons/types/performance.ts
export interface Performance {
  id: string;
  title: string;
  date: string;
  venue: string;
  // ...
}

// commons/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  // ...
}

// commons/types/common.ts
export interface ApiResponse<T> {
  data: T;
  error: Error | null;
}
```

#### commons/utils/
```typescript
// commons/utils/format.ts
export function formatDate(date: string): string {
  // 날짜 포맷팅
}

// commons/utils/validation.ts
export function validateEmail(email: string): boolean {
  // 이메일 검증
}

// commons/utils/storage.ts
export function getStorageUrl(path: string, bucket: string): string {
  // Supabase Storage URL
}
```

### B. 컴포넌트 파일

#### components/auth/login/
```typescript
// index.tsx
export function LoginForm() {
  const { login, isLoading } = useLoginForm();
  // ...
}

// hook.ts
export function useLoginForm() {
  // 로그인 폼 로직
}

// queries.ts
export const loginUser = async (email: string, password: string) => {
  // Supabase auth
};

// prompts/01.wireframe.txt
// 와이어프레임 내용

// prompts/02.ui.txt
// UI 디자인 내용

// prompts/03.func.txt
// 기능 명세 내용
```

### C. 페이지 파일 (app/)

```typescript
// app/page.tsx
export default function HomePage() {
  return <HomePage />;
}

// app/performances/page.tsx
export default function PerformancesPage() {
  return <PerformanceList />;
}

// app/performances/[id]/page.tsx
export default function PerformanceDetailPage() {
  return <PerformanceDetail />;
}
```

### D. 문서 파일 (docs/)

```markdown
# docs/DEVELOPMENT_WORKFLOW.md
# 개발 워크플로우

# docs/REFACTORING_GUIDE.md
# 리팩토링 가이드

# docs/CONTRIBUTING.md
# 기여 가이드
```

---

## 🔄 마이그레이션 스크립트

자동화 스크립트 생성:

```bash
#!/bin/bash
# setup-structure.sh

echo "🚀 MuseYou 폴더 구조 재편성 시작..."

# 1. 폴더 생성
echo "📁 폴더 생성 중..."
mkdir -p commons/{api,hooks,stores/prompts,types,utils}
mkdir -p components/auth/{login,signup}/prompts
mkdir -p components/performances/{performance-detail,performance-list,performance-card}/prompts
mkdir -p components/matching/{matching-card,user-profile}/prompts
mkdir -p components/boards/{board-detail,board-list,board-new}/prompts
mkdir -p components/common/{navigation-bar,layout-wrapper,bottom-nav}/prompts
mkdir -p app/{performances/[id],matching,boards/[id],login,signup}
mkdir -p docs
mkdir -p assets/{icons,images,fonts}

# 2. 파일 이동
echo "📦 파일 이동 중..."

# store 이동
if [ -d "app/src/store" ]; then
  cp -r app/src/store/* commons/stores/ 2>/dev/null || true
fi

# types 이동
if [ -d "app/src/types" ]; then
  cp -r app/src/types/* commons/types/ 2>/dev/null || true
fi

# README 생성
echo "📝 README 파일 생성 중..."
touch components/common/README.md
touch commons/README.md

# 3. prompts 템플릿 생성
echo "📋 prompts 템플릿 생성 중..."
for dir in components/auth/login components/auth/signup; do
  if [ -d "$dir/prompts" ]; then
    touch "$dir/prompts/01.wireframe.txt"
    touch "$dir/prompts/02.ui.txt"
    touch "$dir/prompts/03.func.txt"
  fi
done

echo "✅ 폴더 구조 재편성 완료!"
echo ""
echo "📌 다음 단계:"
echo "1. 파일 내용 이동 및 수정"
echo "2. import 경로 업데이트"
echo "3. vite.config.ts 별칭 설정"
echo "4. tsconfig.json paths 설정"
```

---

## ⚙️ 설정 파일 업데이트

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/src'),
      '@components': path.resolve(__dirname, './components'),
      '@commons': path.resolve(__dirname, './commons'),
      '@lib': path.resolve(__dirname, './lib'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/src/*"],
      "@components/*": ["./components/*"],
      "@commons/*": ["./commons/*"],
      "@lib/*": ["./lib/*"],
      "@assets/*": ["./assets/*"]
    }
  }
}
```

---

## 📊 마이그레이션 체크리스트

### Phase 1: 준비 (1일)
- [ ] 백업 생성 (git commit)
- [ ] 폴더 구조 생성
- [ ] 설정 파일 업데이트

### Phase 2: 파일 이동 (2일)
- [ ] commons/ 폴더 구성
  - [ ] stores 이동
  - [ ] types 통합
  - [ ] hooks 통합
  - [ ] utils 정리

- [ ] components/ 재구성
  - [ ] auth 컴포넌트
  - [ ] performances 컴포넌트
  - [ ] matching 컴포넌트
  - [ ] boards 컴포넌트
  - [ ] common 컴포넌트

### Phase 3: 파일 생성 (3일)
- [ ] 각 컴포넌트에 hook.ts 생성
- [ ] 각 컴포넌트에 queries.ts 생성
- [ ] prompts 파일 작성
  - [ ] auth (login, signup)
  - [ ] performances (detail, list, card)
  - [ ] matching (card, profile)
  - [ ] boards (detail, list, new)
  - [ ] common (navigation, bottom-nav)

### Phase 4: import 경로 업데이트 (1일)
- [ ] 모든 import 문 수정
- [ ] 빌드 에러 수정
- [ ] 타입 에러 수정

### Phase 5: 문서화 (1일)
- [ ] README.md 재작성
- [ ] DEVELOPMENT_WORKFLOW.md
- [ ] docs/ 폴더 문서들

### Phase 6: 테스트 & 정리 (1일)
- [ ] `npm run dev` 실행 확인
- [ ] `npm run build` 성공 확인
- [ ] 불필요한 파일 삭제
- [ ] Git 커밋

---

## 🎯 예상 소요 시간

| 단계 | 작업 | 예상 시간 |
|-----|------|----------|
| Phase 1 | 폴더 구조 생성 | 0.5일 |
| Phase 2 | 파일 이동 | 1일 |
| Phase 3 | 파일 생성 | 2일 |
| Phase 4 | import 업데이트 | 1일 |
| Phase 5 | 문서화 | 1일 |
| Phase 6 | 테스트 & 정리 | 0.5일 |
| **총계** | | **6일** |

---

## 💡 주의사항

1. **백업 필수**
   ```bash
   git add .
   git commit -m "backup: 구조 변경 전 백업"
   git branch backup-before-restructure
   ```

2. **점진적 마이그레이션**
   - 한 번에 모든 파일을 이동하지 말 것
   - 컴포넌트별로 하나씩 마이그레이션
   - 각 단계마다 빌드 확인

3. **import 경로 주의**
   - 상대 경로 → 절대 경로로 변경
   - `@` 별칭 사용

4. **기존 기능 유지**
   - 기능이 깨지지 않도록 테스트
   - 이동 후 즉시 확인

---

## 🚀 시작하기

```bash
# 1. 백업
git add .
git commit -m "backup: before structure migration"

# 2. 스크립트 실행
chmod +x setup-structure.sh
./setup-structure.sh

# 3. 파일 이동 시작
# (단계별로 진행)

# 4. 빌드 확인
npm run dev
npm run build
```

---

**다음 단계 선택:**

1. ✅ **자동 스크립트 실행** - 폴더 구조 먼저 생성
2. ✅ **수동 마이그레이션** - 단계별로 하나씩 진행
3. ✅ **특정 컴포넌트만** - 예: performances 컴포넌트만 먼저

어떤 방식으로 진행하시겠습니까?

