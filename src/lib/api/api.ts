import { projectId, publicAnonKey } from '../supabase/config';
import { createClient } from '@supabase/supabase-js';
import { 
  mockPerformances, 
  mockPromotions, 
  mockMatches, 
  STORAGE_KEYS, 
  getInitialUsers 
} from './mockData';
import { handleError, ErrorType } from '../utils/errorHandler';

// 모킹 모드 활성화 (백엔드 연결 시 false로 변경)
const USE_MOCK_MODE = true;

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c003bd66`;

// Create Supabase client for auth
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Get access token from local storage or session
function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function setAccessToken(token: string) {
  localStorage.setItem('access_token', token);
}

function clearAccessToken() {
  localStorage.removeItem('access_token');
}

// 로컬 스토리지 헬퍼 함수
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

// 초기화 로컬 스토리지 데이터
function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, getInitialUsers());
  }
  if (!localStorage.getItem(STORAGE_KEYS.PERFORMANCE_LIKES)) {
    setToStorage(STORAGE_KEYS.PERFORMANCE_LIKES, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_LIKES)) {
    setToStorage(STORAGE_KEYS.USER_LIKES, []);
  }
}

// 앱 시작 시 초기화
if (USE_MOCK_MODE) {
  initializeLocalStorage();
}

// Generic API call helper
async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<any> {
  // 모킹 모드에서는 실제 API 호출하지 않음
  if (USE_MOCK_MODE) {
    console.log('[MOCK MODE] API Call:', endpoint);
    // 모킹 모드에서는 빈 응답 반환 (각 API에서 직접 처리)
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
    // 네트워크 연결 확인
    if (!navigator.onLine) {
      const networkError = new Error('네트워크 연결이 없습니다.');
      (networkError as any).type = ErrorType.NETWORK;
      throw networkError;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Call:', url);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 응답이 JSON이 아닐 수 있으므로 처리
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error('API Error:', data);
      
      // 상태 코드에 따른 에러 타입 설정
      const error = new Error(data?.error || data || `API call failed: ${response.status}`);
      (error as any).status = response.status;
      (error as any).statusCode = response.status;
      
      // 401 Unauthorized
      if (response.status === 401) {
        (error as any).type = ErrorType.AUTH;
      }
      // 404 Not Found
      else if (response.status === 404) {
        (error as any).type = ErrorType.NOT_FOUND;
      }
      // 500+ Server Error
      else if (response.status >= 500) {
        (error as any).type = ErrorType.SERVER;
      }
      // 400 Bad Request
      else if (response.status === 400) {
        (error as any).type = ErrorType.VALIDATION;
      }
      
      throw error;
    }

    return data;
  } catch (error: any) {
    // 이미 처리된 에러는 그대로 throw
    if (error.type) {
      throw error;
    }

    // 네트워크 에러 감지
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      error.type = ErrorType.NETWORK;
    }

    // 에러 로깅 및 처리
    handleError(error, {
      showToast: false, // API 레벨에서는 toast 표시하지 않음 (호출하는 곳에서 처리)
      logError: true,
    });

    throw error;
  }
}

// Auth APIs
export const authApi = {
  async signup(userData: {
    email: string;
    password: string;
    name: string;
    age: number;
    gender: string;
    location?: string;
    interests?: string[];
    bio?: string;
    userType?: 'single' | 'couple';
    phoneNumber?: string;
    isPhoneVerified?: boolean;
    isArtist?: boolean;
    artistProfession?: string;
    artistOrganization?: string;
  }) {
    if (USE_MOCK_MODE) {
      const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
      
      // 이메일 중복 확인
      if (users.find(u => u.email === userData.email)) {
        throw new Error('이미 등록된 이메일입니다.');
      }

      // 새 사용자 생성
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      setToStorage(STORAGE_KEYS.USERS, users);
      
      // 자동 로그인
      setAccessToken(`mock_token_${newUser.id}`);
      setToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
      
      return { success: true, user: newUser };
    }

    return await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(email: string, password: string) {
    if (USE_MOCK_MODE) {
      const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, getInitialUsers());
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      setAccessToken(`mock_token_${user.id}`);
      setToStorage(STORAGE_KEYS.CURRENT_USER, user);
      
      return {
        session: {
          access_token: `mock_token_${user.id}`,
          user: user
        },
        user: user
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    if (data.session) {
      setAccessToken(data.session.access_token);
    }

    return data;
  },

  async logout() {
    if (USE_MOCK_MODE) {
      clearAccessToken();
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return;
    }

    await supabase.auth.signOut();
    clearAccessToken();
  },

  async getSession() {
    if (USE_MOCK_MODE) {
      const token = getAccessToken();
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      
      if (token && currentUser) {
        return {
          access_token: token,
          user: currentUser
        };
      }
      return null;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    if (data.session) {
      setAccessToken(data.session.access_token);
    }
    return data.session;
  },

  async getProfile() {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }
      return { profile: currentUser };
    }

    return await apiCall('/profile', {}, true);
  },

  async updateProfile(updates: any) {
    if (USE_MOCK_MODE) {
      const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        setToStorage(STORAGE_KEYS.USERS, users);
        setToStorage(STORAGE_KEYS.CURRENT_USER, users[userIndex]);
        return { profile: users[userIndex] };
      }
      
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return await apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }, true);
  },
};

// Performance APIs
export const performanceApi = {
  async getAll() {
    if (USE_MOCK_MODE) {
      // 약간의 지연을 추가하여 실제 API처럼 느끼게 함
      await new Promise(resolve => setTimeout(resolve, 300));
      return { performances: mockPerformances };
    }

    return await apiCall('/performances');
  },

  async getById(id: string) {
    if (USE_MOCK_MODE) {
      const performance = mockPerformances.find(p => p.id === id);
      if (!performance) {
        throw new Error('공연을 찾을 수 없습니다.');
      }
      return { performance };
    }

    return await apiCall(`/performances/${id}`);
  },

  async create(performanceData: any) {
    if (USE_MOCK_MODE) {
      const newPerformance = {
        id: `perf_${Date.now()}`,
        ...performanceData,
        createdAt: new Date().toISOString()
      };
      return { performance: newPerformance };
    }

    return await apiCall('/performances', {
      method: 'POST',
      body: JSON.stringify(performanceData),
    }, true);
  },

  // 좋아요 관련 API
  async toggleLike(performanceId: string) {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const likes = getFromStorage<any[]>(STORAGE_KEYS.PERFORMANCE_LIKES, []);
      const existingLike = likes.find(
        l => l.userId === currentUser.id && l.performanceId === performanceId
      );

      if (existingLike) {
        // 좋아요 취소
        const newLikes = likes.filter(l => l.id !== existingLike.id);
        setToStorage(STORAGE_KEYS.PERFORMANCE_LIKES, newLikes);
        return { success: true, liked: false, likeCount: newLikes.filter(l => l.performanceId === performanceId).length };
      } else {
        // 좋아요 추가
        const newLike = {
          id: `like_${Date.now()}`,
          userId: currentUser.id,
          performanceId,
          createdAt: new Date().toISOString()
        };
        likes.push(newLike);
        setToStorage(STORAGE_KEYS.PERFORMANCE_LIKES, likes);
        return { success: true, liked: true, likeCount: likes.filter(l => l.performanceId === performanceId).length };
      }
    }

    // 실제 Supabase 연동
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      // 기존 좋아요 확인
      const { data: existing } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('performance_id', performanceId)
        .maybeSingle();

      if (existing) {
        // 좋아요 취소
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('performance_id', performanceId);

        if (error) throw error;

        // 좋아요 수 조회
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('performance_id', performanceId);

        return { success: true, liked: false, likeCount: count || 0 };
      } else {
        // 좋아요 추가
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, performance_id: performanceId });

        if (error) throw error;

        // 좋아요 수 조회
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('performance_id', performanceId);

        return { success: true, liked: true, likeCount: count || 0 };
      }
    } catch (error: any) {
      console.error('좋아요 토글 오류:', error);
      throw error;
    }
  },

  async getLikes(performanceId?: string) {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return { likes: [] };
      }

      const likes = getFromStorage<any[]>(STORAGE_KEYS.PERFORMANCE_LIKES, []);
      const userLikes = likes.filter(l => l.userId === currentUser.id);
      
      if (performanceId) {
        return { 
          likes: userLikes.filter(l => l.performanceId === performanceId) 
        };
      }
      
      return { likes: userLikes };
    }

    const endpoint = performanceId 
      ? `/performances/${performanceId}/likes`
      : '/performances/likes';
    return await apiCall(endpoint, {}, true);
  },

  async checkLikeStatus(performanceId: string) {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return { liked: false, likeCount: 0 };
      }

      const likes = getFromStorage<any[]>(STORAGE_KEYS.PERFORMANCE_LIKES, []);
      const liked = likes.some(
        l => l.userId === currentUser.id && l.performanceId === performanceId
      );
      const likeCount = likes.filter(l => l.performanceId === performanceId).length;
      
      return { liked, likeCount };
    }

    // 실제 Supabase 연동
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 좋아요 수 조회
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('performance_id', performanceId);

      if (!user) {
        return { liked: false, likeCount: count || 0 };
      }

      // 사용자의 좋아요 여부 확인
      const { data: existing } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('performance_id', performanceId)
        .maybeSingle();

      return { liked: !!existing, likeCount: count || 0 };
    } catch (error: any) {
      console.error('좋아요 상태 확인 오류:', error);
      return { liked: false, likeCount: 0 };
    }
  },

  async getLikeCount(performanceId: string): Promise<number> {
    if (USE_MOCK_MODE) {
      const likes = getFromStorage<any[]>(STORAGE_KEYS.PERFORMANCE_LIKES, []);
      return likes.filter(l => l.performanceId === performanceId).length;
    }

    // 실제 Supabase 연동
    try {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('performance_id', performanceId);

      return count || 0;
    } catch (error: any) {
      console.error('좋아요 수 조회 오류:', error);
      return 0;
    }
  },
};

// Review APIs
export const reviewApi = {
  async getByPerformanceId(performanceId: string) {
    if (USE_MOCK_MODE) {
      // 모킹 모드: localStorage에서 리뷰 가져오기
      const reviews = getFromStorage<any[]>(`reviews_${performanceId}`, []);
      return { reviews };
    }

    return await apiCall(`/reviews/${performanceId}`);
  },

  async create(reviewData: {
    performanceId: string;
    rating: number;
    comment?: string;
    improvements?: string;
  }) {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const review = {
        id: `review_${Date.now()}`,
        ...reviewData,
        userId: currentUser.id,
        author: currentUser.name,
        userName: currentUser.name,
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        helpful_count: 0,
      };
      
      // localStorage에 저장
      const reviews = getFromStorage<any[]>(`reviews_${reviewData.performanceId}`, []);
      reviews.push(review);
      setToStorage(`reviews_${reviewData.performanceId}`, reviews);
      
      return { review };
    }

    return await apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }, true);
  },
};

// Matching APIs
export const matchingApi = {
  async getMatches() {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      // 약간의 지연 추가
      await new Promise(resolve => setTimeout(resolve, 300));
      return { matches: mockMatches };
    }

    return await apiCall('/matches', {}, true);
  },

  async sendLike(targetUserId: string) {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const userLikes = getFromStorage<any[]>(STORAGE_KEYS.USER_LIKES, []);
      
      // 이미 좋아요를 보냈는지 확인
      const existingLike = userLikes.find(
        l => l.fromUserId === currentUser.id && l.toUserId === targetUserId
      );

      if (existingLike) {
        return { success: false, message: '이미 좋아요를 보냈습니다.' };
      }

      // 상대방이 나에게 좋아요를 보냈는지 확인 (매칭 확인)
      const mutualLike = userLikes.find(
        l => l.fromUserId === targetUserId && l.toUserId === currentUser.id
      );

      const newLike = {
        id: `user_like_${Date.now()}`,
        fromUserId: currentUser.id,
        toUserId: targetUserId,
        createdAt: new Date().toISOString()
      };
      
      userLikes.push(newLike);
      setToStorage(STORAGE_KEYS.USER_LIKES, userLikes);

      return { 
        success: true, 
        isMatch: !!mutualLike,
        message: mutualLike ? '매칭되었습니다!' : '좋아요를 보냈습니다.'
      };
    }

    return await apiCall('/likes', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    }, true);
  },

  async getMyMatches() {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return { matches: [] };
      }

      const userLikes = getFromStorage<any[]>(STORAGE_KEYS.USER_LIKES, []);
      const myLikes = userLikes.filter(l => l.fromUserId === currentUser.id);
      const likedMe = userLikes.filter(l => l.toUserId === currentUser.id);
      
      // 상호 좋아요 (매칭)
      const matches = myLikes
        .filter(myLike => likedMe.some(theirLike => theirLike.fromUserId === myLike.toUserId))
        .map(match => {
          const matchedUser = mockMatches.find(m => m.id === match.toUserId);
          return matchedUser;
        })
        .filter(Boolean);

      return { matches };
    }

    return await apiCall('/my-matches', {}, true);
  },
};

// Promotion APIs
export const promotionApi = {
  async getAll() {
    if (USE_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { promotions: mockPromotions };
    }

    return await apiCall('/promotions');
  },

  async create(promotionData: any) {
    if (USE_MOCK_MODE) {
      const newPromotion = {
        id: `promo_${Date.now()}`,
        ...promotionData,
        createdAt: new Date().toISOString()
      };
      return { promotion: newPromotion };
    }

    return await apiCall('/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    }, true);
  },
};

// Couple Spot APIs
export const coupleSpotApi = {
  async getAll() {
    if (USE_MOCK_MODE) {
      return { coupleSpots: [] };
    }

    return await apiCall('/couple-spots');
  },

  async create(spotData: any) {
    if (USE_MOCK_MODE) {
      const newSpot = {
        id: `spot_${Date.now()}`,
        ...spotData,
        createdAt: new Date().toISOString()
      };
      return { coupleSpot: newSpot };
    }

    return await apiCall('/couple-spots', {
      method: 'POST',
      body: JSON.stringify(spotData),
    }, true);
  },
};

// Artist Post APIs
export const artistPostApi = {
  async getAll() {
    if (USE_MOCK_MODE) {
      return { posts: [] };
    }

    return await apiCall('/artist-posts');
  },

  async getById(id: string) {
    if (USE_MOCK_MODE) {
      return { post: null };
    }

    return await apiCall(`/artist-posts/${id}`);
  },

  async create(postData: any) {
    if (USE_MOCK_MODE) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const newPost = {
        id: `post_${Date.now()}`,
        ...postData,
        userId: currentUser.id,
        createdAt: new Date().toISOString()
      };
      return { post: newPost };
    }

    return await apiCall('/artist-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }, true);
  },

  async update(id: string, postData: any) {
    if (USE_MOCK_MODE) {
      return { post: { id, ...postData } };
    }

    return await apiCall(`/artist-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }, true);
  },

  async delete(id: string) {
    if (USE_MOCK_MODE) {
      return { success: true };
    }

    return await apiCall(`/artist-posts/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// Seed data (for initial setup)
export const seedData = async (data: {
  performances?: any[];
  promotions?: any[];
  coupleSpots?: any[];
}) => {
  if (USE_MOCK_MODE) {
    return { success: true, message: '모킹 모드에서는 시드 데이터가 필요 없습니다.' };
  }

  return await apiCall('/seed-data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export { getAccessToken, setAccessToken, clearAccessToken };
