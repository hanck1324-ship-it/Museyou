import { projectId, publicAnonKey } from '../supabase/config';
import { createClient } from '@supabase/supabase-js';

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

// Generic API call helper
async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<any> {
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
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Call:', url);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || `API call failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
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
  }) {
    return await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(email: string, password: string) {
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
    await supabase.auth.signOut();
    clearAccessToken();
  },

  async getSession() {
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
    return await apiCall('/profile', {}, true);
  },

  async updateProfile(updates: any) {
    return await apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }, true);
  },
};

// Performance APIs
export const performanceApi = {
  async getAll() {
    return await apiCall('/performances');
  },

  async getById(id: string) {
    return await apiCall(`/performances/${id}`);
  },

  async create(performanceData: any) {
    return await apiCall('/performances', {
      method: 'POST',
      body: JSON.stringify(performanceData),
    }, true);
  },
};

// Review APIs
export const reviewApi = {
  async getByPerformanceId(performanceId: string) {
    return await apiCall(`/reviews/${performanceId}`);
  },

  async create(reviewData: {
    performanceId: string;
    rating: number;
    comment?: string;
    improvements?: string;
  }) {
    return await apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }, true);
  },
};

// Matching APIs
export const matchingApi = {
  async getMatches() {
    return await apiCall('/matches', {}, true);
  },

  async sendLike(targetUserId: string) {
    return await apiCall('/likes', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    }, true);
  },

  async getMyMatches() {
    return await apiCall('/my-matches', {}, true);
  },
};

// Promotion APIs
export const promotionApi = {
  async getAll() {
    return await apiCall('/promotions');
  },

  async create(promotionData: any) {
    return await apiCall('/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    }, true);
  },
};

// Couple Spot APIs
export const coupleSpotApi = {
  async getAll() {
    return await apiCall('/couple-spots');
  },

  async create(spotData: any) {
    return await apiCall('/couple-spots', {
      method: 'POST',
      body: JSON.stringify(spotData),
    }, true);
  },
};

// Artist Post APIs
export const artistPostApi = {
  async getAll() {
    return await apiCall('/artist-posts');
  },

  async getById(id: string) {
    return await apiCall(`/artist-posts/${id}`);
  },

  async create(postData: any) {
    return await apiCall('/artist-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }, true);
  },

  async update(id: string, postData: any) {
    return await apiCall(`/artist-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }, true);
  },

  async delete(id: string) {
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
  return await apiCall('/seed-data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export { getAccessToken, setAccessToken, clearAccessToken };
