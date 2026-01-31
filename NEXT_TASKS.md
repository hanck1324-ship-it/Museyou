# 계속 해야 할 작업 정리 📋

## ✅ 최근 완료한 작업

### 1. Performance Card 좋아요 기능 강화 ✅
- Supabase likes 테이블 연동 강화
- 좋아요 수 표시 기능 추가
- 실시간 좋아요 수 업데이트 (Supabase Realtime)
- 테스트 코드 작성 (7개 테스트 모두 통과)

### 2. 컴포넌트 테스트 문제 해결 ✅
- UI 컴포넌트 import 문제 수정 (버전 번호 제거)
- 테스트 실행 가능하도록 개선
- **79개 테스트 모두 통과** ✅

### 3. 실패한 테스트 수정 완료 ✅ (2025-01-27)
- CartSheet.test.tsx: 11개 테스트 모두 통과 ✅
- GroupPurchaseCard.test.tsx: 10개 테스트 모두 통과 ✅
- 전체 테스트: 79개 모두 통과 ✅

### 4. Performance Detail 지도 개선 ✅ (2025-01-27)
- PerformanceMap useEffect/cleanup 안정화
- 공연장 좌표 기준 주변 지하철역(카카오 Places) 상위 3개 표시
- 좌표/SDK 로드 실패 시 graceful fallback
- 브랜치: `feat/performance-detail-map` (PR 대기 중)

### 5. 실시간 평점 업데이트 ✅ (2025-01-27)
- 모킹 모드에서도 실시간 평점 업데이트 동작
- CustomEvent 기반 리뷰 변경 감지
- 리뷰 추가 시 평점 자동 재계산
- UI 자동 업데이트 확인

### 6. 이미지 최적화 ✅ (2025-01-27)
- WebP 변환 지원 (URL 기반)
- Lazy Loading 적용
- 반응형 이미지 (srcset) 구현
- 이미지 캐싱 전략 구현
- `ImageWithFallback` 컴포넌트 개선
- 이미지 최적화 유틸리티 함수 추가

---

## 🔴 즉시 해야 할 작업 (우선순위 높음)

### 1. ~~실패한 테스트 수정~~ ✅ 완료
**현재 상태:**
```
✅ CartSheet.test.tsx (11 tests | 모두 통과)
✅ GroupPurchaseCard.test.tsx (10 tests | 모두 통과)
✅ 전체 테스트: 79개 모두 통과
```

### 2. ~~Performance Detail 지도 개선~~ ✅ 완료
**완료된 작업:**
- ✅ PerformanceMap useEffect/cleanup 안정화
- ✅ 주변 지하철역 표시 (카카오 Places API)
- ✅ 좌표 로드 실패 시 fallback 처리

**남은 작업 (선택사항):**
- [ ] 실제 공연장 좌표 데이터베이스에 저장 (Supabase)
- [ ] 지도 확대/축소 컨트롤 커스텀
- [ ] 지도 로딩 스켈레톤 개선

---

## 🟡 단기 작업 (1-2주 내) - 추천 순서

### 1순위: ~~실시간 평점 업데이트~~ ✅ 완료
**완료된 작업:**
- ✅ 모킹 모드에서도 실시간 평점 업데이트 동작
- ✅ CustomEvent 기반 리뷰 변경 감지
- ✅ 리뷰 추가 시 평점 자동 재계산
- ✅ UI 자동 업데이트 확인
- ✅ Supabase Realtime 구독 코드 준비 (실제 모드 전환 시 사용)

**남은 작업 (실제 Supabase 연결 시):**
- [ ] USE_MOCK_MODE를 false로 변경
- [ ] Supabase Realtime 구독 활성화

---

### 2순위: 다크모드 지원 완성 ⭐⭐⭐
**현재 상태:**
- ✅ `next-themes` 설치됨
- ✅ `ThemeToggle` 컴포넌트 존재
- ✅ 다크모드 CSS 변수 정의됨 (`globals.css`)
- ⚠️ 일부 컴포넌트에만 `dark:` 클래스 적용됨

**해야 할 작업:**
- [ ] 주요 컴포넌트에 `dark:` 클래스 추가
  - PerformanceCard, PerformanceDetail
  - MatchingCard, GroupPurchaseCard
  - AuthDialog, CartSheet
  - Header, Navigation, Footer
