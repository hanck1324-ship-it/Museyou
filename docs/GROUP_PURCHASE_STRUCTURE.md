# 📁 문화 공동구매 기능 폴더 구조 제안

> 문화 공동구매 기능을 위한 체계적인 폴더 구조 설계

---

## 🎯 전체 구조

```
src/
├── components/
│   └── group-purchases/          # 문화 공동구매 컴포넌트
│       ├── GroupPurchaseCard.tsx          # 공동구매 카드 (목록에서 사용)
│       ├── GroupPurchaseList.tsx           # 공동구매 목록 페이지
│       ├── GroupPurchaseDetail.tsx         # 공동구매 상세 페이지
│       ├── GroupPurchaseCreate.tsx         # 공동구매 생성 다이얼로그/페이지
│       ├── GroupPurchaseJoin.tsx           # 공동구매 참여 다이얼로그
│       ├── GroupPurchaseProgress.tsx       # 진행률 표시 컴포넌트
│       ├── GroupPurchaseParticipants.tsx   # 참여자 목록 컴포넌트
│       ├── GroupPurchaseStatus.tsx         # 상태 배지/표시 컴포넌트
│       └── prompts/                        # 프롬프트 문서
│           ├── 01.wireframe.txt
│           ├── 02.ui.txt
│           └── 03.func.txt
│
├── store/
│   └── useGroupPurchaseStore.ts   # 공동구매 상태 관리 (Zustand)
│
├── lib/
│   ├── api/
│   │   └── groupPurchaseApi.ts    # 공동구매 API 함수들
│   └── types/
│       └── groupPurchase.ts       # 공동구매 타입 정의
│
└── pages/                          # 라우트 페이지 (선택사항)
    └── group-purchases/
        ├── page.tsx                # 목록 페이지
        └── [id]/
            └── page.tsx            # 상세 페이지
```

---

## 📦 컴포넌트별 상세 설명

### 1. GroupPurchaseCard.tsx
**역할**: 공동구매 목록에서 각 항목을 카드 형태로 표시

**Props**:
```typescript
interface GroupPurchaseCardProps {
  groupPurchase: GroupPurchase;
  onViewDetail: (id: string) => void;
  onJoin?: (id: string) => void;
}
```

**기능**:
- 공동구매 기본 정보 표시 (공연명, 목표 인원, 현재 인원, 할인율)
- 진행률 표시
- 상태 배지 (모집중, 진행중, 완료, 마감)
- 참여 버튼

---

### 2. GroupPurchaseList.tsx
**역할**: 공동구매 목록 페이지

**기능**:
- 필터링 (공연 카테고리, 지역, 상태)
- 정렬 (인기순, 마감임박순, 최신순)
- 검색
- 무한 스크롤 또는 페이지네이션

---

### 3. GroupPurchaseDetail.tsx
**역할**: 공동구매 상세 정보 표시

**기능**:
- 공연 상세 정보
- 공동구매 정보 (목표 인원, 현재 인원, 할인율, 마감일)
- 진행률 차트
- 참여자 목록
- 참여/취소 버튼
- 공동구매 진행 상황 타임라인

---

### 4. GroupPurchaseCreate.tsx
**역할**: 새로운 공동구매 생성

**기능**:
- 공연 선택
- 목표 인원 설정
- 할인율 설정
- 마감일 설정
- 공동구매 설명 작성
- 생성 폼 제출

---

### 5. GroupPurchaseJoin.tsx
**역할**: 공동구매 참여 다이얼로그

**기능**:
- 참여 확인
- 참여 인원 선택
- 참여 메시지 작성 (선택사항)
- 참여 제출

---

### 6. GroupPurchaseProgress.tsx
**역할**: 진행률 표시 컴포넌트 (재사용 가능)

**Props**:
```typescript
interface GroupPurchaseProgressProps {
  current: number;
  target: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**기능**:
- 프로그레스 바 표시
- 퍼센트 표시
- 목표 달성 시 시각적 피드백

---

### 7. GroupPurchaseParticipants.tsx
**역할**: 참여자 목록 표시

**기능**:
- 참여자 아바타 목록
- 참여자 수 표시
- 참여자 프로필 클릭 (선택사항)

---

### 8. GroupPurchaseStatus.tsx
**역할**: 상태 배지 컴포넌트

**기능**:
- 상태별 색상/아이콘 표시
- 상태: 모집중, 진행중, 목표달성, 마감, 취소됨

---

## 🗂️ Store 구조

### useGroupPurchaseStore.ts
```typescript
interface GroupPurchaseState {
  // 목록
  groupPurchases: GroupPurchase[];
  isLoading: boolean;
  
