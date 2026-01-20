import { 
  GroupPurchase, 
  GroupPurchaseFilters, 
  GroupPurchaseSortBy,
  CreateGroupPurchaseData,
  JoinGroupPurchaseData 
} from '../types/groupPurchase';
import { projectId, publicAnonKey } from '../supabase/config';
import { createClient } from '@supabase/supabase-js';
import { STORAGE_KEYS } from './mockData';

// 로컬 스토리지 헬퍼 함수 (api.ts에서 재사용)
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}
import { Performance } from '../../components/performances/PerformanceCard';

// 모킹 모드 활성화 (백엔드 연결 시 false로 변경)
const USE_MOCK_MODE = true;

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c003bd66`;

// Create Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Get access token
function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

// Generic API call helper
async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<any> {
  if (USE_MOCK_MODE) {
    console.log('[MOCK MODE] GroupPurchase API Call:', endpoint);
    return Promise.resolve({});
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth) {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

// Mock 데이터 생성 헬퍼
function createMockGroupPurchase(
  id: string,
  performance: Performance,
  overrides?: Partial<GroupPurchase>
): GroupPurchase {
  const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  const originalPrice = parseInt(performance.price.match(/(\d+,?\d*)/)?.[1]?.replace(/,/g, '') || '0');
  const discountRate = overrides?.discountRate || 10;
  const discountedPrice = Math.floor(originalPrice * (1 - discountRate / 100));
  
  return {
    id,
    performanceId: performance.id,
    performance,
    targetParticipants: overrides?.targetParticipants || 10,
    currentParticipants: overrides?.currentParticipants || 0,
    discountRate,
    originalPrice,
    discountedPrice,
    status: overrides?.status || 'recruiting',
    deadline: overrides?.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: currentUser?.id || 'user_1',
    creator: {
      id: currentUser?.id || 'user_1',
      name: currentUser?.name || '홍길동',
      email: currentUser?.email || 'test@example.com',
    },
    participants: [],
    description: overrides?.description || `${performance.title} 공동구매에 참여해주세요!`,
    progress: 0,
    ...overrides,
  };
}

// 초기화 로컬 스토리지 데이터
function initializeGroupPurchaseStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.GROUP_PURCHASES)) {
    setToStorage(STORAGE_KEYS.GROUP_PURCHASES, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS)) {
    setToStorage(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, []);
  }
}

if (USE_MOCK_MODE) {
  initializeGroupPurchaseStorage();
}

export const groupPurchaseApi = {
  // 목록 조회
  async getAll(
    filters?: GroupPurchaseFilters,
    sortBy: GroupPurchaseSortBy = 'popular'
  ): Promise<GroupPurchase[]> {
    if (USE_MOCK_MODE) {
      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      // performances는 mockData에서 가져옴
      const { mockPerformances } = await import('./mockData');
      const performances = mockPerformances as Performance[];
      
      // 필터링
      let filtered = groupPurchases.filter(gp => {
        if (filters?.category && gp.performance.category !== filters.category) return false;
        if (filters?.district && gp.performance.district !== filters.district) return false;
        if (filters?.status && gp.status !== filters.status) return false;
        if (filters?.minDiscountRate && gp.discountRate < filters.minDiscountRate) return false;
        if (filters?.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          if (!gp.performance.title.toLowerCase().includes(query) &&
              !gp.performance.venue.toLowerCase().includes(query)) {
            return false;
          }
        }
        return true;
      });
      
      // 정렬
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.currentParticipants - a.currentParticipants;
          case 'deadline':
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'discount':
            return b.discountRate - a.discountRate;
          default:
            return 0;
        }
      });
      
      return filtered;
    }

    return await apiCall('/group-purchases', {
      method: 'GET',
    });
  },

  // 상세 조회
  async getById(id: string): Promise<GroupPurchase> {
    if (USE_MOCK_MODE) {
      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      const participants = getFromStorage<any[]>(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, []);
      const groupPurchase = groupPurchases.find(gp => gp.id === id);
      
      if (!groupPurchase) {
        throw new Error('공동구매를 찾을 수 없습니다.');
      }
      
      // 참여자 정보 추가
      const groupParticipants = participants.filter(p => p.groupPurchaseId === id);
      groupPurchase.participants = groupParticipants;
      groupPurchase.progress = Math.min(100, (groupPurchase.currentParticipants / groupPurchase.targetParticipants) * 100);
      
      return groupPurchase;
    }

    return await apiCall(`/group-purchases/${id}`, {
      method: 'GET',
    }, true);
  },

  // 생성
  async create(data: CreateGroupPurchaseData): Promise<GroupPurchase> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const { mockPerformances } = await import('./mockData');
      const performances = mockPerformances as Performance[];
      const performance = performances.find(p => p.id === data.performanceId);
      
      if (!performance) {
        throw new Error('공연을 찾을 수 없습니다.');
      }

      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      const originalPrice = parseInt(performance.price.match(/(\d+,?\d*)/)?.[1]?.replace(/,/g, '') || '0');
      const discountedPrice = Math.floor(originalPrice * (1 - data.discountRate / 100));
      
      const newGroupPurchase: GroupPurchase = {
        id: `gp_${Date.now()}`,
        performanceId: data.performanceId,
        performance,
        targetParticipants: data.targetParticipants,
        currentParticipants: 0,
        discountRate: data.discountRate,
        originalPrice,
        discountedPrice,
        status: 'recruiting',
        deadline: data.deadline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorId: currentUser.id,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        participants: [],
        description: data.description,
        progress: 0,
      };

      groupPurchases.push(newGroupPurchase);
      setToStorage(STORAGE_KEYS.GROUP_PURCHASES, groupPurchases);

      return newGroupPurchase;
    }

    return await apiCall('/group-purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  // 참여
  async join(id: string, data: JoinGroupPurchaseData): Promise<void> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      const participants = getFromStorage<any[]>(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, []);
      
      const groupPurchase = groupPurchases.find(gp => gp.id === id);
      if (!groupPurchase) {
        throw new Error('공동구매를 찾을 수 없습니다.');
      }

      if (groupPurchase.status !== 'recruiting') {
        throw new Error('모집이 마감된 공동구매입니다.');
      }

      // 이미 참여했는지 확인
      const existingParticipant = participants.find(
        p => p.groupPurchaseId === id && p.userId === currentUser.id
      );
      if (existingParticipant) {
        throw new Error('이미 참여한 공동구매입니다.');
      }

      // 참여자 추가
      const newParticipant = {
        id: `participant_${Date.now()}`,
        groupPurchaseId: id,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        participantCount: data.participantCount,
        message: data.message,
        joinedAt: new Date().toISOString(),
      };

      participants.push(newParticipant);
      setToStorage(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, participants);

      // 공동구매 정보 업데이트
      groupPurchase.currentParticipants += data.participantCount;
      groupPurchase.progress = Math.min(100, (groupPurchase.currentParticipants / groupPurchase.targetParticipants) * 100);
      
      if (groupPurchase.currentParticipants >= groupPurchase.targetParticipants) {
        groupPurchase.status = 'completed';
      }

      groupPurchase.updatedAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.GROUP_PURCHASES, groupPurchases);

      return;
    }

    return await apiCall(`/group-purchases/${id}/join`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  // 참여 취소
  async cancelJoin(id: string): Promise<void> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      const participants = getFromStorage<any[]>(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, []);
      
      const groupPurchase = groupPurchases.find(gp => gp.id === id);
      if (!groupPurchase) {
        throw new Error('공동구매를 찾을 수 없습니다.');
      }

      const participantIndex = participants.findIndex(
        p => p.groupPurchaseId === id && p.userId === currentUser.id
      );

      if (participantIndex === -1) {
        throw new Error('참여하지 않은 공동구매입니다.');
      }

      const participant = participants[participantIndex];
      
      // 참여자 제거
      participants.splice(participantIndex, 1);
      setToStorage(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, participants);

      // 공동구매 정보 업데이트
      groupPurchase.currentParticipants = Math.max(0, groupPurchase.currentParticipants - participant.participantCount);
      groupPurchase.progress = Math.min(100, (groupPurchase.currentParticipants / groupPurchase.targetParticipants) * 100);
      
      if (groupPurchase.status === 'completed' && groupPurchase.currentParticipants < groupPurchase.targetParticipants) {
        groupPurchase.status = 'recruiting';
      }

      groupPurchase.updatedAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.GROUP_PURCHASES, groupPurchases);

      return;
    }

    return await apiCall(`/group-purchases/${id}/cancel-join`, {
      method: 'POST',
    }, true);
  },

  // 내가 참여한 공동구매 목록
  async getMyGroupPurchases(): Promise<GroupPurchase[]> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return [];
      }

      const participants = getFromStorage<any[]>(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, []);
      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      
      const myParticipantIds = participants
        .filter(p => p.userId === currentUser.id)
        .map(p => p.groupPurchaseId);
      
      return groupPurchases.filter(gp => myParticipantIds.includes(gp.id));
    }

    return await apiCall('/group-purchases/my', {
      method: 'GET',
    }, true);
  },

  // 내가 생성한 공동구매 목록
  async getMyCreatedGroupPurchases(): Promise<GroupPurchase[]> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return [];
      }

      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      return groupPurchases.filter(gp => gp.creatorId === currentUser.id);
    }

    return await apiCall('/group-purchases/my-created', {
      method: 'GET',
    }, true);
  },

  // 공동구매 수정
  async update(id: string, data: Partial<CreateGroupPurchaseData>): Promise<GroupPurchase> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      const groupPurchaseIndex = groupPurchases.findIndex(gp => gp.id === id);
      
      if (groupPurchaseIndex === -1) {
        throw new Error('공동구매를 찾을 수 없습니다.');
      }

      const groupPurchase = groupPurchases[groupPurchaseIndex];
      
      if (groupPurchase.creatorId !== currentUser.id) {
        throw new Error('수정 권한이 없습니다.');
      }

      // 업데이트
      if (data.targetParticipants !== undefined) {
        groupPurchase.targetParticipants = data.targetParticipants;
      }
      if (data.discountRate !== undefined) {
        groupPurchase.discountRate = data.discountRate;
        const originalPrice = groupPurchase.originalPrice;
        groupPurchase.discountedPrice = Math.floor(originalPrice * (1 - data.discountRate / 100));
      }
      if (data.deadline !== undefined) {
        groupPurchase.deadline = data.deadline;
      }
      if (data.description !== undefined) {
        groupPurchase.description = data.description;
      }

      groupPurchase.updatedAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.GROUP_PURCHASES, groupPurchases);

      return groupPurchase;
    }

    return await apiCall(`/group-purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true);
  },

  // 공동구매 삭제
  async delete(id: string): Promise<void> {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const groupPurchases = getFromStorage<GroupPurchase[]>(STORAGE_KEYS.GROUP_PURCHASES, []);
      const groupPurchase = groupPurchases.find(gp => gp.id === id);
      
      if (!groupPurchase) {
        throw new Error('공동구매를 찾을 수 없습니다.');
      }

      if (groupPurchase.creatorId !== currentUser.id) {
        throw new Error('삭제 권한이 없습니다.');
      }

      // 참여자가 있으면 삭제 불가
      if (groupPurchase.currentParticipants > 0) {
        throw new Error('참여자가 있는 공동구매는 삭제할 수 없습니다.');
      }

      // 삭제
      const filtered = groupPurchases.filter(gp => gp.id !== id);
      setToStorage(STORAGE_KEYS.GROUP_PURCHASES, filtered);

      // 참여자 정보도 삭제
      const participants = getFromStorage<any[]>(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, []);
      const filteredParticipants = participants.filter(p => p.groupPurchaseId !== id);
      setToStorage(STORAGE_KEYS.GROUP_PURCHASE_PARTICIPANTS, filteredParticipants);

      return;
    }

    return await apiCall(`/group-purchases/${id}`, {
      method: 'DELETE',
    }, true);
  },
};
