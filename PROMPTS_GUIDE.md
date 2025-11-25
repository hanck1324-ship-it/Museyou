# 🎨 MuseYou Prompts 가이드

> **핵심 전략:** 기존 기능을 유지하면서 프롬프트를 통해 점진적으로 개선합니다.

## 📚 문서 구조

```
MuseYou/
├── 📄 README.md                              # 프로젝트 소개
├── 📄 PROMPTS_GUIDE.md (이 파일)             # Prompts 사용 가이드
├── 📄 MUSEYOU_UPGRADE_PLAN.md                # 전체 업그레이드 계획
├── 📄 STRUCTURE_MIGRATION_PLAN.md            # 폴더 구조 마이그레이션 계획
│
├── 📂 .cursor/rules/                         # AI 코딩 규칙
│   ├── 00-principle.mdc                      # 개발 원칙
│   ├── 01-common.mdc                         # 공통 규칙
│   ├── 02-wireframe.mdc                      # 와이어프레임 단계
│   ├── 03-ui.mdc                             # UI 구현 단계
│   ├── 04-func.mdc                           # 기능 구현 단계
│   ├── 05-test.mdc                           # 테스트 단계
│   └── 06-all-test.mdc                       # 종합 테스트 + 코드 품질
│
├── 📂 docs/                                  # 문서
│   ├── COMPONENT_IMPROVEMENT_GUIDE.md        # 컴포넌트 개선 가이드
│   └── DEVELOPMENT_WORKFLOW.md               # 개발 워크플로우
│
└── 📂 components/                            # Prompts 모음
    ├── README.md                             # Components prompts 가이드
    ├── performances/
    │   ├── performance-card/
    │   │   └── prompts/
    │   │       ├── 01.wireframe.txt          # 레이아웃 구조
    │   │       ├── 02.ui.txt                 # 디자인 시스템
    │   │       └── 03.func.txt               # 기능 명세
    │   └── performance-detail/
    │       └── prompts/
    │           ├── 01.wireframe.txt
    │           └── 02.ui.txt
    ├── matching/
    │   └── matching-card/
    │       └── prompts/
    │           └── 01.wireframe.txt
    └── auth/
        └── auth-dialog/
            └── prompts/
                └── 01.wireframe.txt
```

## 🎯 Prompts 시스템 개요

### 목적
1. **기능 보존:** 기존 코드를 건드리지 않음
2. **방향 제시:** 각 컴포넌트의 개선 방향 문서화
3. **AI 활용:** AI 코딩 도구에 명확한 컨텍스트 제공
4. **단계적 개선:** Phase별 점진적 개선

### 3단계 Prompts 구조

#### 1️⃣ Wireframe (01.wireframe.txt)
**목적:** UI 구조 및 레이아웃 정의

**포함 내용:**
- 📐 레이아웃 다이어그램 (ASCII art)
- 🧩 구성 요소 목록
- 📱 반응형 breakpoint (모바일/태블릿/데스크톱)
- 🎨 상태별 UI (default/hover/active)
- 🎬 애니메이션 명세
- ♿ 접근성 요구사항

**예시:**
```
┌─────────────────────────────────┐
│   [공연 이미지]                   │
│   category badge (우측 상단)      │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  [공연 제목]          ⭐ [평점]  │
└─────────────────────────────────┘
```

#### 2️⃣ UI (02.ui.txt)
**목적:** 디자인 시스템 및 스타일 정의

**포함 내용:**
- 🎨 색상 팔레트 (Primary/Accent/Neutral)
- 📝 타이포그래피 (폰트 크기, weight, line height)
- 📏 간격 시스템 (padding, margin, gap)
- 🖼️ 아이콘 크기 및 색상
- 🌙 다크모드 대응
- ✨ 현재 구현 상태
- 💡 개선 제안

**예시:**
```css
/* Primary (Emerald) */
--emerald-500: #10b981
--emerald-600: #059669

/* Typography */
모바일: text-base (16px)
데스크톱: text-lg (18px)
```

#### 3️⃣ Func (03.func.txt)
**목적:** 기능 명세 및 API 연동 계획

**포함 내용:**
- 🔧 Props 인터페이스
- ⚙️ 주요 기능 목록
- 🎯 이벤트 처리
- 📊 상태 관리
- 🔌 API 연동 계획 (Supabase)
- 🚨 에러 처리
- 🧪 테스트 케이스
- 🗺️ 구현 로드맵

**예시:**
```typescript
interface Performance {
  id: string;
  title: string;
  category: string;
  // ...
}

// API 연동
async function toggleLike(userId: string, performanceId: string) {
  // Supabase 구현
}
```

## 🚀 사용 방법

### 1. 기본 워크플로우

```bash
# Step 1: 작업할 컴포넌트 선택
cd components/performances/performance-card/

# Step 2: Prompts 읽기
cat prompts/01.wireframe.txt
cat prompts/02.ui.txt
cat prompts/03.func.txt

# Step 3: AI에게 컨텍스트 제공
# Cursor에서:
# @components/performances/performance-card/prompts/03.func.txt
# 좋아요 기능을 구현해줘
```