  // 필터/정렬
  filters: GroupPurchaseFilters;
  sortBy: 'popular' | 'deadline' | 'newest';
  
  // 선택된 공동구매
  selectedGroupPurchase: GroupPurchase | null;
  
  // Actions
  fetchGroupPurchases: (filters?: GroupPurchaseFilters) => Promise<void>;
  fetchGroupPurchaseDetail: (id: string) => Promise<void>;
  createGroupPurchase: (data: CreateGroupPurchaseData) => Promise<void>;
  joinGroupPurchase: (id: string, data: JoinData) => Promise<void>;
  cancelJoin: (id: string) => Promise<void>;
  updateFilters: (filters: GroupPurchaseFilters) => void;
}
```

---

## 🔌 API 구조

### lib/api/groupPurchaseApi.ts
```typescript
export const groupPurchaseApi = {
  // 목록 조회
  getAll: (filters?: GroupPurchaseFilters) => Promise<GroupPurchase[]>,
  
  // 상세 조회
  getById: (id: string) => Promise<GroupPurchase>,
  
  // 생성
  create: (data: CreateGroupPurchaseData) => Promise<GroupPurchase>,
  
  // 참여
  join: (id: string, data: JoinData) => Promise<void>,
  
  // 참여 취소
  cancelJoin: (id: string) => Promise<void>,
  
  // 내가 참여한 공동구매 목록
  getMyGroupPurchases: () => Promise<GroupPurchase[]>,
  
  // 내가 생성한 공동구매 목록
  getMyCreatedGroupPurchases: () => Promise<GroupPurchase[]>,
};
```

---

## 📝 타입 정의

### lib/types/groupPurchase.ts
```typescript
export interface GroupPurchase {
  id: string;
  performanceId: string;
  performance: Performance; // 공연 정보
  
  // 공동구매 정보
  targetParticipants: number;  // 목표 인원
  currentParticipants: number;  // 현재 참여 인원
  discountRate: number;        // 할인율 (%)
  originalPrice: number;        // 원가
  discountedPrice: number;      // 할인가
  
  // 상태
  status: 'recruiting' | 'in_progress' | 'completed' | 'closed' | 'cancelled';
  
  // 일정
  deadline: string;             // 마감일
  createdAt: string;
  updatedAt: string;
  
  // 생성자
  creatorId: string;
  creator: User;
  
  // 참여자
  participants: GroupPurchaseParticipant[];
  
  // 설명
  description?: string;
  
  // 진행률
  progress: number; // 0-100
}

export interface GroupPurchaseParticipant {
  id: string;
  userId: string;
  user: User;
  joinedAt: string;
  participantCount: number; // 참여 인원 수
  message?: string;
}

export interface CreateGroupPurchaseData {
  performanceId: string;
  targetParticipants: number;
  discountRate: number;
  deadline: string;
  description?: string;
}

export interface JoinGroupPurchaseData {
  participantCount: number;
  message?: string;
}

export interface GroupPurchaseFilters {
  category?: string;
  district?: string;
  status?: GroupPurchase['status'];
  minDiscountRate?: number;
}
```

---

## 🎨 UI/UX 고려사항

### 1. 상태별 색상
- **모집중** (recruiting): 초록색 (emerald)
- **진행중** (in_progress): 파란색 (blue)
- **목표달성** (completed): 보라색 (purple)
- **마감** (closed): 회색 (gray)
- **취소됨** (cancelled): 빨간색 (red)

### 2. 진행률 표시
- 프로그레스 바
- 퍼센트 숫자
- 목표 달성 시 애니메이션

### 3. 참여자 표시
- 아바타 그리드
- "N명 참여 중" 텍스트
- 최대 인원 표시

---

## 🔄 데이터 흐름

```
1. 사용자가 공동구매 목록 페이지 접속
   → GroupPurchaseList 컴포넌트 렌더링
   → useGroupPurchaseStore.fetchGroupPurchases() 호출
   → groupPurchaseApi.getAll() 호출
   → Supabase에서 데이터 조회
   → Store에 저장
   → GroupPurchaseCard 리스트 렌더링

