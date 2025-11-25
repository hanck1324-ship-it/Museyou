# 네비게이션 구현 계획

## 📁 파일 구조

```
app/src/components/common/navigation/
├── prompts/                          # 프롬프트 문서
│   ├── 00-implementation-plan.md     # ✅ 이 파일
│   ├── 01-wireframe.md               # ✅ 완료
│   ├── 02-ui.md                      # ✅ 완료
│   └── 03-func.md                    # ✅ 완료
│
├── types/                            # 타입 정의
│   └── navigation.types.ts           # ⬜ 생성 필요
│
├── hooks/                            # 커스텀 훅
│   └── useNavigation.ts              # ⬜ 생성 필요
│
├── config/                           # 설정 파일
│   └── navigation.config.ts          # ⬜ 생성 필요
│
├── components/                       # 하위 컴포넌트
│   └── NavigationItem.tsx            # ⬜ 생성 필요
│
├── styles/                           # 스타일 (선택사항)
│   └── navigation.module.css         # ⬜ 선택적 생성
│
├── Navigation.tsx                    # ⬜ 메인 컴포넌트
├── index.ts                          # ⬜ export 파일
└── README.md                         # ⬜ 컴포넌트 문서
```

## 🔨 구현 순서 및 작업 내용

### 1단계: 타입 정의 (types/navigation.types.ts)
**작업 내용:**
- [ ] `NavigationItem` 인터페이스 정의
  - id, label, icon, path 속성
  - requiresAuth, badge, disabled 옵션
- [ ] `NavigationProps` 인터페이스 정의
  - items, variant, className, onItemClick
- [ ] `NavigationItemProps` 인터페이스 정의
  - item, isActive, onClick

**의존성:**
- 없음 (가장 먼저 작업)

**예상 코드 라인:** ~50 줄

---

### 2단계: 네비게이션 설정 (config/navigation.config.ts)
**작업 내용:**
- [ ] 네비게이션 아이템 배열 정의
  - 홈 (/, Home 아이콘)
  - 공연 (/performances, Music 아이콘)
  - 매칭 (/matching, Heart 아이콘, 로그인 필요)
  - 마이페이지 (/profile, User 아이콘, 로그인 필요)
- [ ] lucide-react 아이콘 import
- [ ] export default 설정

**의존성:**
- navigation.types.ts
- lucide-react 패키지

**예상 코드 라인:** ~30 줄

**필요 패키지:**
```bash
npm install lucide-react
# 또는
pnpm add lucide-react
```

---

### 3단계: 커스텀 훅 (hooks/useNavigation.ts)
**작업 내용:**
- [ ] `useNavigation` 훅 구현
  - 현재 활성 아이템 판단 (useLocation 활용)
  - 권한 기반 필터링 (useAuth 활용)
  - 네비게이션 핸들러 함수
  - isActive 헬퍼 함수
- [ ] React Router 연동
- [ ] 인증 상태 체크

**의존성:**
- navigation.types.ts
- react-router-dom
- @/components/auth/hooks/useAuth (또는 인증 훅)

**예상 코드 라인:** ~60 줄

**필요 패키지:**
```bash
npm install react-router-dom
# 또는
pnpm add react-router-dom
```

---

### 4단계: 네비게이션 아이템 컴포넌트 (components/NavigationItem.tsx)
**작업 내용:**
- [ ] NavigationItem 컴포넌트 구현
  - 아이콘 렌더링 (24x24px)
  - 라벨 텍스트 표시 (12px)
  - 활성 상태 스타일링
  - 활성 인디케이터 (상단 바)
  - 배지 표시 (선택사항)
- [ ] Tailwind CSS 클래스 적용
  - 기본 상태: text-gray-500
  - 활성 상태: text-primary-600
  - 호버 효과: hover:bg-gray-50
- [ ] 접근성 속성
  - aria-label
  - aria-current
  - button 역할

**의존성:**
- navigation.types.ts
- @/lib/utils (cn 함수)

**예상 코드 라인:** ~80 줄

---

### 5단계: 메인 네비게이션 컴포넌트 (Navigation.tsx)
**작업 내용:**
- [ ] Navigation 컴포넌트 구현
  - 컨테이너 레이아웃 (fixed bottom)
  - variant 지원 (bottom/top/sidebar)
  - 네비게이션 아이템 리스트 렌더링
  - 반응형 스타일 적용
- [ ] useNavigation 훅 사용
- [ ] NavigationItem 컴포넌트 매핑
- [ ] 다크모드 지원
- [ ] safe-area-inset 처리 (모바일)

**의존성:**
- navigation.types.ts
- navigation.config.ts
- useNavigation.ts
- NavigationItem.tsx
- @/lib/utils (cn 함수)

**예상 코드 라인:** ~100 줄

---

