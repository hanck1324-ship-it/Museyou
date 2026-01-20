# 🚀 다음 단계 가이드

> 장바구니 및 문화 공동구매 기능 구현 완료 후 다음 단계

---

## 📊 현재 상태

### ✅ 완료된 작업
- ✅ 장바구니 기능 (추가, 수정, 삭제, 결제 준비)
- ✅ 문화 공동구매 기능 (CRUD, 필터링, 정렬, 실시간 업데이트)
- ✅ Git 브랜치 생성 및 커밋 (`feature/group-purchase-and-cart`)
- ✅ 원격 저장소 푸시 완료
- ✅ PR 템플릿 작성 완료

### 📝 진행 중
- ⏳ PR 생성 (GitHub에서 수동 생성 필요)

---

## 🎯 즉시 할 수 있는 작업 (Priority 1)

### 1. PR 생성 및 리뷰 🔴

#### 1.1 PR 생성
**링크**: https://github.com/hanck1324-ship-it/Museyou/pull/new/feature/group-purchase-and-cart

**제목**:
```
feat: 장바구니 및 문화 공동구매 기능 구현
```

**본문**: 
- `.github/PULL_REQUEST_TEMPLATE.md` 템플릿이 자동으로 채워집니다.
- 주요 변경사항 요약:
  - 63개 파일 변경
  - 9,858줄 추가
  - 주요 기능: 장바구니, 공동구매, 실시간 업데이트

#### 1.2 PR 리뷰 체크리스트
- [ ] 코드 리뷰 요청
- [ ] 변경사항 검토
- [ ] 테스트 확인
- [ ] 문서 업데이트 확인
- [ ] 충돌 해결 (있다면)

#### 1.3 PR 머지 후
- [ ] 브랜치 삭제 (선택사항)
- [ ] `main` 브랜치로 전환
- [ ] 최신 코드 pull

---

## 🔧 단기 작업 (Priority 2)

### 2. 테스트 코드 작성 🟡

#### 2.1 테스트 환경 설정
```bash
# Vitest 설치
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# Playwright 설치 (E2E 테스트)
pnpm add -D @playwright/test
npx playwright install
```

#### 2.2 우선순위 테스트
**High Priority:**
- [ ] `useCartStore` 단위 테스트
  - 장바구니 추가/삭제/수정
  - 총 금액 계산
  - LocalStorage persistence

- [ ] `useGroupPurchaseStore` 단위 테스트
  - 공동구매 CRUD
  - 필터링/정렬
  - 상태 관리

**Medium Priority:**
- [ ] `GroupPurchaseCard` 컴포넌트 테스트
- [ ] `CartSheet` 컴포넌트 테스트
- [ ] API 함수 테스트 (`groupPurchaseApi.ts`)

**E2E 테스트:**
- [ ] 장바구니 플로우 (공연 추가 → 장바구니 확인 → 결제 준비)
- [ ] 공동구매 플로우 (생성 → 참여 → 취소)

#### 2.3 테스트 파일 구조
```
src/
├── components/
│   └── group-purchases/
│       ├── GroupPurchaseCard.tsx
│       └── GroupPurchaseCard.test.tsx
├── store/
│   ├── useCartStore.ts
│   └── useCartStore.test.ts
└── lib/
    └── api/
        ├── groupPurchaseApi.ts
        └── groupPurchaseApi.test.ts

tests/
└── e2e/
    ├── cart.spec.ts
    └── group-purchase.spec.ts
```

---

### 3. 실제 Supabase 연결 🟡

#### 3.1 현재 상태
- ✅ 모킹 모드로 동작 (`USE_MOCK_MODE = true`)
- ⏳ 실제 Supabase 연결 대기 중

#### 3.2 Supabase 설정
1. **데이터베이스 테이블 생성**
   ```sql
   -- group_purchases 테이블
   CREATE TABLE group_purchases (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     performance_id TEXT NOT NULL,
     creator_id UUID REFERENCES auth.users(id),
     target_participants INTEGER NOT NULL,
     current_participants INTEGER DEFAULT 0,
     discount_rate INTEGER NOT NULL,
     deadline TIMESTAMPTZ NOT NULL,
     description TEXT,
     status TEXT DEFAULT 'active',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- group_purchase_participants 테이블
   CREATE TABLE group_purchase_participants (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     group_purchase_id UUID REFERENCES group_purchases(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id),
     participant_count INTEGER DEFAULT 1,
     message TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **Realtime 설정**
   ```sql
   -- Realtime 활성화
   ALTER PUBLICATION supabase_realtime ADD TABLE group_purchases;
   ALTER PUBLICATION supabase_realtime ADD TABLE group_purchase_participants;
   ```

3. **Row Level Security (RLS) 설정**
   ```sql
   -- RLS 활성화
   ALTER TABLE group_purchases ENABLE ROW LEVEL SECURITY;
   ALTER TABLE group_purchase_participants ENABLE ROW LEVEL SECURITY;

   -- 정책 추가 (예시)
   CREATE POLICY "Anyone can read active group purchases"
     ON group_purchases FOR SELECT
     USING (status = 'active');

   CREATE POLICY "Users can create group purchases"
     ON group_purchases FOR INSERT
     WITH CHECK (auth.uid() = creator_id);
   ```

#### 3.3 코드 수정
- `src/lib/api/groupPurchaseApi.ts`에서 `USE_MOCK_MODE = false`로 변경
- 환경 변수 설정 확인 (`.env`)
  ```env
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

