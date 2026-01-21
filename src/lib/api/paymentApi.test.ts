import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requestPayment, getOrders, getOrderById, cancelOrder } from './paymentApi';
import { PaymentInfo, Order } from '../types/payment';
import { STORAGE_KEYS } from './mockData';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('paymentApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const mockPaymentInfo: PaymentInfo = {
    items: [
      {
        id: 'perf1',
        title: '테스트 공연',
        quantity: 2,
        price: 30000,
        image: 'https://example.com/image.jpg',
        venue: '테스트 극장',
        date: '2025.01.15',
      },
    ],
    totalAmount: 60000,
    buyerName: '테스트 사용자',
    buyerEmail: 'test@example.com',
    buyerPhone: '010-1234-5678',
    buyerAddress: '서울시 강남구',
  };

  describe('requestPayment', () => {
    it('결제를 성공적으로 처리해야 함', async () => {
      const result = await requestPayment(mockPaymentInfo);

      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();
      expect(result.paymentId).toBeDefined();
      expect(result.amount).toBe(60000);
      expect(result.method).toBe('card');
      expect(result.paidAt).toBeDefined();
    });

    it('주문 내역이 localStorage에 저장되어야 함', async () => {
      await requestPayment(mockPaymentInfo);

      const orders = getOrders();
      expect(orders.length).toBe(1);
      expect(orders[0].items).toEqual(mockPaymentInfo.items);
      expect(orders[0].totalAmount).toBe(60000);
      expect(orders[0].status).toBe('paid');
    });

    it('여러 번 결제하면 여러 주문이 생성되어야 함', async () => {
      await requestPayment(mockPaymentInfo);
      await requestPayment({ ...mockPaymentInfo, totalAmount: 50000 });

      const orders = getOrders();
      expect(orders.length).toBe(2);
    });
  });

  describe('getOrders', () => {
    it('저장된 모든 주문을 반환해야 함', async () => {
      await requestPayment(mockPaymentInfo);
      await requestPayment({ ...mockPaymentInfo, totalAmount: 50000 });

      const orders = getOrders();
      expect(orders.length).toBe(2);
    });

    it('주문이 없으면 빈 배열을 반환해야 함', () => {
      const orders = getOrders();
      expect(orders).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('주문 ID로 주문을 찾을 수 있어야 함', async () => {
      const paymentResult = await requestPayment(mockPaymentInfo);
      const orderId = paymentResult.orderId!;

      const order = getOrderById(orderId);
      expect(order).toBeDefined();
      expect(order?.id).toBe(orderId);
      expect(order?.totalAmount).toBe(60000);
    });

    it('존재하지 않는 주문 ID는 null을 반환해야 함', () => {
      const order = getOrderById('non-existent-id');
      expect(order).toBeNull();
    });
  });

  describe('cancelOrder', () => {
    it('주문을 성공적으로 취소해야 함', async () => {
      const paymentResult = await requestPayment(mockPaymentInfo);
      const orderId = paymentResult.orderId!;

      const result = await cancelOrder(orderId);
      expect(result).toBe(true);

      const order = getOrderById(orderId);
      expect(order?.status).toBe('cancelled');
    });

    it('존재하지 않는 주문 취소 시 에러를 발생시켜야 함', async () => {
      await expect(cancelOrder('non-existent-id')).rejects.toThrow();
    });
  });

  describe('주문 데이터 구조', () => {
    it('생성된 주문이 올바른 구조를 가져야 함', async () => {
      await requestPayment(mockPaymentInfo);

      const orders = getOrders();
      const order = orders[0];

      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('totalAmount');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('paymentMethod');
      expect(order).toHaveProperty('paymentId');
      expect(order).toHaveProperty('createdAt');
      expect(order).toHaveProperty('paidAt');
    });

    it('주문 상태가 올바르게 설정되어야 함', async () => {
      await requestPayment(mockPaymentInfo);

      const orders = getOrders();
      const order = orders[0];

      expect(order.status).toBe('paid');
    });
  });

  describe('여러 아이템 결제', () => {
    it('여러 아이템이 포함된 결제를 처리할 수 있어야 함', async () => {
      const multiItemPayment: PaymentInfo = {
        items: [
          {
            id: 'perf1',
            title: '공연 1',
            quantity: 2,
            price: 30000,
          },
          {
            id: 'perf2',
            title: '공연 2',
            quantity: 1,
            price: 50000,
          },
        ],
        totalAmount: 110000,
        buyerName: '테스트 사용자',
        buyerEmail: 'test@example.com',
        buyerPhone: '010-1234-5678',
      };

      const result = await requestPayment(multiItemPayment);

      expect(result.success).toBe(true);
      expect(result.amount).toBe(110000);

      const orders = getOrders();
      expect(orders[0].items.length).toBe(2);
    });
  });
});