### 6단계: Export 파일 (index.ts)
**작업 내용:**
- [ ] 메인 컴포넌트 export
- [ ] 타입 re-export
- [ ] 설정 re-export

**의존성:**
- 모든 구현 완료 후

**예상 코드 라인:** ~10 줄

```typescript
export { Navigation } from './Navigation';
export { NavigationItem } from './components/NavigationItem';
export { useNavigation } from './hooks/useNavigation';
export { navigationConfig } from './config/navigation.config';
export type * from './types/navigation.types';
```

---

## 🎨 스타일 작업

### Tailwind CSS 설정
**파일:** `tailwind.config.js`

**작업 내용:**
- [ ] primary 컬러 정의 확인
- [ ] safe-area 플러그인 설치 (선택사항)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... 중략
          600: '#0284c7', // 메인 컬러
        }
      }
    }
  }
}
```

### CSS 모듈 (선택사항)
**파일:** `styles/navigation.module.css`

복잡한 애니메이션이나 특수 효과가 필요한 경우에만 사용

---

## 🔗 통합 작업

### App.tsx 또는 Layout 컴포넌트
**파일:** `app/src/App.tsx` 또는 레이아웃 파일

**작업 내용:**
- [ ] Navigation 컴포넌트 import
- [ ] 레이아웃에 추가
- [ ] 하단 여백 추가 (pb-16 또는 mb-16)

```typescript
import { Navigation } from '@/components/common/navigation';

function App() {
  return (
    <div className="min-h-screen pb-16">
      <main>
        {/* 페이지 콘텐츠 */}
      </main>
      
      <Navigation variant="bottom" />
    </div>
  );
}
```

### React Router 설정
**파일:** `app/src/main.tsx` 또는 라우터 설정 파일

**작업 내용:**
- [ ] BrowserRouter 설정 확인
- [ ] 라우트 정의
  - `/` → HomePage
  - `/performances` → PerformancesPage
  - `/matching` → MatchingPage
  - `/profile` → ProfilePage

---

## 📦 필요한 패키지

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "lucide-react": "^0.300.0",
    "tailwindcss": "^3.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

**설치 명령:**
```bash
pnpm add react-router-dom lucide-react clsx tailwind-merge
```

---

## 🧪 테스트 (선택사항)

### 테스트 파일
**파일:** `__tests__/Navigation.test.tsx`

**작업 내용:**
- [ ] 렌더링 테스트
- [ ] 네비게이션 클릭 테스트
- [ ] 활성 상태 테스트
- [ ] 권한 기반 필터링 테스트

---

## ✅ 체크리스트

### 필수 작업
- [ ] 1. 타입 정의 작성
- [ ] 2. 네비게이션 설정 작성
- [ ] 3. useNavigation 훅 구현
- [ ] 4. NavigationItem 컴포넌트 구현
- [ ] 5. Navigation 메인 컴포넌트 구현
- [ ] 6. index.ts export 파일 작성
- [ ] 7. 패키지 설치 (lucide-react, react-router-dom)
- [ ] 8. App에 통합
- [ ] 9. 라우터 설정

### 스타일 작업
- [ ] 10. Tailwind primary 색상 확인
- [ ] 11. 다크모드 스타일 추가
- [ ] 12. 반응형 스타일 테스트
- [ ] 13. 애니메이션 효과 추가

### 접근성 & 최적화
- [ ] 14. ARIA 라벨 적용
- [ ] 15. 키보드 네비게이션 테스트
- [ ] 16. React.memo 최적화
- [ ] 17. 모바일 safe-area 처리

### 문서화
- [ ] 18. README.md 작성
- [ ] 19. 컴포넌트 주석 추가
- [ ] 20. 사용 예시 문서화

---

## 📝 예상 작업 시간

| 단계 | 작업 | 예상 시간 |
|-----|------|----------|
| 1 | 타입 정의 | 15분 |
| 2 | 설정 파일 | 10분 |
| 3 | 커스텀 훅 | 30분 |
| 4 | NavigationItem | 45분 |
| 5 | Navigation 메인 | 60분 |
| 6 | Export & 통합 | 20분 |
| 7 | 스타일링 & 반응형 | 40분 |
| 8 | 테스트 & 버그 수정 | 30분 |
| **총계** | | **~4시간** |

---

## 🚀 시작하기

### 바로 시작하려면:

```bash
# 1. 패키지 설치
pnpm add react-router-dom lucide-react

# 2. 파일 생성 (순서대로)
touch app/src/components/common/navigation/types/navigation.types.ts
touch app/src/components/common/navigation/config/navigation.config.ts
touch app/src/components/common/navigation/hooks/useNavigation.ts
touch app/src/components/common/navigation/components/NavigationItem.tsx
touch app/src/components/common/navigation/Navigation.tsx
touch app/src/components/common/navigation/index.ts

# 3. 구현 시작!
```

다음 단계로 각 파일을 구현해드릴까요?


