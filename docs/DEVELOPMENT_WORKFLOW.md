# 🛠️ MuseYou 개발 워크플로우 가이드

> "다시는 같은 실수를 반복하지 않기 위한 실천 매뉴얼"

---

## 📋 목차

1. [새 기능 개발 전 체크리스트](#새-기능-개발-전-체크리스트)
2. [코딩 중 지켜야 할 원칙](#코딩-중-지켜야-할-원칙)
3. [PR 제출 전 체크리스트](#pr-제출-전-체크리스트)
4. [일일 루틴](#일일-루틴)
5. [주간 루틴](#주간-루틴)
6. [긴급 상황 대응](#긴급-상황-대응)

---

## 🎯 새 기능 개발 전 체크리스트

### 1단계: 설계 (5분 투자)

```
[ ] 비슷한 기능이 이미 존재하는가?
    → YES: 기존 코드 재사용 방법 고민
    → NO: 다음 단계로

[ ] 이 기능이 다른 곳에서도 쓰일 가능성이 있는가?
    → YES: 처음부터 재사용 가능하게 설계 (components/common/)
    → NO: 특정 기능 폴더에 배치

[ ] 타입 정의가 명확한가?
    → API 응답 구조는?
    → Props 타입은?
    → 상태 타입은?
```

### 2단계: 문서 확인

```
[ ] .cursor/rules/ 관련 가이드 읽기
    → 00-principle.mdc (개발 원칙)
    → 해당 Phase mdc 파일

[ ] 관련 컴포넌트 prompts/ 폴더 확인
    → 01.wireframe.txt
    → 02.ui.txt
    → 03.func.txt

[ ] 유사 컴포넌트 코드 참고
```

### 3단계: 구조 설계

#### 컴포넌트 분리 기준
```tsx
// ❌ Bad: 하나의 거대한 컴포넌트 (500줄)
function PerformancePage() {
  // 공연 정보 표시
  // 리뷰 CRUD
  // 좋아요 기능
  // 공유 기능
  // ... (500줄)
}

// ✅ Good: 역할별 분리
function PerformancePage() {
  return (
    <>
      <PerformanceInfo performance={performance} />
      <PerformanceActions 
        onLike={handleLike}
        onShare={handleShare}
      />
      <ReviewSection reviews={reviews} />
    </>
  );
}
```

**분리 기준:**
- 파일 300줄 넘어가면 분리 검토
- 독립적인 기능은 별도 컴포넌트로
- 재사용 가능성 있으면 `components/common/`으로

---

## 💻 코딩 중 지켜야 할 원칙

### 원칙 1: "any 금지령"

```typescript
// ❌ 절대 안 됨
const data: any = await fetchData();

// ✅ 5분 투자해서 타입 정의
interface Performance {
  id: string;
  title: string;
  date: string;
  venue: string;
  image_url: string | null;
}

const data: Performance[] = await fetchData();
```

**any를 쓰고 싶을 때 하는 질문:**
1. "이 데이터 구조를 정확히 아는가?" → YES면 타입 정의
2. "5분 안에 타입 정의 가능한가?" → YES면 지금 하기
3. "정말 모르는가?" → Supabase 스키마 확인 또는 `unknown` 사용

### 원칙 2: "3번째 복사는 리팩토링"

```
1번째 복사: "일단 작동하게 만들자" ✅
2번째 복사: "흠... 비슷한데?" 🤔
3번째 복사: "🚨 즉시 공통화!" ⛔
```

**즉시 리팩토링 신호:**
- 같은 코드 블록을 3번 복사하려고 할 때
- 파일 이름이 `-new`, `-edit`, `-create` 같은 패턴일 때
- "나중에 합치지 뭐"라는 생각이 들 때 → **바로 지금!**

### 원칙 3: "shadcn/ui 우선 활용"

```tsx
// ❌ Bad: 직접 구현
function CustomButton({ children, onClick }) {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ✅ Good: shadcn/ui 활용
import { Button } from "@/components/ui/button";

<Button variant="default" onClick={onClick}>
  {children}
</Button>
```

**shadcn/ui 사용 이점:**
- 접근성 (a11y) 기본 제공
- 일관된 디자인 시스템
- 키보드 네비게이션 지원
- 커스터마이징 가능

### 원칙 4: "컴포넌트 구조 표준화"

```
component-name/
├── index.tsx                # 메인 컴포넌트
├── hook.ts                  # 비즈니스 로직
├── queries.ts               # Supabase 쿼리
├── styles.module.css        # 스타일 (필요시)
└── prompts/
    ├── 01.wireframe.txt
    ├── 02.ui.txt
    └── 03.func.txt
```

---

## ✅ PR 제출 전 체크리스트

### 자동 검사 (1분)
```bash
# ESLint 에러 확인
pnpm lint

# TypeScript 타입 체크
npx tsc --noEmit

# 빌드 테스트
pnpm build
```

### 수동 검사 (5분)

```
[ ] any 타입이 남아있는가?
    → grep -r "as any" app/src/
    → grep -r ": any" app/src/

[ ] console.log가 남아있는가?
    → grep -r "console.log" app/src/

[ ] 주석 처리된 코드가 있는가?
    → // const oldCode = ...
    → 모두 삭제!

[ ] 중복 코드가 있는가?
    → 같은 로직이 2곳 이상에 있으면 공통화

[ ] 파일 길이가 300줄 넘는가?
    → 컴포넌트 분리 검토

[ ] 변수명이 의미있는가?
    → data1, temp, tmp, test ❌
    → performances, userProfile, reviewContent ✅

[ ] import 정리가 되어있는가?
    → 사용하지 않는 import 제거
    → VSCode: Shift+Alt+O (정리)

[ ] prompts 파일 업데이트했는가?
    → 주요 변경사항 기록
```

---

## 🔄 일일 루틴

### 오전 (시작 전 5분)
```
1. .cursor/rules/ 관련 파일 읽기
   - 오늘 작업할 Phase의 mdc 파일

2. 오늘 만들 기능 간단히 설계하기
   - 타입은?
   - 어떤 컴포넌트로 나눌까?
   - 재사용 가능한 부분은?

3. 어제 남긴 TODO 확인
```

### 코딩 중
```
❓ any를 쓰려고 할 때
→ 06-all-test.mdc 열어보기
→ 5분 투자해서 타입 정의

❓ 코드를 복사하려고 할 때
→ "세 번째 복사인가?"
→ YES면 즉시 공통화

❓ 파일이 길어질 때
→ "300줄 넘었나?"
→ YES면 컴포넌트 분리

❓ Supabase 쿼리 작성할 때
→ 에러 처리 포함했나?
→ 타입 정의했나?
```

### 저녁 (마무리 전 10분)
```
1. ESLint 경고 모두 해결
   pnpm lint

2. TypeScript 에러 모두 해결
   npx tsc --noEmit

3. PR 체크리스트 확인

4. 내일 할 일 메모
   - TODO 주석 또는 이슈 생성
```

---

## 📅 주간 루틴

### 매주 일요일 (30분)

#### 1. 코드 리뷰 (15분)
```
이번 주 작성한 코드 파일 열어보기
→ 개선할 부분 찾기
→ 리팩토링 TODO 작성

체크 포인트:
- 중복 코드 있나?
- any 타입 사용했나?
- 300줄 넘는 파일 있나?
- 테스트 필요한 부분은?
```

#### 2. 학습 내용 정리 (10분)
```
새로 배운 패턴 있나?
→ prompts/ 파일에 추가
→ 팀원과 공유

실수한 부분 있나?
→ 왜 실수했는지 분석
→ 방지 방법 문서화
```

#### 3. Next Week Planning (5분)
```
다음 주 목표 설정
→ 리팩토링할 레거시 코드
→ 새로 배우고 싶은 기술
→ 개선할 기능

GitHub Issues 정리
→ 우선순위 조정
→ 마일스톤 확인
```

---

## 🚨 긴급 상황 대응

### "any를 써야만 할 것 같은데요?"

```
1. 정말로 타입을 모르는가?
   → Supabase Dashboard에서 테이블 스키마 확인
   → Supabase SQL Editor로 데이터 구조 확인

2. 타입이 너무 복잡한가?
   → 일단 unknown 사용
   → 타입 가드 함수 작성
   
   function isPerformance(value: unknown): value is Performance {
     return (
       typeof value === 'object' &&
       value !== null &&
       'id' in value &&
       'title' in value
     );
   }

3. 외부 라이브러리 타입이 없는가?
   → @types/[library-name] 설치 확인
   → 없으면 declare module 사용
```

### "코드가 너무 길어요 (500줄+)"

```
1. 독립적인 기능 찾기
   → 예: 댓글 섹션, 필터 섹션, 정보 표시 섹션

2. 별도 컴포넌트로 추출
   → components/[feature]/[SubComponent].tsx

3. 비즈니스 로직을 훅으로 분리
   → hooks/use[Feature].ts
   
   // hook.ts
   export function usePerformanceDetail(id: string) {
     // 모든 비즈니스 로직
     return { performance, isLoading, error, ... };
   }
```

### "중복 코드를 발견했는데 이미 PR을 올렸어요"

```
1. 즉시 리팩토링 PR 생성
   제목: "refactor: [기능] 중복 코드 제거"

2. 왜 중복이 생겼는지 분석
   → 설계 단계에서 놓친 부분은?
   → 어떻게 예방할 수 있었나?

3. 문서 업데이트
   → prompts/ 파일에 교훈 추가
```

### "빌드가 안 돼요"

```
1. 에러 메시지 확인
   npm run build
   
2. 타입 에러
   → npx tsc --noEmit
   → 에러 위치 확인 및 수정

3. Import 에러
   → 경로 확인 (@commons, @components)
   → vite.config.ts alias 확인

4. 의존성 문제
   → node_modules 삭제 후 재설치
   rm -rf node_modules
   pnpm install
```

---

## 💡 실전 예제

### 케이스 1: 공연 상세 페이지 개발

#### ❌ Bad Approach
```tsx
// 1. 하나의 거대한 컴포넌트 작성 (500줄)
// components/performances/PerformanceDetail.tsx

function PerformanceDetail() {
  // 공연 정보, 리뷰, 좋아요, 공유 등 모든 로직
  // ... 500줄
}
```

#### ✅ Good Approach
```tsx
// 1. 설계 단계에서 컴포넌트 분리 계획

components/performances/performance-detail/
├── index.tsx              # 메인 (조립)
├── PerformanceInfo.tsx    # 공연 정보
├── PerformanceActions.tsx # 좋아요, 공유
├── ReviewSection.tsx      # 리뷰 목록
├── ReviewForm.tsx         # 리뷰 작성
├── hook.ts               # 비즈니스 로직
├── queries.ts            # Supabase 쿼리
└── prompts/

// 2. 메인 컴포넌트는 조립만
function PerformanceDetail({ id }) {
  const { performance, reviews, ... } = usePerformanceDetail(id);

  return (
    <>
      <PerformanceInfo performance={performance} />
      <PerformanceActions 
        onLike={handleLike}
        onShare={handleShare}
      />
      <ReviewSection reviews={reviews} />
      <ReviewForm onSubmit={handleReviewSubmit} />
    </>
  );
}

// 결과: 각 파일 150줄 이하, 유지보수 용이
```

### 케이스 2: API 타입 정의

#### ❌ Bad Approach
```typescript
// any 남발
const response: any = await supabase
  .from('performances')
  .select('*');
const data: any = response.data;
```

#### ✅ Good Approach
```typescript
// 1. Supabase Dashboard에서 스키마 확인

// 2. 타입 정의 (commons/types/performance.ts)
export interface Performance {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  image_url: string | null;
  category: 'classic' | 'theater' | 'musical' | 'exhibition';
  status: 'upcoming' | 'ongoing' | 'ended';
  created_at: string;
  updated_at: string;
}

// 3. 사용
const { data, error } = await supabase
  .from('performances')
  .select('*')
  .returns<Performance[]>();

if (error) throw error;
// data는 이제 Performance[] 타입!
```

---

## 📚 추천 학습 자료

### 매일 5분 (출근길/점심시간)
- [React 공식 문서](https://react.dev/) - 1챕터씩
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/) - 1섹션씩

### 주말 30분
- [Refactoring Guru](https://refactoring.guru/) - 리팩토링 패턴 학습
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Supabase 튜토리얼](https://supabase.com/docs)

### 월 1회 (2시간)
- 오픈소스 코드 읽기
  - shadcn/ui 저장소
  - Supabase 예제 프로젝트
- 컨퍼런스 영상 시청
  - React Conf
  - TypeScript Conf

---

## 🎓 레벨업 로드맵

### Junior → Mid-level (현재 목표)
- [x] DRY 원칙 적용
- [x] TypeScript any 제거
- [ ] 테스트 코드 작성
- [ ] 성능 최적화 (React.memo, useMemo)
- [ ] 접근성 개선 (ARIA, Semantic HTML)

### Mid-level → Senior
- [ ] 아키텍처 설계
- [ ] 코드 리뷰어 역할
- [ ] 기술 문서 작성
- [ ] 팀 개발 프로세스 개선

---

## 🔗 유용한 링크

### 개발 도구
- [TypeScript Playground](https://www.typescriptlang.org/play) - 타입 실험
- [Supabase Dashboard](https://app.supabase.com/) - DB 관리
- [shadcn/ui](https://ui.shadcn.com/) - 컴포넌트

### 커뮤니티
- [React Korea](https://www.facebook.com/groups/react.ko/)
- [TypeScript Korea](https://www.facebook.com/groups/ts.korea)

---

## ⚡ 빠른 참조

```bash
# 프로젝트 시작
cd app && pnpm dev

# 코드 품질 체크
pnpm lint          # ESLint
npx tsc --noEmit   # TypeScript
pnpm build         # 빌드 테스트

# any 타입 찾기
grep -r "as any" app/src/
grep -r ": any" app/src/

# console.log 찾기
grep -r "console.log" app/src/

# 300줄 넘는 파일 찾기
find app/src -name "*.tsx" -exec wc -l {} \; | awk '$1 > 300 {print $2, $1}'
```

---

**마지막 조언:**

> 완벽한 코드는 없습니다.
> 하지만 매일 조금씩 나아지는 코드는 있습니다.
>
> "나중에"는 오지 않습니다.
> **지금 당장 5분 투자하세요!**

---

**작성일:** 2025-11-25  
**버전:** 1.0  
**다음 업데이트:** 새로운 패턴 발견 시마다 추가

