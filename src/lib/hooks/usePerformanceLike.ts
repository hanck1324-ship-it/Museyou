import { useState, useEffect } from 'react';
import { performanceApi } from '@/lib/api/api';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '@/lib/supabase/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

/**
 * 공연 좋아요 기능을 관리하는 Hook
 * @param performanceId 공연 ID
 * @returns 좋아요 상태, 좋아요 수, 토글 함수
 */
export function usePerformanceLike(performanceId: string) {
  const { user, isLoggedIn } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 좋아요 상태 및 좋아요 수 로드
  useEffect(() => {
    async function loadLikeStatus() {
      try {
        const result = await performanceApi.checkLikeStatus(performanceId);
        setIsLiked(result.liked || false);
        setLikeCount(result.likeCount || 0);
      } catch (error) {
        console.error('좋아요 상태 로드 실패:', error);
        setIsLiked(false);
        setLikeCount(0);
      } finally {
        setIsInitialized(true);
      }
    }

    loadLikeStatus();
  }, [performanceId]);

  // 실시간 좋아요 수 업데이트 (Supabase Realtime)
  useEffect(() => {
    // 모킹 모드에서는 실시간 업데이트 비활성화
    const USE_MOCK_MODE = true; // api.ts에서 가져와야 하지만 일단 하드코딩
    if (USE_MOCK_MODE) {
      return;
    }

    const channel = supabase
      .channel(`performance-likes-${performanceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `performance_id=eq.${performanceId}`
        },
        async () => {
          // 좋아요 수 재조회
          try {
            const count = await performanceApi.getLikeCount(performanceId);
            setLikeCount(count);
            
            // 사용자 좋아요 상태도 재확인
            if (isLoggedIn && user) {
              const result = await performanceApi.checkLikeStatus(performanceId);
              setIsLiked(result.liked || false);
            }
          } catch (error) {
            console.error('실시간 좋아요 수 업데이트 실패:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [performanceId, isLoggedIn, user]);

  /**
   * 좋아요 토글
   */
  const toggle = async () => {
    if (!isLoggedIn || !user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const previousState = isLiked;

    try {
      // 낙관적 업데이트 (Optimistic Update)
      setIsLiked(!previousState);

      const result = await performanceApi.toggleLike(performanceId);

      // API 응답에 따라 상태 업데이트
      if (result.liked !== undefined) {
        setIsLiked(result.liked);
      } else {
        // 응답에 liked가 없으면 성공 여부로 판단
        setIsLiked(result.success ? !previousState : previousState);
      }

      // 좋아요 수 업데이트
      if (result.likeCount !== undefined) {
        setLikeCount(result.likeCount);
      }

      // 성공 메시지
      if (result.liked || (result.success && !previousState)) {
        toast.success('좋아요를 추가했습니다');
      } else {
        toast.success('좋아요를 취소했습니다');
      }
    } catch (error: any) {
      // 에러 발생 시 롤백
      setIsLiked(previousState);
      
      const errorMessage = error.message || '좋아요 처리 중 오류가 발생했습니다';
      
      if (errorMessage.includes('로그인')) {
        toast.error('로그인이 필요합니다');
      } else if (errorMessage.includes('network') || errorMessage.includes('네트워크')) {
        toast.error('네트워크 연결을 확인해주세요');
      } else {
        toast.error(errorMessage);
      }
      
      console.error('좋아요 처리 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    toggle,
    isLoading,
    isInitialized,
  };
}
