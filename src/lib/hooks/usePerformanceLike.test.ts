import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePerformanceLike } from './usePerformanceLike';
import { performanceApi } from '@/lib/api/api';
import { useAuthStore } from '@/store/useAuthStore';

// Mock dependencies
vi.mock('@/lib/api/api');
vi.mock('@/store/useAuthStore');
vi.mock('@/lib/supabase/config', () => ({
  projectId: 'test-project',
  publicAnonKey: 'test-key',
}));
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  })),
}));

describe('usePerformanceLike', () => {
  const mockPerformanceId = 'performance-1';
  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      isLoggedIn: true,
    });
  });

  describe('초기화', () => {
    it('좋아요 상태와 좋아요 수를 로드해야 함', async () => {
      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: true,
        likeCount: 5,
      });

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(5);
    });

    it('로그인하지 않은 경우 좋아요 상태는 false여야 함', async () => {
      (useAuthStore as any).mockReturnValue({
        user: null,
        isLoggedIn: false,
      });

      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: false,
        likeCount: 3,
      });

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(3);
    });
  });

  describe('toggle 함수', () => {
    it('좋아요를 추가해야 함', async () => {
      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: false,
        likeCount: 0,
      });

      (performanceApi.toggleLike as any).mockResolvedValue({
        success: true,
        liked: true,
        likeCount: 1,
      });

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.toggle();
      });

      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(1);
      expect(performanceApi.toggleLike).toHaveBeenCalledWith(mockPerformanceId);
    });

    it('좋아요를 취소해야 함', async () => {
      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: true,
        likeCount: 1,
      });

      (performanceApi.toggleLike as any).mockResolvedValue({
        success: true,
        liked: false,
        likeCount: 0,
      });

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.toggle();
      });

      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(0);
    });

    it('에러 발생 시 이전 상태로 롤백해야 함', async () => {
      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: false,
        likeCount: 0,
      });

      (performanceApi.toggleLike as any).mockRejectedValue(
        new Error('네트워크 오류')
      );

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const previousLiked = result.current.isLiked;
      const previousCount = result.current.likeCount;

      await act(async () => {
        try {
          await result.current.toggle();
        } catch (error) {
          // 에러는 무시 (hook 내부에서 처리)
        }
      });

      // 에러 발생 시 이전 상태 유지
      expect(result.current.isLiked).toBe(previousLiked);
      expect(result.current.likeCount).toBe(previousCount);
    });

    it('로딩 상태를 관리해야 함', async () => {
      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: false,
        likeCount: 0,
      });

      let resolveToggle: (value: any) => void;
      const togglePromise = new Promise((resolve) => {
        resolveToggle = resolve;
      });

      (performanceApi.toggleLike as any).mockReturnValue(togglePromise);

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveToggle!({
          success: true,
          liked: true,
          likeCount: 1,
        });
        await togglePromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('좋아요 수 업데이트', () => {
    it('toggle 후 좋아요 수가 업데이트되어야 함', async () => {
      (performanceApi.checkLikeStatus as any).mockResolvedValue({
        liked: false,
        likeCount: 5,
      });

      (performanceApi.toggleLike as any).mockResolvedValue({
        success: true,
        liked: true,
        likeCount: 6,
      });

      const { result } = renderHook(() => usePerformanceLike(mockPerformanceId));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.likeCount).toBe(5);

      await act(async () => {
        await result.current.toggle();
      });

      expect(result.current.likeCount).toBe(6);
    });
  });
});
