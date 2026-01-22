# Performance Card 좋아요 기능 강화 🎯

## 📋 작업 개요

Performance Card의 좋아요 기능을 강화하여 Supabase와의 실제 연동, 좋아요 수 표시, 실시간 업데이트 기능을 추가했습니다.

## ✅ 완료된 작업

### 1. Supabase likes 테이블 연동 강화
- **파일**: `src/lib/api/api.ts`
- **변경사항**:
  - `toggleLike()`: Supabase를 통한 실제 좋아요 토글 기능 추가
  - `checkLikeStatus()`: 좋아요 상태와 좋아요 수를 함께 반환하도록 개선
  - `getLikeCount()`: 좋아요 수만 조회하는 새로운 함수 추가
  - 모킹 모드와 실제 Supabase 모드 모두 지원

### 2. 좋아요 수 표시 기능 추가
- **파일**: `src/components/performances/PerformanceCard.tsx`
- **변경사항**:
  - 좋아요 버튼 옆에 좋아요 수 표시
  - 좋아요 수가 0보다 클 때만 표시
  - 반응형 디자인 적용 (모바일/데스크톱)

### 3. 실시간 좋아요 수 업데이트
- **파일**: `src/lib/hooks/usePerformanceLike.ts`
- **변경사항**:
  - Supabase Realtime 구독을 통한 실시간 좋아요 수 업데이트
  - 좋아요 상태와 좋아요 수를 함께 관리
  - 모킹 모드에서는 실시간 업데이트 비활성화

### 4. 테스트 코드 작성
- **파일**: `src/lib/hooks/usePerformanceLike.test.ts`
- **테스트 케이스**:
  - 초기화 테스트 (좋아요 상태 및 수 로드)
  - 로그인하지 않은 경우 처리
  - 좋아요 추가/취소 기능
  - 에러 발생 시 롤백
  - 로딩 상태 관리
  - 좋아요 수 업데이트

## 🔧 기술적 개선사항

### API 함수 개선
```typescript
// 이전
async toggleLike(performanceId: string) {
  // 모킹 모드만 지원
  return { success: true, liked: true };
}

// 개선 후
async toggleLike(performanceId: string) {
  // 모킹 모드와 Supabase 모드 모두 지원
  // 좋아요 수도 함께 반환
  return { success: true, liked: true, likeCount: 5 };
}
```

### Hook 개선
```typescript
// 이전
export function usePerformanceLike(performanceId: string) {
  const [isLiked, setIsLiked] = useState(false);
  // ...
}

// 개선 후
export function usePerformanceLike(performanceId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  // Supabase Realtime 구독 추가
  // ...
  return { isLiked, likeCount, toggle, isLoading, isInitialized };
}
```

### 컴포넌트 개선
```tsx
// 이전
<Button onClick={handleToggleLike}>
  <Heart className={isLiked ? 'fill-current' : ''} />
</Button>

// 개선 후
<div className="flex items-center gap-2">
  <Button onClick={handleToggleLike}>
    <Heart className={isLiked ? 'fill-current' : ''} />
  </Button>
  {likeCount > 0 && (
    <div className="bg-white/90 px-2 py-1 rounded-full">
      {likeCount}
    </div>
  )}
</div>
```

## 📊 테스트 결과

```
✓ src/lib/hooks/usePerformanceLike.test.ts (7 tests) 389ms

Test Files  1 passed (1)
     Tests  7 passed (7)
```

## 🚀 다음 단계

### 추천 개선사항
1. **좋아요한 공연 목록 페이지**: 사용자가 좋아요한 공연들을 모아보는 페이지
2. **좋아요 알림**: 다른 사용자가 좋아요를 누르면 알림 표시
3. **좋아요 통계**: 인기 공연 순위, 카테고리별 좋아요 통계
4. **성능 최적화**: 좋아요 수를 캐싱하여 불필요한 API 호출 감소

## 📝 참고사항

- 모킹 모드에서는 localStorage를 사용하여 좋아요 데이터를 관리합니다.
- 실제 Supabase 모드로 전환하려면 `src/lib/api/api.ts`의 `USE_MOCK_MODE`를 `false`로 변경하세요.
- Supabase Realtime 기능을 사용하려면 Supabase 대시보드에서 Realtime을 활성화해야 합니다.

## 🔗 관련 파일

- `src/lib/api/api.ts`: API 함수
- `src/lib/hooks/usePerformanceLike.ts`: 좋아요 Hook
- `src/components/performances/PerformanceCard.tsx`: Performance Card 컴포넌트
- `src/lib/hooks/usePerformanceLike.test.ts`: 테스트 코드

---

**작업 완료일**: 2025-01-27  
**작업자**: AI Assistant  
**상태**: ✅ 완료
