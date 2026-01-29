import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * 무한 스크롤을 위한 커스텀 훅
 * Intersection Observer API를 사용하여 스크롤 끝에 도달하면 자동으로 더 많은 데이터를 로드합니다.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    await onLoadMore();
  }, [onLoadMore, hasMore, isLoading]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    // 기존 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 로딩 중이거나 더 이상 데이터가 없으면 observer 생성하지 않음
    if (isLoading || !hasMore) {
      return;
    }

    // 새로운 observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore, hasMore, isLoading, threshold, rootMargin]);

  return loadMoreRef;
}
