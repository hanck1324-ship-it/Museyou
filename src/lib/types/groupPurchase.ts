import { Performance } from '../../components/performances/PerformanceCard';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type GroupPurchaseStatus = 
  | 'recruiting' 
  | 'in_progress' 
  | 'completed' 
  | 'closed' 
  | 'cancelled';

export interface GroupPurchaseParticipant {
  id: string;
  userId: string;
  user: User;
  joinedAt: string;
  participantCount: number; // 참여 인원 수
  message?: string;
}

export interface GroupPurchase {
  id: string;
  performanceId: string;
  performance: Performance; // 공연 정보
  
  // 공동구매 정보
  targetParticipants: number;  // 목표 인원
  currentParticipants: number;  // 현재 참여 인원
  discountRate: number;        // 할인율 (%)
  originalPrice: number;        // 원가
  discountedPrice: number;      // 할인가
  
  // 상태
  status: GroupPurchaseStatus;
  
  // 일정
  deadline: string;             // 마감일
  createdAt: string;
  updatedAt: string;
  
  // 생성자
  creatorId: string;
  creator: User;
  
  // 참여자
  participants: GroupPurchaseParticipant[];
  
  // 설명
  description?: string;
  
  // 진행률
  progress: number; // 0-100
}

export interface CreateGroupPurchaseData {
  performanceId: string;
  targetParticipants: number;
  discountRate: number;
  deadline: string;
  description?: string;
}

export interface JoinGroupPurchaseData {
  participantCount: number;
  message?: string;
}

export interface GroupPurchaseFilters {
  category?: string;
  district?: string;
  status?: GroupPurchaseStatus;
  minDiscountRate?: number;
  searchQuery?: string;
}

export type GroupPurchaseSortBy = 'popular' | 'deadline' | 'newest' | 'discount';
