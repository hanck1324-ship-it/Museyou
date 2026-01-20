# 공유, 알림, 통계, 성능 최적화 기능 추가

## 📋 작업 내용

### 주요 기능
- ✅ 공유 기능 강화
  - Web Share API 지원
  - SNS 공유 (페이스북, 트위터)
  - 링크 복사 기능
  - GroupPurchaseCard, GroupPurchaseDetail에 공유 버튼 추가

- ✅ 알림 시스템
  - 브라우저 Notification API 통합
  - 공동구매 마감 임박 알림
  - 목표 달성 알림
  - 새 참여자/취소 알림

- ✅ 통계/대시보드
  - GroupPurchaseStats 컴포넌트 추가
  - 전체 공동구매 통계 표시
  - 진행률, 절약 금액, 할인율 통계

- ✅ 성능 최적화
  - GroupPurchaseCard 메모이제이션
  - 이미지 지연 로딩 (lazy loading)
  - useCallback으로 이벤트 핸들러 최적화

## 📁 새로 추가된 파일

### Utils
- `src/lib/utils/share.ts` - 공유 유틸리티 함수
- `src/lib/utils/notifications.ts` - 알림 유틸리티 함수

### Components
- `src/components/group-purchases/GroupPurchaseStats.tsx` - 통계 대시보드 컴포넌트

## 🔄 수정된 파일

- `src/components/group-purchases/GroupPurchaseCard.tsx` - 공유 버튼 추가, 메모이제이션, 이미지 지연 로딩
- `src/components/group-purchases/GroupPurchaseDetail.tsx` - 공유 버튼 추가
- `src/components/group-purchases/GroupPurchaseList.tsx` - 통계 컴포넌트 통합
- `src/lib/hooks/useGroupPurchaseRealtime.ts` - 알림 유틸리티 import 추가

## 🧪 테스트 방법

1. **공유 기능**
   - 공동구매 카드에서 공유 버튼 클릭
   - Web Share API 동작 확인 (모바일)
   - 링크 복사 기능 확인 (데스크톱)
   - 페이스북/트위터 공유 확인

2. **알림 시스템**
   - 브라우저 알림 권한 요청 확인
   - 공동구매 마감 임박 시 알림 확인
   - 목표 달성 시 알림 확인

3. **통계 대시보드**
   - 전체 공동구매 목록에서 통계 확인
   - 통계 수치 정확성 확인

4. **성능 최적화**
   - 이미지 지연 로딩 확인 (Network 탭)
   - 컴포넌트 리렌더링 최소화 확인 (React DevTools)

## 📝 참고사항

- 공유 기능은 Web Share API를 우선 사용하며, 지원하지 않는 경우 링크 복사로 대체
- 알림은 브라우저 Notification API를 사용하며, 권한이 없으면 토스트로 대체
- 통계는 실시간으로 계산되며, 공동구매 목록이 변경되면 자동 업데이트
- 성능 최적화는 React.memo와 useCallback을 활용하여 불필요한 리렌더링 방지

## 🔗 관련 이슈

Closes #[이슈 번호]
