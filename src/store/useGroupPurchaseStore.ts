import { create } from 'zustand';
import { 
  GroupPurchase, 
  GroupPurchaseFilters, 
  GroupPurchaseSortBy,
  CreateGroupPurchaseData,
  JoinGroupPurchaseData 
} from '../lib/types/groupPurchase';
import { groupPurchaseApi } from '../lib/api/groupPurchaseApi';
import { toast } from 'sonner';
import { handleError } from '../lib/utils/errorHandler';

interface GroupPurchaseState {
  // 목록
  groupPurchases: GroupPurchase[];
  isLoading: boolean;
  error: string | null;
  
  // 필터/정렬
  filters: GroupPurchaseFilters;
  sortBy: GroupPurchaseSortBy;
  
  // 선택된 공동구매
  selectedGroupPurchase: GroupPurchase | null;
  isDetailLoading: boolean;
  
  // 내 공동구매
  myGroupPurchases: GroupPurchase[];
  myCreatedGroupPurchases: GroupPurchase[];
  
  // Actions
  fetchGroupPurchases: (filters?: GroupPurchaseFilters) => Promise<void>;
  fetchGroupPurchaseDetail: (id: string) => Promise<void>;
  createGroupPurchase: (data: CreateGroupPurchaseData) => Promise<GroupPurchase | null>;
  joinGroupPurchase: (id: string, data: JoinGroupPurchaseData) => Promise<void>;
  cancelJoin: (id: string) => Promise<void>;
  updateFilters: (filters: Partial<GroupPurchaseFilters>) => void;
  setSortBy: (sortBy: GroupPurchaseSortBy) => void;
  fetchMyGroupPurchases: () => Promise<void>;
  fetchMyCreatedGroupPurchases: () => Promise<void>;
  updateGroupPurchase: (id: string, data: Partial<CreateGroupPurchaseData>) => Promise<GroupPurchase | null>;
  deleteGroupPurchase: (id: string) => Promise<void>;
  clearSelected: () => void;
}

export const useGroupPurchaseStore = create<GroupPurchaseState>((set, get) => ({
  // 초기 상태
  groupPurchases: [],
  isLoading: false,
  error: null,
  filters: {},
  sortBy: 'popular',
  selectedGroupPurchase: null,
  isDetailLoading: false,
  myGroupPurchases: [],
  myCreatedGroupPurchases: [],

  // 공동구매 목록 조회
  fetchGroupPurchases: async (filters?: GroupPurchaseFilters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const sortBy = get().sortBy;
      const data = await groupPurchaseApi.getAll(currentFilters, sortBy);
      set({ groupPurchases: data, isLoading: false });
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      set({ 
        error: errorInfo.userMessage, 
        isLoading: false,
        groupPurchases: []
      });
      toast.error(errorInfo.userMessage);
    }
  },

  // 공동구매 상세 조회
  fetchGroupPurchaseDetail: async (id: string) => {
    set({ isDetailLoading: true, error: null });
    try {
      const data = await groupPurchaseApi.getById(id);
      set({ selectedGroupPurchase: data, isDetailLoading: false });
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      set({ 
        error: errorInfo.userMessage, 
        isDetailLoading: false,
        selectedGroupPurchase: null
      });
      toast.error(errorInfo.userMessage);
    }
  },

  // 공동구매 생성
  createGroupPurchase: async (data: CreateGroupPurchaseData) => {
    try {
      const newGroupPurchase = await groupPurchaseApi.create(data);
      toast.success('문화 공동구매가 생성되었습니다! 🎉');
      
      // 목록 새로고침
      await get().fetchGroupPurchases();
      
      return newGroupPurchase;
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      toast.error(errorInfo.userMessage);
      return null;
    }
  },

  // 공동구매 참여
  joinGroupPurchase: async (id: string, data: JoinGroupPurchaseData) => {
    try {
      await groupPurchaseApi.join(id, data);
      toast.success('문화 공동구매에 참여했습니다! 🎊');
      
      // 상세 정보 새로고침
      await get().fetchGroupPurchaseDetail(id);
      
      // 목록 새로고침
      await get().fetchGroupPurchases();
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      toast.error(errorInfo.userMessage);
      throw error;
    }
  },

  // 참여 취소
  cancelJoin: async (id: string) => {
    try {
      await groupPurchaseApi.cancelJoin(id);
      toast.success('참여가 취소되었습니다.');
      
      // 상세 정보 새로고침
      await get().fetchGroupPurchaseDetail(id);
      
      // 목록 새로고침
      await get().fetchGroupPurchases();
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      toast.error(errorInfo.userMessage);
      throw error;
    }
  },

  // 필터 업데이트
  updateFilters: (filters: Partial<GroupPurchaseFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  // 정렬 변경
  setSortBy: (sortBy: GroupPurchaseSortBy) => {
    set({ sortBy });
  },

  // 내가 참여한 공동구매 목록
  fetchMyGroupPurchases: async () => {
    try {
      const data = await groupPurchaseApi.getMyGroupPurchases();
      set({ myGroupPurchases: data });
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      set({ myGroupPurchases: [] });
      console.error('내 공동구매 조회 실패:', errorInfo);
    }
  },

  // 내가 생성한 공동구매 목록
  fetchMyCreatedGroupPurchases: async () => {
    try {
      const data = await groupPurchaseApi.getMyCreatedGroupPurchases();
      set({ myCreatedGroupPurchases: data });
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      set({ myCreatedGroupPurchases: [] });
      console.error('내가 생성한 공동구매 조회 실패:', errorInfo);
    }
  },

  // 공동구매 수정
  updateGroupPurchase: async (id: string, data: Partial<CreateGroupPurchaseData>) => {
    try {
      const updated = await groupPurchaseApi.update(id, data);
      toast.success('공동구매가 수정되었습니다!');
      
      // 목록 새로고침
      await get().fetchGroupPurchases();
      await get().fetchMyCreatedGroupPurchases();
      
      // 상세 정보도 새로고침
      if (get().selectedGroupPurchase?.id === id) {
        await get().fetchGroupPurchaseDetail(id);
      }
      
      return updated;
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      toast.error(errorInfo.userMessage);
      return null;
    }
  },

  // 공동구매 삭제
  deleteGroupPurchase: async (id: string) => {
    try {
      await groupPurchaseApi.delete(id);
      toast.success('공동구매가 삭제되었습니다.');
      
      // 목록 새로고침
      await get().fetchGroupPurchases();
      await get().fetchMyCreatedGroupPurchases();
      
      // 선택된 공동구매가 삭제된 것이라면 초기화
      if (get().selectedGroupPurchase?.id === id) {
        get().clearSelected();
      }
    } catch (error) {
      const errorInfo = handleError(error, {
        showToast: false,
        logError: true,
      });
      toast.error(errorInfo.userMessage);
      throw error;
    }
  },

  // 선택된 공동구매 초기화
  clearSelected: () => {
    set({ selectedGroupPurchase: null });
  },
}));
