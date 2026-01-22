# 계속 해야 할 작업 정리 📋

## ✅ 오늘 완료한 작업

### 1. Performance Card 좋아요 기능 강화 ✅
- Supabase likes 테이블 연동 강화
- 좋아요 수 표시 기능 추가
- 실시간 좋아요 수 업데이트 (Supabase Realtime)
- 테스트 코드 작성 (7개 테스트 모두 통과)

### 2. 컴포넌트 테스트 문제 해결 ✅
- UI 컴포넌트 import 문제 수정 (버전 번호 제거)
- 테스트 실행 가능하도록 개선
- 68개 테스트 통과, 11개 테스트 실패 (테스트 코드 개선 필요)

---

## 🔴 즉시 해야 할 작업 (우선순위 높음)

### 1. 실패한 테스트 수정 (11개)
**현재 상태:**
```
❯ CartSheet.test.tsx (11 tests | 5 failed)
❯ GroupPurchaseCard.test.tsx (10 tests | 6 failed)
```

**해야 할 작업:**
- [ ] CartSheet.test.tsx 실패 테스트 수정 (5개)
  - 장바구니 아이템 목록 표시 테스트
  - 총 결제금액 계산 테스트
  - 결제하기 버튼 동작 테스트
  - 아이템 개수 표시 테스트
- [ ] GroupPurchaseCard.test.tsx 실패 테스트 수정 (6개)
  - 가격 표시 관련 테스트
  - UI 요소 검증 테스트

**예상 시간:** 1-2시간

---

## 🟡 단기 작업 (1-2주 내)

### 2. Performance Detail 지도 개선
**현재 상태:**
- 기본 지도 기능만 있음
- 임시 좌표 사용 중

**해야 할 작업:**
- [ ] 실제 공연장 좌표 데이터 통합
- [ ] 카카오 주소 검색 API 연동
- [ ] 길찾기 기능 강화
- [ ] 주변 지하철역 표시

**참고 문서:** `docs/KAKAO_MAP_GUIDE.md`

**예상 시간:** 2-3시간

### 3. 실시간 평점 업데이트
**현재 상태:**
- 정적 데이터 사용

**해야 할 작업:**
- [ ] Supabase Realtime 구독 추가
- [ ] 리뷰 추가 시 평점 자동 재계산
- [ ] UI 자동 업데이트

**예상 시간:** 1-2시간

### 4. 이미지 최적화
**현재 상태:**
- 원본 이미지 로드

**해야 할 작업:**
- [ ] WebP 변환
- [ ] Lazy Loading 적용
- [ ] 반응형 이미지 (srcset)
- [ ] 이미지 캐싱

**예상 시간:** 2-3시간

---

## 🟢 중기 작업 (3-4주 내)

### 5. Matching Card 스와이프 기능
**현재 상태:**
- 기본 카드 레이아웃만 있음

**해야 할 작업:**
- [ ] Framer Motion 설치 및 설정
- [ ] 스와이프 애니메이션 구현
- [ ] 좋아요/패스 제스처 처리
- [ ] 매칭 알고리즘 개선

**예상 시간:** 4-6시간

### 6. 다크모드 지원
**현재 상태:**
- next-themes 설치됨
- 기본 설정만 있음

**해야 할 작업:**
- [ ] 모든 컴포넌트에 다크모드 스타일 적용
- [ ] 테마 토글 버튼 추가
- [ ] 시스템 테마 감지
- [ ] 다크모드 테스트

**참고 문서:** `DARK_MODE_IMPLEMENTATION.md`

**예상 시간:** 6-8시간

### 7. 로딩 스켈레톤
**현재 상태:**
- 일부 컴포넌트에만 있음

**해야 할 작업:**
- [ ] 모든 카드 컴포넌트에 스켈레톤 추가
- [ ] 목록 페이지 스켈레톤
- [ ] 상세 페이지 스켈레톤
- [ ] 로딩 상태 관리 개선

**참고 문서:** `LOADING_SKELETON_IMPLEMENTATION.md`

**예상 시간:** 4-6시간

### 8. 무한 스크롤
**현재 상태:**
- 페이지네이션 없음

**해야 할 작업:**
- [ ] Intersection Observer API 사용
- [ ] 공연 목록 무한 스크롤
- [ ] 공동구매 목록 무한 스크롤
- [ ] 로딩 인디케이터

**예상 시간:** 3-4시간

---

## 🔵 장기 작업 (5-6주 내)

### 9. 실제 Supabase 연결
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

### 10. 소셜 로그인 강화
**현재 상태:**
- 기본 소셜 로그인 구현됨

**해야 할 작업:**
- [ ] 비밀번호 재설정 기능
- [ ] 이메일 인증
- [ ] 프로필 사진 업로드
- [ ] 소셜 로그인 테스트

**참고 문서:** `docs/SOCIAL_AUTH_IMPROVEMENTS.md`

**예상 시간:** 4-6시간

### 11. 알림 시스템
**현재 상태:**
- 브라우저 알림만 있음

**해야 할 작업:**
- [ ] Supabase Realtime 알림 채널
- [ ] 알림 목록 페이지
- [ ] 알림 읽음 처리
- [ ] 알림 설정

**예상 시간:** 6-8시간

### 12. AI 추천 기능
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

### 현재 테스트 상태
```
Test Files  2 failed | 4 passed (6)
     Tests  11 failed | 68 passed (79)
```

### 통과한 테스트
- ✅ useGroupPurchaseStore.test.ts (19 tests)
- ✅ useCartStore.test.ts (20 tests)
- ✅ usePerformanceLike.test.ts (7 tests)
- ✅ paymentApi.test.ts (12 tests)

### 실패한 테스트
- ❌ CartSheet.test.tsx (5 failed)
- ❌ GroupPurchaseCard.test.tsx (6 failed)

### 추가로 작성해야 할 테스트
- [ ] CheckoutPage 컴포넌트 테스트
- [ ] PerformanceDetail 컴포넌트 테스트
- [ ] GroupPurchaseDetail 컴포넌트 테스트
- [ ] E2E 테스트 (Playwright)

---

## 🎯 추천 작업 순서

### 이번 주 (우선순위)
1. **실패한 테스트 수정** (11개) - 1-2시간
2. **Performance Detail 지도 개선** - 2-3시간
3. **실시간 평점 업데이트** - 1-2시간

### 다음 주
4. **이미지 최적화** - 2-3시간
5. **로딩 스켈레톤** - 4-6시간
6. **무한 스크롤** - 3-4시간

### 그 다음 주
7. **Matching Card 스와이프** - 4-6시간
8. **다크모드 지원** - 6-8시간

---

## 📝 참고 문서

### 완료된 작업 문서
- `PERFORMANCE_LIKE_ENHANCEMENT.md` - 좋아요 기능 강화
- `COMPONENT_TEST_FIX.md` - 테스트 문제 해결
- `PAYMENT_AND_TESTS_SUMMARY.md` - 결제 기능 및 테스트

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
**다음 리뷰:** 작업 진행 시 업데이트