- [ ] 공통 UI 컴포넌트 다크모드 적용
- [ ] 테마 토글 버튼 위치 확인 및 개선
- [ ] 시스템 테마 감지 확인

**예상 시간:** 3-4시간  
**이유:** 이미 기반이 구축되어 있어 빠르게 완성 가능, 사용자 만족도 높음

**참고 문서:** `DARK_MODE_IMPLEMENTATION.md`

---

### 3순위: ~~이미지 최적화~~ ✅ 완료
**완료된 작업:**
- ✅ WebP 변환 지원 (URL 기반)
- ✅ Lazy Loading 적용
- ✅ 반응형 이미지 (srcset) 구현
- ✅ 이미지 캐싱 전략 구현
- ✅ `ImageWithFallback` 컴포넌트 개선
- ✅ 이미지 최적화 유틸리티 함수 추가

**추가된 기능:**
- `ImageWithFallback` 컴포넌트에 size, useWebP, lazy props 추가
- `imageOptimization.ts` 유틸리티 함수 생성
- 로딩 상태 표시 개선

---

### 4순위: ~~로딩 스켈레톤 확장~~ ✅ 완료 (2025-01-27)
**완료된 작업:**
- ✅ GroupPurchaseCardSkeleton 컴포넌트 생성
- ✅ PerformanceDetailSkeleton 컴포넌트 생성
- ✅ GroupPurchaseDetailSkeleton 컴포넌트 생성
- ✅ 목록 페이지 스켈레톤 통합
- ✅ 상세 페이지 스켈레톤 통합
- ✅ 로딩 상태 관리 개선

**참고 문서:** `LOADING_SKELETON_IMPLEMENTATION.md`

---

## 🟢 중기 작업 (3-4주 내)

### 5. ~~Matching Card 스와이프 기능~~ ✅ 완료 (2025-01-27)
**완료된 작업:**
- ✅ SwipeableMatchingCard 컴포넌트 생성 (Framer Motion 기반)
- ✅ MatchingCardStack 컴포넌트 생성 (카드 스택 UI)
- ✅ 드래그/스와이프 애니메이션 구현
- ✅ 좋아요/패스 제스처 처리
- ✅ App.tsx에 카드 스택 방식 적용

**남은 작업 (선택사항):**
- [ ] 매칭 알고리즘 개선

---

### 6. ~~무한 스크롤~~ ✅ 완료 (2025-01-27)
**완료된 작업:**
- ✅ `useInfiniteScroll` 커스텀 훅 생성 (Intersection Observer API)
- ✅ 공연 목록 무한 스크롤 적용
- ✅ 공동구매 목록 무한 스크롤 적용
- ✅ 로딩 인디케이터 표시

**참고 문서:** `INFINITE_SCROLL_IMPLEMENTATION.md`

---

## 🔵 장기 작업 (5-6주 내)

### 7. 실제 Supabase 연결
**현재 상태:**
- 모킹 모드로 동작 중

**해야 할 작업:**
- [ ] Supabase 테이블 생성
  - performances
  - likes
  - reviews
  - group_purchases
  - orders
- [ ] RLS (Row Level Security) 설정
- [ ] 실제 데이터 마이그레이션
- [ ] 모킹 모드 제거

**예상 시간:** 8-12시간

---

### 8. 소셜 로그인 강화
**현재 상태:**
- 기본 소셜 로그인 구현됨

**해야 할 작업:**
- [ ] 비밀번호 재설정 기능
- [ ] 이메일 인증
- [ ] 프로필 사진 업로드
- [ ] 소셜 로그인 테스트

**참고 문서:** `docs/SOCIAL_AUTH_IMPROVEMENTS.md`

**예상 시간:** 4-6시간

---

### 9. 알림 시스템
**현재 상태:**
- 브라우저 알림만 있음

**해야 할 작업:**
- [ ] Supabase Realtime 알림 채널
- [ ] 알림 목록 페이지
- [ ] 알림 읽음 처리
- [ ] 알림 설정

**예상 시간:** 6-8시간

---

### 10. AI 추천 기능
**현재 상태:**
- 미구현

