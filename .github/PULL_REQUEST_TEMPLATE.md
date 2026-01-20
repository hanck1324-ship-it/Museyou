# 장바구니 및 문화 공동구매 기능 구현

## 📋 작업 내용

### 주요 기능
- ✅ 장바구니 기능 구현 (추가, 수정, 삭제, 결제 준비)
- ✅ 문화 공동구매 기능 구현
  - 공동구매 생성/조회/상세보기
  - 공동구매 참여/취소
  - 공동구매 수정/삭제 (생성자용)
  - 필터링/정렬 기능 (카테고리, 지역, 상태, 할인율, 검색)
  - 내 공동구매 목록 관리
- ✅ 실시간 진행률 업데이트 (Supabase Realtime 지원)
- ✅ UI/UX 개선
  - 반응형 디자인
  - 진행률 표시
  - 상태 배지
  - 참여자 목록

### 텍스트 변경
- '커플데이트 추천' → '문화 공동구매'로 전체 변경

## 📁 새로 추가된 파일

### Store
- `src/store/useCartStore.ts` - 장바구니 상태 관리
- `src/store/useGroupPurchaseStore.ts` - 공동구매 상태 관리

### Components
- `src/components/common/CartButton.tsx` - 장바구니 버튼
- `src/components/common/CartSheet.tsx` - 장바구니 시트
- `src/components/group-purchases/GroupPurchaseCard.tsx` - 공동구매 카드
- `src/components/group-purchases/GroupPurchaseCreate.tsx` - 공동구매 생성
- `src/components/group-purchases/GroupPurchaseDetail.tsx` - 공동구매 상세
- `src/components/group-purchases/GroupPurchaseEdit.tsx` - 공동구매 수정
- `src/components/group-purchases/GroupPurchaseJoin.tsx` - 공동구매 참여
- `src/components/group-purchases/GroupPurchaseList.tsx` - 공동구매 목록
- `src/components/group-purchases/GroupPurchaseParticipants.tsx` - 참여자 목록
- `src/components/group-purchases/GroupPurchaseProgress.tsx` - 진행률 표시
- `src/components/group-purchases/GroupPurchaseStatus.tsx` - 상태 배지
- `src/components/group-purchases/MyGroupPurchases.tsx` - 내 공동구매

### API & Types
- `src/lib/api/groupPurchaseApi.ts` - 공동구매 API
- `src/lib/types/groupPurchase.ts` - 공동구매 타입 정의
- `src/lib/hooks/useGroupPurchaseRealtime.ts` - 실시간 업데이트 훅

### Documentation
- `docs/GROUP_PURCHASE_STRUCTURE.md` - 공동구매 구조 문서

## 🔄 수정된 파일

- `src/App.tsx` - 장바구니 및 공동구매 탭 통합
- `src/components/auth/AuthDialog.tsx` - 텍스트 변경
- `src/components/home/HomePage.tsx` - 텍스트 변경
- `src/components/matching/DateProposal.tsx` - 텍스트 변경
- `src/components/performances/PerformanceCard.tsx` - 장바구니 추가 버튼
- `src/lib/api/mockData.ts` - 공동구매 모킹 데이터 추가

## 🧪 테스트 방법

1. **장바구니 기능**
   - 공연 카드에서 장바구니 추가
   - 장바구니에서 수량 조절 및 삭제
   - 장바구니 총 금액 확인

2. **공동구매 기능**
   - 공동구매 생성
   - 공동구매 목록 조회 및 필터링/정렬
   - 공동구매 참여 및 취소
   - 공동구매 수정 및 삭제 (생성자)
   - 내 공동구매 목록 확인

3. **실시간 업데이트**
   - 공동구매 상세 페이지에서 참여자 변경 시 자동 업데이트 (5초마다 폴링)
   - 목록 페이지에서 새 공동구매 생성 시 자동 업데이트 (10초마다 폴링)

## 📝 참고사항

- 현재 모킹 모드로 동작 (실제 Supabase 연결 시 `USE_MOCK_MODE = false`로 변경)
- 실시간 업데이트는 모킹 모드에서 폴링으로 동작
- 실제 Supabase Realtime 연결 시 즉시 업데이트 지원

## 🔗 관련 이슈

Closes #[이슈 번호]
