import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGroupPurchaseStore } from './useGroupPurchaseStore';
import { GroupPurchase, CreateGroupPurchaseData, JoinGroupPurchaseData } from '../lib/types/groupPurchase';
import { Performance } from '../components/performances/PerformanceCard';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('../lib/utils/errorHandler', () => ({
  handleError: vi.fn((error) => ({
    userMessage: error.message || '오류가 발생했습니다',
    technicalMessage: error.message,
  })),
}));

vi.mock('../lib/api/groupPurchaseApi', () => ({
  groupPurchaseApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    join: vi.fn(),
    cancelJoin: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getMyGroupPurchases: vi.fn(),
    getMyCreatedGroupPurchases: vi.fn(),
  },
}));

import { groupPurchaseApi } from '../lib/api/groupPurchaseApi';

describe('useGroupPurchaseStore', () => {
  beforeEach(() => {
    // Reset store state
    useGroupPurchaseStore.setState({
      groupPurchases: [],
      isLoading: false,
      error: null,
      filters: {},
      sortBy: 'popular',
      selectedGroupPurchase: null,
      isDetailLoading: false,
      myGroupPurchases: [],
      myCreatedGroupPurchases: [],
    });
    vi.clearAllMocks();
  });

  const mockPerformance: Performance = {
    id: 'perf1',
    title: '테스트 공연',
    category: '뮤지컬',
    venue: '테스트 극장',
    district: '강남구',
    date: '2025.01.15',
    time: '19:00',
    price: '50,000원',
    image: 'https://example.com/image.jpg',
    rating: 4.5,
    reviewCount: 10,
    description: '테스트 설명',
    organizer: '테스트 주최자',
  };

  const mockGroupPurchase: GroupPurchase = {
    id: 'gp1',
    performanceId: 'perf1',
    performance: mockPerformance,
    targetParticipants: 10,
    currentParticipants: 5,
    discountRate: 10,
    originalPrice: 50000,
    discountedPrice: 45000,
    status: 'recruiting',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: 'user1',
    creator: {
      id: 'user1',
      name: '테스트 사용자',
      email: 'test@example.com',
    },
    participants: [],
    progress: 50,
  };

  describe('fetchGroupPurchases', () => {
    it('공동구매 목록을 성공적으로 가져와야 함', async () => {
      const mockData = [mockGroupPurchase];
      vi.mocked(groupPurchaseApi.getAll).mockResolvedValue(mockData);

      const { fetchGroupPurchases } = useGroupPurchaseStore.getState();
      await fetchGroupPurchases();

      const { groupPurchases, isLoading, error } = useGroupPurchaseStore.getState();
      expect(groupPurchases).toEqual(mockData);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it('에러 발생 시 에러 상태를 설정해야 함', async () => {
      const error = new Error('네트워크 오류');
      vi.mocked(groupPurchaseApi.getAll).mockRejectedValue(error);

      const { fetchGroupPurchases } = useGroupPurchaseStore.getState();
      await fetchGroupPurchases();

      const { groupPurchases, isLoading, error: storeError } = useGroupPurchaseStore.getState();
      expect(groupPurchases).toEqual([]);
      expect(isLoading).toBe(false);
      expect(storeError).toBeTruthy();
    });

    it('필터와 정렬 옵션을 전달해야 함', async () => {
      const mockData = [mockGroupPurchase];
      vi.mocked(groupPurchaseApi.getAll).mockResolvedValue(mockData);

      const { fetchGroupPurchases, updateFilters, setSortBy } = useGroupPurchaseStore.getState();
      updateFilters({ category: '뮤지컬', district: '강남구' });
      setSortBy('deadline');
      await fetchGroupPurchases();

      expect(groupPurchaseApi.getAll).toHaveBeenCalledWith(
        { category: '뮤지컬', district: '강남구' },
        'deadline'
      );
    });
  });

  describe('fetchGroupPurchaseDetail', () => {
    it('공동구매 상세 정보를 성공적으로 가져와야 함', async () => {
      vi.mocked(groupPurchaseApi.getById).mockResolvedValue(mockGroupPurchase);

      const { fetchGroupPurchaseDetail } = useGroupPurchaseStore.getState();
      await fetchGroupPurchaseDetail('gp1');

      const { selectedGroupPurchase, isDetailLoading, error } = useGroupPurchaseStore.getState();
      expect(selectedGroupPurchase).toEqual(mockGroupPurchase);
      expect(isDetailLoading).toBe(false);
      expect(error).toBeNull();
    });

    it('에러 발생 시 에러 상태를 설정해야 함', async () => {
      const error = new Error('공동구매를 찾을 수 없습니다');
      vi.mocked(groupPurchaseApi.getById).mockRejectedValue(error);

      const { fetchGroupPurchaseDetail } = useGroupPurchaseStore.getState();
      await fetchGroupPurchaseDetail('invalid-id');

      const { selectedGroupPurchase, isDetailLoading, error: storeError } = useGroupPurchaseStore.getState();
      expect(selectedGroupPurchase).toBeNull();
      expect(isDetailLoading).toBe(false);
      expect(storeError).toBeTruthy();
    });
  });

  describe('createGroupPurchase', () => {
    it('공동구매를 성공적으로 생성해야 함', async () => {
      const createData: CreateGroupPurchaseData = {
        performanceId: 'perf1',
        targetParticipants: 10,
        discountRate: 10,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: '테스트 설명',
      };

      vi.mocked(groupPurchaseApi.create).mockResolvedValue(mockGroupPurchase);

      const { createGroupPurchase } = useGroupPurchaseStore.getState();
      const result = await createGroupPurchase(createData);

      expect(result).toEqual(mockGroupPurchase);
      expect(groupPurchaseApi.create).toHaveBeenCalledWith(createData);
    });

    it('에러 발생 시 null을 반환해야 함', async () => {
      const error = new Error('생성 실패');
      vi.mocked(groupPurchaseApi.create).mockRejectedValue(error);

      const { createGroupPurchase } = useGroupPurchaseStore.getState();
      const result = await createGroupPurchase({
        performanceId: 'perf1',
        targetParticipants: 10,
        discountRate: 10,
        deadline: new Date().toISOString(),
      });

      expect(result).toBeNull();
    });
  });

  describe('joinGroupPurchase', () => {
    it('공동구매에 성공적으로 참여해야 함', async () => {
      vi.mocked(groupPurchaseApi.join).mockResolvedValue(undefined);

      const { joinGroupPurchase } = useGroupPurchaseStore.getState();
      const joinData: JoinGroupPurchaseData = {
        participantCount: 2,
        message: '참여하고 싶습니다!',
      };

      await joinGroupPurchase('gp1', joinData);

      expect(groupPurchaseApi.join).toHaveBeenCalledWith('gp1', joinData);
    });

    it('에러 발생 시 에러를 처리해야 함', async () => {
      const error = new Error('참여 실패');
      vi.mocked(groupPurchaseApi.join).mockRejectedValue(error);

      const { joinGroupPurchase } = useGroupPurchaseStore.getState();
      const joinData: JoinGroupPurchaseData = {
        participantCount: 2,
      };

      await expect(joinGroupPurchase('gp1', joinData)).rejects.toThrow();
    });
  });

  describe('cancelJoin', () => {
    it('공동구매 참여를 성공적으로 취소해야 함', async () => {
      vi.mocked(groupPurchaseApi.cancelJoin).mockResolvedValue(undefined);

      const { cancelJoin } = useGroupPurchaseStore.getState();
      await cancelJoin('gp1');

      expect(groupPurchaseApi.cancelJoin).toHaveBeenCalledWith('gp1');
    });
  });

  describe('updateFilters', () => {
    it('필터를 업데이트해야 함', () => {
      const { updateFilters, filters } = useGroupPurchaseStore.getState();
      
      updateFilters({ category: '뮤지컬', district: '강남구' });
      
      const updatedFilters = useGroupPurchaseStore.getState().filters;
      expect(updatedFilters.category).toBe('뮤지컬');
      expect(updatedFilters.district).toBe('강남구');
    });

    it('부분 필터 업데이트가 가능해야 함', () => {
      const { updateFilters } = useGroupPurchaseStore.getState();
      
      updateFilters({ category: '뮤지컬' });
      updateFilters({ district: '강남구' });
      
      const updatedFilters = useGroupPurchaseStore.getState().filters;
      expect(updatedFilters.category).toBe('뮤지컬');
      expect(updatedFilters.district).toBe('강남구');
    });

    it('필터를 초기화할 수 있어야 함', () => {
      const { updateFilters } = useGroupPurchaseStore.getState();
      
      updateFilters({ category: '뮤지컬', district: '강남구' });
      // 빈 객체로 업데이트하면 기존 필터가 유지됨 (부분 업데이트)
      // 완전 초기화를 위해서는 명시적으로 undefined를 전달해야 함
      updateFilters({ category: undefined, district: undefined });
      
      const updatedFilters = useGroupPurchaseStore.getState().filters;
      expect(updatedFilters.category).toBeUndefined();
      expect(updatedFilters.district).toBeUndefined();
    });
  });

  describe('setSortBy', () => {
    it('정렬 옵션을 설정해야 함', () => {
      const { setSortBy } = useGroupPurchaseStore.getState();
      
      setSortBy('deadline');
      expect(useGroupPurchaseStore.getState().sortBy).toBe('deadline');
      
      setSortBy('newest');
      expect(useGroupPurchaseStore.getState().sortBy).toBe('newest');
      
      setSortBy('discount');
      expect(useGroupPurchaseStore.getState().sortBy).toBe('discount');
    });
  });

  describe('fetchMyGroupPurchases', () => {
    it('내 공동구매 목록을 가져와야 함', async () => {
      const mockData = [mockGroupPurchase];
      vi.mocked(groupPurchaseApi.getMyGroupPurchases).mockResolvedValue(mockData);

      const { fetchMyGroupPurchases } = useGroupPurchaseStore.getState();
      await fetchMyGroupPurchases();

      const { myGroupPurchases } = useGroupPurchaseStore.getState();
      expect(myGroupPurchases).toEqual(mockData);
    });
  });

  describe('fetchMyCreatedGroupPurchases', () => {
    it('내가 생성한 공동구매 목록을 가져와야 함', async () => {
      const mockData = [mockGroupPurchase];
      vi.mocked(groupPurchaseApi.getMyCreatedGroupPurchases).mockResolvedValue(mockData);

      const { fetchMyCreatedGroupPurchases } = useGroupPurchaseStore.getState();
      await fetchMyCreatedGroupPurchases();

      const { myCreatedGroupPurchases } = useGroupPurchaseStore.getState();
      expect(myCreatedGroupPurchases).toEqual(mockData);
    });
  });

  describe('updateGroupPurchase', () => {
    it('공동구매를 성공적으로 수정해야 함', async () => {
      const updatedData = {
        targetParticipants: 15,
        discountRate: 15,
      };
      const updatedGroupPurchase = { ...mockGroupPurchase, ...updatedData };
      vi.mocked(groupPurchaseApi.update).mockResolvedValue(updatedGroupPurchase);

      const { updateGroupPurchase } = useGroupPurchaseStore.getState();
      const result = await updateGroupPurchase('gp1', updatedData);

      expect(result).toEqual(updatedGroupPurchase);
      expect(groupPurchaseApi.update).toHaveBeenCalledWith('gp1', updatedData);
    });
  });

  describe('deleteGroupPurchase', () => {
    it('공동구매를 성공적으로 삭제해야 함', async () => {
      vi.mocked(groupPurchaseApi.delete).mockResolvedValue(undefined);

      const { deleteGroupPurchase } = useGroupPurchaseStore.getState();
      await deleteGroupPurchase('gp1');

      expect(groupPurchaseApi.delete).toHaveBeenCalledWith('gp1');
    });
  });

  describe('clearSelected', () => {
    it('선택된 공동구매를 초기화해야 함', () => {
      useGroupPurchaseStore.setState({ selectedGroupPurchase: mockGroupPurchase });

      const { clearSelected } = useGroupPurchaseStore.getState();
      clearSelected();

      expect(useGroupPurchaseStore.getState().selectedGroupPurchase).toBeNull();
    });
  });
});