**해야 할 작업:**
- [ ] OpenAI API 연동
- [ ] 사용자 선호도 분석
- [ ] 공연 추천 알고리즘
- [ ] 추천 결과 UI

**예상 시간:** 8-10시간

---

## 📊 테스트 현황

### 현재 테스트 상태 ✅
```
Test Files  9 passed (9)
     Tests  97 passed (97)
```

### 통과한 테스트
- ✅ useGroupPurchaseStore.test.ts (19 tests)
- ✅ useCartStore.test.ts (20 tests)
- ✅ usePerformanceLike.test.ts (7 tests)
- ✅ paymentApi.test.ts (12 tests)
- ✅ CartSheet.test.tsx (11 tests)
- ✅ GroupPurchaseCard.test.tsx (10 tests)
- ✅ CheckoutPage.test.tsx (9 tests) - 신규
- ✅ PerformanceDetail.test.tsx (6 tests) - 신규
- ✅ GroupPurchaseDetail.test.tsx (3 tests) - 신규

### 추가로 작성해야 할 테스트
- [x] CheckoutPage 컴포넌트 테스트 ✅
- [x] PerformanceDetail 컴포넌트 테스트 ✅
- [x] GroupPurchaseDetail 컴포넌트 테스트 ✅
- [ ] E2E 테스트 (Playwright)

---

## 🎯 추천 작업 순서

### 이번 주 (우선순위)
1. ~~**실패한 테스트 수정**~~ ✅ 완료
2. ~~**Performance Detail 지도 개선**~~ ✅ 완료
3. ~~**실시간 평점 업데이트**~~ ✅ 완료
4. **다크모드 지원 완성** - 3-4시간 ⭐⭐ (다음 추천)

### 다음 주
5. ~~**이미지 최적화**~~ ✅ 완료
6. ~~**로딩 스켈레톤**~~ ✅ 완료 (2025-01-27)
7. ~~**무한 스크롤**~~ ✅ 완료 (2025-01-27)

### 그 다음 주
8. ~~**Matching Card 스와이프**~~ ✅ 완료 (2025-01-27)
9. **실제 Supabase 연결** - 8-12시간

---

## 📝 참고 문서

### 완료된 작업 문서
- `PERFORMANCE_LIKE_ENHANCEMENT.md` - 좋아요 기능 강화
- `COMPONENT_TEST_FIX.md` - 테스트 문제 해결
- `PAYMENT_AND_TESTS_SUMMARY.md` - 결제 기능 및 테스트
- `PERFORMANCE_MAP_ENHANCEMENT.md` - 지도 개선

### 가이드 문서
- `docs/COMPONENT_IMPROVEMENT_GUIDE.md` - 컴포넌트 개선 가이드
- `docs/KAKAO_MAP_GUIDE.md` - 카카오 맵 통합 가이드
- `docs/SOCIAL_AUTH_SETUP.md` - 소셜 로그인 설정
- `DARK_MODE_IMPLEMENTATION.md` - 다크모드 구현
- `LOADING_SKELETON_IMPLEMENTATION.md` - 로딩 스켈레톤

### 계획 문서
- `MUSEYOU_UPGRADE_PLAN.md` - 전체 업그레이드 계획
- `IMPLEMENTATION_STATUS.md` - 구현 현황
- `NEXT_STEPS.md` - 다음 단계

---

## 💡 작업 팁

### 테스트 수정 시
```typescript
// 더 유연한 쿼리 사용
expect(screen.getByText(/테스트 극장/i)).toBeInTheDocument();
// 또는
expect(screen.getByText((content, element) => {
  return element?.textContent?.includes('테스트 극장') ?? false;
})).toBeInTheDocument();
```

### 새 기능 추가 시
1. 문서 확인 (`docs/` 폴더)
2. 관련 prompts 확인 (`components/*/prompts/`)
3. 테스트 코드 작성
4. 문서 업데이트

---

**마지막 업데이트:** 2025-01-27  
**테스트 상태:** 97개 테스트 모두 통과 ✅  
**현재 브랜치:** `feat/matching-swipe-and-tests` (PR 생성 완료)  
**다음 추천 작업:** 다크모드 지원 완성 (2순위)