#### 3.4 마이그레이션 체크리스트
- [ ] 데이터베이스 테이블 생성
- [ ] Realtime 활성화
- [ ] RLS 정책 설정
- [ ] 환경 변수 설정
- [ ] 모킹 모드 해제
- [ ] 통합 테스트

---

## 📈 중기 작업 (Priority 3)

### 4. 추가 기능 개발 🟢

#### 4.1 알림 시스템
**목표**: 공동구매 관련 알림 제공

**기능**:
- [ ] 공동구매 마감 임박 알림 (24시간 전)
- [ ] 목표 달성 알림
- [ ] 참여 취소 알림
- [ ] 새 참여자 알림 (생성자용)

**구현 방법**:
- Supabase Realtime + 브라우저 Notification API
- 또는 이메일 알림 (Supabase Functions)

#### 4.2 통계/대시보드
**목표**: 공동구매 통계 및 분석

**기능**:
- [ ] 공동구매 성공률 통계
- [ ] 카테고리별 공동구매 분포
- [ ] 사용자별 참여 현황
- [ ] 인기 공연/공동구매 순위

**컴포넌트**:
- `GroupPurchaseDashboard.tsx`
- Recharts 또는 Chart.js 사용

#### 4.3 공유 기능 강화
**목표**: 공동구매 공유 활성화

**기능**:
- [ ] SNS 공유 (카카오톡, 페이스북, 트위터)
- [ ] 링크 복사
- [ ] 공유할 때 커스텀 메시지 추가
- [ ] 공유 추적 (공유 횟수 기록)

#### 4.4 성능 최적화
**목표**: 대용량 데이터 처리 및 사용자 경험 개선

**최적화 항목**:
- [ ] 가상 스크롤 (react-window 또는 react-virtualized)
- [ ] 이미지 지연 로딩 (Lazy loading)
- [ ] 무한 스크롤 (Infinite scroll)
- [ ] 코드 스플리팅 (React.lazy)
- [ ] 메모이제이션 (React.memo, useMemo, useCallback)

#### 4.5 결제 기능 통합
**목표**: 장바구니 → 결제 플로우 완성

**기능**:
- [ ] 결제 페이지 구현
- [ ] 결제 API 연동 (토스페이먼츠, 아임포트 등)
- [ ] 결제 완료 후 공동구매 자동 참여
- [ ] 결제 내역 관리

---

## 🚀 장기 작업 (Priority 4)

### 5. 배포 및 운영 🔵

#### 5.1 CI/CD 설정
- [ ] GitHub Actions 설정
- [ ] 자동 빌드 및 테스트
- [ ] 자동 배포 (Vercel/Netlify)

#### 5.2 모니터링
- [ ] 에러 추적 (Sentry)
- [ ] 성능 모니터링
- [ ] 사용자 분석 (Google Analytics)

#### 5.3 문서화
- [ ] API 문서화
- [ ] 사용자 가이드
- [ ] 개발자 문서 업데이트

---

## 📋 우선순위별 작업 체크리스트

### 🔴 즉시 (이번 주)
- [ ] PR 생성 및 머지
- [ ] `IMPLEMENTATION_STATUS.md` 업데이트

### 🟡 단기 (다음 주)
- [ ] 테스트 환경 설정
- [ ] 주요 Store 단위 테스트 작성
- [ ] Supabase 테이블 생성 및 연결
- [ ] 모킹 모드 해제 및 검증

### 🟢 중기 (다음 2-3주)
- [ ] 알림 시스템 구현
- [ ] 성능 최적화
- [ ] 통계/대시보드 추가

### 🔵 장기 (1개월+)
- [ ] 결제 기능 통합
- [ ] CI/CD 설정
- [ ] 배포 및 모니터링

---

## 🎯 추천 작업 순서

### Week 1: PR 및 정리
1. PR 생성 및 머지
2. 코드 리뷰 및 수정사항 반영
3. 문서 업데이트

### Week 2: 테스트 및 Supabase 연결
1. 테스트 환경 설정
2. 주요 기능 단위 테스트
3. Supabase 테이블 생성
4. 실제 연결 및 검증

### Week 3-4: 기능 강화
1. 알림 시스템
2. 성능 최적화
3. 통계 대시보드

---

## 📚 참고 자료

### 프로젝트 문서
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - 구현 현황
- [GROUP_PURCHASE_STRUCTURE.md](./docs/GROUP_PURCHASE_STRUCTURE.md) - 공동구매 구조
- [DEVELOPMENT_WORKFLOW.md](./docs/DEVELOPMENT_WORKFLOW.md) - 개발 워크플로우

### 테스트 가이드
- [.cursor/rules/05-test.mdc](./.cursor/rules/05-test.mdc) - 테스트 규칙
- [.cursor/rules/06-all-test.mdc](./.cursor/rules/06-all-test.mdc) - 종합 테스트

### Supabase 문서
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: 2025-01-25  
**Status**: 다음 단계 계획 수립 완료 ✅
