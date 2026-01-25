import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '@/lib/supabase/config';
import { createClient } from '@supabase/supabase-js';
import { reviewApi } from '@/lib/api/api';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// 모킹 모드 확인 (api.ts와 동일한 방식)
const USE_MOCK_MODE = true; // TODO: 환경 변수나 설정에서 가져오기

interface RatingData {
  rating: number;
  reviewCount: number;
}

/**
 * 공연 평점을 실시간으로 관리하는 Hook
 * @param performanceId 공연 ID
 * @returns 평점 데이터 및 리프레시 함수
 */
export function usePerformanceRating(performanceId: string) {
  const [ratingData, setRatingData] = useState<RatingData>({
    rating: 0,
    reviewCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 초기 평점 로드
  useEffect(() => {
    loadRating();
  }, [performanceId]);

  // 실시간 업데이트 구독
  useEffect(() => {
    if (USE_MOCK_MODE) {
      // 모킹 모드: CustomEvent를 사용한 실시간 업데이트
      const eventName = `review-updated-${performanceId}`;
      
      const handleReviewUpdate = () => {
        // 리뷰 변경 시 평점 재계산
        loadRating();
      };

      // 이벤트 리스너 등록
      window.addEventListener(eventName, handleReviewUpdate);

      // storage 이벤트도 구독 (다른 탭에서 변경된 경우)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === `reviews_${performanceId}`) {
          loadRating();
        }
      };
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener(eventName, handleReviewUpdate);
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
      // 실제 Supabase Realtime 구독
      const channel = supabase
        .channel(`performance-rating-${performanceId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reviews',
            filter: `performance_id=eq.${performanceId}`
          },
          () => {
            // 리뷰 변경 시 평점 재계산
            loadRating();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [performanceId]);

  const loadRating = async () => {
    try {
      setIsLoading(true);
      const result = await reviewApi.getByPerformanceId(performanceId);
      
      if (result && result.reviews) {
        const reviews = result.reviews;
        const reviewCount = reviews.length;
        
        if (reviewCount > 0) {
          const totalRating = reviews.reduce((sum: number, review: any) => {
            return sum + (review.rating || 0);
          }, 0);
          const averageRating = totalRating / reviewCount;
          
          setRatingData({
            rating: Math.round(averageRating * 10) / 10, // 소수점 1자리
            reviewCount,
          });
        } else {
          setRatingData({
            rating: 0,
            reviewCount: 0,
          });
        }
      }
    } catch (error) {
      console.error('평점 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rating: ratingData.rating,
    reviewCount: ratingData.reviewCount,
    isLoading,
    refresh: loadRating,
  };
}