2. 사용자가 공동구매 카드 클릭
   → GroupPurchaseDetail 다이얼로그/페이지 열기
   → useGroupPurchaseStore.fetchGroupPurchaseDetail(id) 호출
   → 상세 정보 표시

3. 사용자가 공동구매 참여 버튼 클릭
   → GroupPurchaseJoin 다이얼로그 열기
   → 참여 정보 입력
   → useGroupPurchaseStore.joinGroupPurchase() 호출
   → groupPurchaseApi.join() 호출
   → Supabase에 참여 정보 저장
   → 진행률 업데이트
   → 알림 발송 (선택사항)
```

---

## 📋 구현 순서 추천

### Phase 1: 기본 구조 (1주)
1. ✅ 폴더 구조 생성
2. ✅ 타입 정의 작성
3. ✅ Store 기본 구조 작성
4. ✅ API 함수 스켈레톤 작성

### Phase 2: UI 컴포넌트 (1주)
1. ✅ GroupPurchaseCard 구현
2. ✅ GroupPurchaseList 구현
3. ✅ GroupPurchaseDetail 구현
4. ✅ GroupPurchaseProgress 구현
5. ✅ GroupPurchaseStatus 구현

### Phase 3: 기능 구현 (1주)
1. ✅ Supabase 테이블 생성
2. ✅ API 연동
3. ✅ Store 로직 완성
4. ✅ 참여/취소 기능

### Phase 4: 고급 기능 (1주)
1. ✅ 실시간 진행률 업데이트 (Supabase Realtime)
2. ✅ 알림 시스템
3. ✅ 필터링/정렬
4. ✅ 검색 기능

---

## 🗄️ Supabase 테이블 구조

```sql
-- 공동구매 테이블
CREATE TABLE group_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  performance_id UUID REFERENCES performances(id) NOT NULL,
  creator_id UUID REFERENCES users(id) NOT NULL,
  
  target_participants INTEGER NOT NULL CHECK (target_participants > 0),
  current_participants INTEGER DEFAULT 0,
  discount_rate DECIMAL(5,2) NOT NULL CHECK (discount_rate >= 0 AND discount_rate <= 100),
  original_price INTEGER NOT NULL,
  discounted_price INTEGER NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'recruiting' 
    CHECK (status IN ('recruiting', 'in_progress', 'completed', 'closed', 'cancelled')),
  
  deadline TIMESTAMPTZ NOT NULL,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 공동구매 참여자 테이블
CREATE TABLE group_purchase_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_purchase_id UUID REFERENCES group_purchases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 1 CHECK (participant_count > 0),
  message TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(group_purchase_id, user_id)
);

-- 인덱스
CREATE INDEX idx_group_purchases_performance ON group_purchases(performance_id);
CREATE INDEX idx_group_purchases_status ON group_purchases(status);
CREATE INDEX idx_group_purchases_deadline ON group_purchases(deadline);
CREATE INDEX idx_group_purchase_participants_group ON group_purchase_participants(group_purchase_id);
```

---

## 📚 참고 파일

- `components/performances/` - 공연 컴포넌트 구조 참고
- `components/matching/` - 매칭 컴포넌트 구조 참고
- `store/useCartStore.ts` - Store 구조 참고
- `lib/api/api.ts` - API 함수 구조 참고

---

## ✅ 체크리스트

### 폴더 구조 생성
- [ ] `src/components/group-purchases/` 폴더 생성
- [ ] `src/lib/types/groupPurchase.ts` 생성
- [ ] `src/lib/api/groupPurchaseApi.ts` 생성
- [ ] `src/store/useGroupPurchaseStore.ts` 생성
- [ ] `src/components/group-purchases/prompts/` 폴더 생성

### 컴포넌트 생성
- [ ] GroupPurchaseCard.tsx
- [ ] GroupPurchaseList.tsx
- [ ] GroupPurchaseDetail.tsx
- [ ] GroupPurchaseCreate.tsx
- [ ] GroupPurchaseJoin.tsx
- [ ] GroupPurchaseProgress.tsx
- [ ] GroupPurchaseParticipants.tsx
- [ ] GroupPurchaseStatus.tsx

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0
