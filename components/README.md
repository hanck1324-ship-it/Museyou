# Components Prompts 📦

> 각 컴포넌트의 개선 방향을 정의한 prompts 모음입니다.

## 📁 구조

```
components/
├── performances/
│   ├── performance-card/
│   │   └── prompts/
│   │       ├── 01.wireframe.txt  ✅
│   │       ├── 02.ui.txt          ✅
│   │       └── 03.func.txt        ✅
│   └── performance-detail/
│       └── prompts/
│           ├── 01.wireframe.txt  ✅
│           └── 02.ui.txt          ✅
├── matching/
│   └── matching-card/
│       └── prompts/
│           └── 01.wireframe.txt  ✅
├── auth/
│   └── auth-dialog/
│       └── prompts/
│           └── 01.wireframe.txt  ✅
└── common/
    └── navigation/
        └── prompts/
            ├── 01-wireframe.md   ✅
            ├── 02-ui.md          ✅
            ├── 03-func.md        ✅
            └── 00-implementation-plan.md  ✅
```

## 📋 Prompts 설명

### 01.wireframe.txt
- **목적:** 컴포넌트의 레이아웃과 구조 정의
- **내용:**
  - 레이아웃 다이어그램
  - 구성 요소 목록
  - 반응형 breakpoint
  - 상태별 UI
  - 애니메이션
  - 접근성

### 02.ui.txt
- **목적:** 디자인 시스템 및 스타일 정의
- **내용:**
  - 현재 구현 상태
  - 사용 중인 UI 라이브러리
  - 색상 팔레트
  - 타이포그래피
  - 간격 및 크기
  - 개선 제안
  - 다크모드 대응

### 03.func.txt
- **목적:** 기능 명세 및 API 연동 계획
- **내용:**
  - Props 인터페이스
  - 주요 기능 목록
  - 이벤트 처리
  - 상태 관리
  - API 연동 계획
  - 에러 처리
  - 테스트 케이스

## 🎯 사용 방법

### 1. Prompt 읽기
각 컴포넌트 개선 작업 전에 해당 prompts를 읽고 방향성을 파악합니다.

```bash
# 예: Performance Card 개선 전
cat components/performances/performance-card/prompts/01.wireframe.txt
cat components/performances/performance-card/prompts/02.ui.txt
cat components/performances/performance-card/prompts/03.func.txt
```

### 2. AI에게 프롬프트 제공
AI 코딩 도구(Cursor, GitHub Copilot 등)에 prompts를 컨텍스트로 제공:

```
@components/performances/performance-card/prompts/03.func.txt
좋아요 기능을 구현해줘
```

### 3. 단계별 구현
1. **wireframe** → UI 구조 구현
2. **ui** → 스타일링 및 디자인
3. **func** → 기능 및 API 연동

## 📚 주요 컴포넌트

### 1. Performance Card
**위치:** `app/src/components/performances/PerformanceCard.tsx`

**현재 기능:**
- ✅ 공연 정보 표시
- ✅ 상세보기 버튼
- ✅ 데이트 신청 버튼
- ✅ 반응형 디자인
- ✅ Hover 애니메이션

**계획된 개선:**
- ⏳ 좋아요 기능
- ⏳ 장바구니 추가
- ⏳ 공유 기능
- ⏳ 실시간 평점 업데이트
- ⏳ 이미지 최적화

### 2. Performance Detail
**위치:** `app/src/components/performances/PerformanceDetail.tsx`

**현재 기능:**
- ✅ Dialog 기반 상세 페이지
- ✅ Tab 구조 (공연정보/장소/리뷰)
- ✅ 반응형 디자인

**계획된 개선:**
- ⏳ 지도 통합 (Kakao Map)
- ⏳ 이미지 갤러리
- ⏳ 예매 버튼 연동
- ⏳ 공유 기능
- ⏳ 관련 공연 추천

### 3. Matching Card
**위치:** `app/src/components/matching/MatchingCard.tsx`

**현재 기능:**
- ✅ 매칭 후보자 정보 표시
- ✅ 성별별 색상 차별화
- ✅ 매칭률 표시
- ✅ 프로필/메시지/좋아요 버튼