### 2. 단계별 구현

#### Phase 1: Wireframe 구현
```
목표: UI 구조 및 레이아웃 구현

1. wireframe.txt 읽기
2. AI에게 요청:
   "@01.wireframe.txt 이 wireframe을 기반으로 
    기본 레이아웃을 구현해줘"
3. 반응형 breakpoint 적용
4. 상태별 UI 구현 (hover/active)
```

#### Phase 2: UI 스타일링
```
목표: 디자인 시스템 적용

1. ui.txt 읽기
2. AI에게 요청:
   "@02.ui.txt 이 디자인 시스템을 적용해서 
    스타일링해줘"
3. 색상 팔레트 적용
4. 타이포그래피 조정
5. 다크모드 대응
```

#### Phase 3: 기능 구현
```
목표: 실제 기능 및 API 연동

1. func.txt 읽기
2. AI에게 요청:
   "@03.func.txt 좋아요 기능을 구현해줘. 
    Supabase 연동 포함"
3. API 함수 작성
4. 상태 관리 Hook 구현
5. 에러 처리 추가
6. 테스트 작성
```

## 💡 AI 활용 팁

### ✅ 좋은 프롬프트 예시

```
# 구체적인 요청 + 컨텍스트 제공
@components/performances/performance-card/prompts/03.func.txt

위 문서의 "좋아요 기능" 섹션을 기반으로:
1. usePerformanceLike Hook을 구현해줘
2. Supabase likes 테이블과 연동
3. 낙관적 업데이트(Optimistic Update) 적용
4. 에러 처리 포함
5. TypeScript 타입 명확하게
```

```
# 개선 요청 시
@components/performances/performance-card/prompts/02.ui.txt

현재 PerformanceCard 컴포넌트에 다크모드를 적용해줘.
위 문서의 "다크모드 지원" 섹션을 참고해서:
- bg-white → bg-white dark:bg-gray-900
- border 색상 dark 모드 대응
- text 색상 dark 모드 대응
```

### ❌ 나쁜 프롬프트 예시

```
# 너무 모호함
좋아요 기능 만들어줘
```

```
# 컨텍스트 없음
다크모드 추가해줘
```

```
# 한 번에 너무 많은 요청
좋아요, 장바구니, 공유, 다크모드, 성능 최적화 다 해줘
```

## 📋 실전 예시

### 예시 1: Performance Card 좋아요 기능 구현

#### Step 1: Prompt 읽기
```bash
cat components/performances/performance-card/prompts/03.func.txt
# "좋아요 기능" 섹션 확인
```

#### Step 2: Supabase 테이블 생성
```sql
CREATE TABLE likes (
  user_id UUID REFERENCES users(id),
  performance_id UUID REFERENCES performances(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, performance_id)
);
```

#### Step 3: AI에게 요청
```
@components/performances/performance-card/prompts/03.func.txt

위 문서의 Supabase 테이블 구조를 바탕으로
usePerformanceLike Hook을 구현해줘:

1. isLiked 상태 관리
2. toggleLike 함수 (Supabase 연동)
3. 낙관적 업데이트
4. 에러 처리 (toast)
5. TypeScript 타입 완벽하게
```

#### Step 4: 컴포넌트에 적용
```tsx
// PerformanceCard.tsx
import { usePerformanceLike } from './hooks/usePerformanceLike';

export function PerformanceCard({ performance, ...props }: Props) {
  const { isLiked, toggleLike } = usePerformanceLike(performance.id);
  
  return (
    <Card>
      {/* ... */}
      <Button onClick={toggleLike}>
        <Heart className={cn(isLiked && "fill-current")} />
      </Button>
    </Card>
  );
}
```

### 예시 2: Performance Detail 지도 통합

#### Step 1: Prompt 읽기
```bash
cat components/performances/performance-detail/prompts/02.ui.txt
# "지도 통합" 섹션 확인
```

#### Step 2: Kakao Map API 설정
```bash
# .env.local
VITE_KAKAO_MAP_API_KEY=your_api_key_here
```

#### Step 3: AI에게 요청
```
@components/performances/performance-detail/prompts/02.ui.txt

위 문서의 "지도 통합" 섹션을 기반으로
Kakao Map을 PerformanceDetail에 통합해줘:

1. react-kakao-maps-sdk 사용
2. 장소 좌표를 마커로 표시
3. 지도 높이 192px (모바일), 256px (데스크톱)
4. 로딩 상태 처리
5. 에러 fallback (지도 로드 실패 시)
```

#### Step 4: 결과 확인
```tsx
// PerformanceDetail.tsx
<TabsContent value="location">
  <Map
    center={{ lat: venue.latitude, lng: venue.longitude }}
    style={{ width: '100%', height: '192px' }}
    className="sm:h-64 rounded-lg"
  >
    <MapMarker position={{ lat: venue.latitude, lng: venue.longitude }}>
      <div>{venue.name}</div>
    </MapMarker>
  </Map>
</TabsContent>
```

## 📊 우선순위 가이드

### 🔴 High Priority (지금 바로 시작)

