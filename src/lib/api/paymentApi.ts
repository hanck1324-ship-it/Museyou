import { PaymentInfo, PaymentResult, Order } from '../types/payment';
import { STORAGE_KEYS } from './mockData';
import { handleError, ErrorType } from '../utils/errorHandler';

// 모킹 모드 활성화 (실제 결제 연동 시 false로 변경)
const USE_MOCK_MODE = true;

/**
 * 결제 요청
 */
export async function requestPayment(paymentInfo: PaymentInfo): Promise<PaymentResult> {
  if (USE_MOCK_MODE) {
    // 모킹 모드: 로컬 스토리지에 주문 저장
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 주문 내역 저장
        const orders = getOrders();
        const newOrder: Order = {
          id: orderId,
          userId: 'current_user', // 실제로는 인증된 사용자 ID
          items: paymentInfo.items,
          totalAmount: paymentInfo.totalAmount,
          status: 'paid',
          paymentMethod: 'card',
          paymentId,
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
        };
        
        orders.push(newOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        
        resolve({
          success: true,
          orderId,
          paymentId,
          amount: paymentInfo.totalAmount,
          method: 'card',
          paidAt: new Date().toISOString(),
        });
      }, 1500); // 결제 처리 시뮬레이션
    });
  }

  // 실제 결제 API 호출 (토스페이먼츠, 아임포트 등)
  try {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentInfo),
    });

    if (!response.ok) {
      throw new Error('결제 요청에 실패했습니다.');
    }

    const result: PaymentResult = await response.json();
    return result;
  } catch (error) {
    handleError(error, {
      showToast: true,
      logError: true,
      customMessage: '결제 처리 중 오류가 발생했습니다.',
    });
    throw error;
  }
}

/**
 * 주문 내역 조회
 */
export function getOrders(): Order[] {
  if (USE_MOCK_MODE) {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('주문 내역 파싱 오류:', error);
        return [];
      }
    }
    return [];
  }

  // 실제 API 호출
  // TODO: Supabase 또는 백엔드 API 연동
  return [];
}

/**
 * 주문 상세 조회
 */
export function getOrderById(orderId: string): Order | null {
  const orders = getOrders();
  return orders.find(order => order.id === orderId) || null;
}

/**
 * 주문 취소
 */
export async function cancelOrder(orderId: string): Promise<boolean> {
  if (USE_MOCK_MODE) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    orders[orderIndex].status = 'cancelled';
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    return true;
  }

  // 실제 API 호출
  try {
    const response = await fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('주문 취소에 실패했습니다.');
    }

    return true;
  } catch (error) {
    handleError(error, {
      showToast: true,
      logError: true,
      customMessage: '주문 취소 중 오류가 발생했습니다.',
    });
    throw error;
  }
}