**계획된 개선:**
- ⏳ 스와이프 인터랙션
- ⏳ 매칭 애니메이션
- ⏳ 프로필 상세 모달
- ⏳ 채팅 연동

### 4. Auth Dialog
**위치:** `app/src/components/auth/AuthDialog.tsx`

**현재 기능:**
- ✅ 로그인/회원가입 탭
- ✅ 폼 유효성 검사
- ✅ Supabase Auth 연동
- ✅ 에러 처리 (Toast)

**계획된 개선:**
- ⏳ 소셜 로그인 (카카오, 구글)
- ⏳ 비밀번호 재설정
- ⏳ 이메일 인증
- ⏳ 프로필 사진 업로드

### 5. Navigation
**위치:** `app/src/components/common/navigation/`

**prompts 위치:**
- `app/src/components/common/navigation/prompts/`

**계획:**
- ⏳ 네비게이션 구현 (wireframe 기반)

## 🚀 우선순위

### 🔴 High Priority (1-2주)
1. **Performance Card 좋아요 기능**
2. **Performance Detail 지도 통합**
3. **에러 처리 강화**

### 🟡 Medium Priority (3-4주)
1. **Matching Card 스와이프**
2. **다크모드 지원**
3. **로딩 스켈레톤**
4. **공유 기능**

### 🟢 Low Priority (5-6주)
1. **소셜 로그인**
2. **성능 최적화**
3. **알림 시스템**
4. **AI 추천**

## 📖 가이드 문서

### [Component Improvement Guide](../docs/COMPONENT_IMPROVEMENT_GUIDE.md)
전체 컴포넌트 개선 가이드, 우선순위, 구현 예제 포함

### [Development Workflow](../docs/DEVELOPMENT_WORKFLOW.md)
개발 워크플로우, 일일 루틴, PR 체크리스트

### [Code Quality Rules](../.cursor/rules/)
코딩 규칙, 스타일 가이드, 테스트 방법

## 💡 팁

### Prompt 작성 시 고려사항
1. **명확한 구조:** 레이아웃 다이어그램 포함
2. **구체적인 예시:** 코드 스니펫 제공
3. **개선 방향:** Before/After 비교
4. **우선순위:** Phase별 분류

### AI 활용 팁
```
# 좋은 프롬프트 예시
@components/performances/performance-card/prompts/03.func.txt
위 문서의 "좋아요 기능" 섹션을 기반으로
usePerformanceLike Hook을 구현해줘.
Supabase likes 테이블과 연동하고,
낙관적 업데이트(Optimistic Update)를 적용해줘.
```

```
# 나쁜 프롬프트 예시
좋아요 기능 만들어줘
```

### 단계별 구현 예시

#### Step 1: Wireframe 구현
```bash
# 1. Wireframe prompt 읽기
cat components/performances/performance-card/prompts/01.wireframe.txt

# 2. AI에게 요청
"위 wireframe을 기반으로 기본 레이아웃을 구현해줘"
```

#### Step 2: UI 스타일링
```bash
# 1. UI prompt 읽기
cat components/performances/performance-card/prompts/02.ui.txt

# 2. AI에게 요청
"위 디자인 시스템을 적용해서 스타일링해줘"
```

#### Step 3: 기능 구현
```bash
# 1. Func prompt 읽기
cat components/performances/performance-card/prompts/03.func.txt

# 2. AI에게 요청
"좋아요 기능을 구현해줘. Supabase 연동 포함"
```

## 🔄 업데이트 로그

### 2025-11-25
- ✅ Performance Card prompts 작성
- ✅ Performance Detail prompts 작성
- ✅ Matching Card prompts 작성
- ✅ Auth Dialog prompts 작성
- ✅ Component Improvement Guide 작성

### 다음 단계
- [ ] 나머지 컴포넌트 prompts 작성
- [ ] 실제 개선 작업 시작 (Phase 1)

---

**Last Updated:** 2025-11-25  
**Version:** 1.0.0