#### 1. Performance Card 좋아요 기능
**이유:** 핵심 기능, 사용자 인게이지먼트 증가  
**난이도:** ⭐⭐☆☆☆  
**시간:** 2-3시간  
**Prompts:**
- `components/performances/performance-card/prompts/03.func.txt`

#### 2. Performance Detail 지도 통합
**이유:** UX 개선, 정보 가시성 증가  
**난이도:** ⭐⭐⭐☆☆  
**시간:** 3-4시간  
**Prompts:**
- `components/performances/performance-detail/prompts/02.ui.txt`

#### 3. 에러 처리 강화
**이유:** 안정성 향상, 사용자 경험 개선  
**난이도:** ⭐⭐☆☆☆  
**시간:** 2-3시간  
**참고:** `docs/COMPONENT_IMPROVEMENT_GUIDE.md` - 에러 처리 섹션

### 🟡 Medium Priority (1-2주 내)

#### 1. Matching Card 스와이프
**이유:** 모바일 UX 개선  
**난이도:** ⭐⭐⭐⭐☆  
**시간:** 4-6시간  
**Prompts:**
- `components/matching/matching-card/prompts/01.wireframe.txt`

#### 2. 다크모드 지원
**이유:** 사용자 선호도, 접근성  
**난이도:** ⭐⭐⭐☆☆  
**시간:** 4-5시간  
**참고:** 모든 `02.ui.txt` 파일

#### 3. 로딩 스켈레톤
**이유:** 체감 성능 향상  
**난이도:** ⭐⭐☆☆☆  
**시간:** 2-3시간  
**참고:** `docs/COMPONENT_IMPROVEMENT_GUIDE.md` - 로딩 스켈레톤 섹션

### 🟢 Low Priority (한 달 후)

#### 1. 소셜 로그인
**이유:** 편의성 증가  
**난이도:** ⭐⭐⭐☆☆  
**시간:** 3-4시간  
**Prompts:**
- `components/auth/auth-dialog/prompts/01.wireframe.txt`

#### 2. 성능 최적화
**이유:** 대규모 데이터 처리  
**난이도:** ⭐⭐⭐⭐⭐  
**시간:** 1-2일  
**참고:** `docs/COMPONENT_IMPROVEMENT_GUIDE.md` - 성능 최적화 섹션

## 🔄 워크플로우 체크리스트

### 기능 개발 시
- [ ] 해당 컴포넌트 prompts 읽기 (01, 02, 03)
- [ ] `.cursor/rules/` 규칙 확인
- [ ] AI에게 명확한 컨텍스트 제공
- [ ] 단계적으로 구현 (wireframe → ui → func)
- [ ] 테스트 작성
- [ ] Linter 에러 확인
- [ ] PR 생성 (Conventional Commits)

### 개선 작업 시
- [ ] `COMPONENT_IMPROVEMENT_GUIDE.md` 확인
- [ ] 우선순위 검토
- [ ] 관련 prompts 읽기
- [ ] Before/After 비교
- [ ] 성능 측정
- [ ] 접근성 검증

## 📚 관련 문서

### 필수 문서
- 📘 [Component Improvement Guide](docs/COMPONENT_IMPROVEMENT_GUIDE.md)
  - 전체 컴포넌트 개선 계획
  - 우선순위별 로드맵
  - 구현 예시

- 📗 [Development Workflow](docs/DEVELOPMENT_WORKFLOW.md)
  - 개발 워크플로우
  - 일일/주간 루틴
  - PR 체크리스트

- 📕 [Components README](components/README.md)
  - Prompts 목록
  - 컴포넌트별 상태
  - 사용 방법

### .cursor/rules
- 00-principle.mdc - 개발 원칙
- 01-common.mdc - 공통 규칙
- 02-wireframe.mdc - 와이어프레임 단계
- 03-ui.mdc - UI 구현 단계
- 04-func.mdc - 기능 구현 단계
- 05-test.mdc - 테스트 단계
- 06-all-test.mdc - 종합 테스트

## 🎓 학습 리소스

### Supabase
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

### React 성능
- [React.memo](https://react.dev/reference/react/memo)
- [Virtual List](https://tanstack.com/virtual/latest)

### 애니메이션
- [Framer Motion](https://www.framer.com/motion/)

### 지도
- [Kakao Map API](https://apis.map.kakao.com/)

## 🤝 기여 가이드

### Prompts 추가 시
1. 컴포넌트 prompts 폴더 생성
2. 3개 파일 작성 (01.wireframe, 02.ui, 03.func)
3. `components/README.md` 업데이트
4. `COMPONENT_IMPROVEMENT_GUIDE.md`에 항목 추가

### Prompts 업데이트 시
1. 변경 내역 로그 작성
2. 관련 문서 동기화
3. PR 생성 (docs: Update prompts for X component)

---

**Last Updated:** 2025-11-25  
**Version:** 1.0.0  
**Author:** MuseYou Team

**다음 단계:** [Component Improvement Guide](docs/COMPONENT_IMPROVEMENT_GUIDE.md)를 읽고 Phase 1 작업을 시작하세요! 🚀

