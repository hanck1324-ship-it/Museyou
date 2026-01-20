import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore, type CartItem } from './useCartStore';
import { Performance } from '../components/performances/PerformanceCard';

// toast 모킹
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCartStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
    localStorage.clear();
  });

  const mockPerformance: Performance = {
    id: '1',
    title: '테스트 공연',
    category: '뮤지컬',
    district: '강남구',
    price: '30,000원',
    image: 'https://example.com/image.jpg',
    date: '2024-12-31',
    location: '테스트 극장',
  };

  describe('addItem', () => {
    it('새로운 아이템을 장바구니에 추가해야 함', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockPerformance);
      
      const { items } = useCartStore.getState();
      expect(items.length).toBe(1);
      expect(items[0]).toMatchObject({
        id: mockPerformance.id,
        title: mockPerformance.title,
        quantity: 1,
      });
      expect(items[0].addedAt).toBeDefined();
    });

    it('이미 장바구니에 있는 아이템을 추가하면 수량이 증가해야 함', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockPerformance);
      addItem(mockPerformance);
      
      const { items } = useCartStore.getState();
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it('서로 다른 아이템을 추가하면 각각 추가되어야 함', () => {
      const { addItem } = useCartStore.getState();
      const anotherPerformance: Performance = {
        ...mockPerformance,
        id: '2',
        title: '다른 공연',
      };
      
      addItem(mockPerformance);
      addItem(anotherPerformance);
      
      const { items } = useCartStore.getState();
      expect(items.length).toBe(2);
      expect(items[0].id).toBe('1');
      expect(items[1].id).toBe('2');
    });
  });

  describe('removeItem', () => {
    it('장바구니에서 아이템을 제거해야 함', () => {
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(mockPerformance);
      let { items } = useCartStore.getState();
      expect(items.length).toBe(1);
      
      removeItem(mockPerformance.id);
      items = useCartStore.getState().items;
      expect(items.length).toBe(0);
    });

    it('존재하지 않는 아이템을 제거해도 에러가 발생하지 않아야 함', () => {
      const { removeItem } = useCartStore.getState();
      
      expect(() => removeItem('non-existent-id')).not.toThrow();
      const { items } = useCartStore.getState();
      expect(items.length).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('아이템의 수량을 업데이트해야 함', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockPerformance);
      updateQuantity(mockPerformance.id, 5);
      
      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it('수량을 0 이하로 설정하면 아이템이 제거되어야 함', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockPerformance);
      let { items } = useCartStore.getState();
      expect(items.length).toBe(1);
      
      updateQuantity(mockPerformance.id, 0);
      
      items = useCartStore.getState().items;
      expect(items.length).toBe(0);
    });

    it('존재하지 않는 아이템의 수량을 업데이트해도 에러가 발생하지 않아야 함', () => {
      const { updateQuantity } = useCartStore.getState();
      
      expect(() => updateQuantity('non-existent-id', 5)).not.toThrow();
    });
  });

  describe('clearCart', () => {
    it('장바구니의 모든 아이템을 제거해야 함', () => {
      const { addItem, clearCart } = useCartStore.getState();
      
      addItem(mockPerformance);
      addItem({ ...mockPerformance, id: '2' });
      let { items } = useCartStore.getState();
      expect(items.length).toBe(2);
      
      clearCart();
      items = useCartStore.getState().items;
      expect(items.length).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('단일 아이템의 총 금액을 계산해야 함', () => {
      const { addItem, getTotalPrice } = useCartStore.getState();
      
      addItem(mockPerformance);
      
      const total = getTotalPrice();
      expect(total).toBe(30000);
    });

    it('여러 아이템의 총 금액을 계산해야 함', () => {
      const { addItem, updateQuantity, getTotalPrice } = useCartStore.getState();
      
      addItem(mockPerformance); // 30,000원
      addItem({ ...mockPerformance, id: '2', price: '20,000원' }); // 20,000원
      updateQuantity(mockPerformance.id, 2); // 30,000원 * 2
      
      const total = getTotalPrice();
      expect(total).toBe(80000); // 60,000 + 20,000
    });

    it('무료 공연은 총 금액에 포함되지 않아야 함', () => {
      const { addItem, getTotalPrice } = useCartStore.getState();
      
      addItem(mockPerformance); // 30,000원
      addItem({ ...mockPerformance, id: '2', price: '무료' });
      
      const total = getTotalPrice();
      expect(total).toBe(30000);
    });

    it('장바구니가 비어있으면 0을 반환해야 함', () => {
      const { getTotalPrice } = useCartStore.getState();
      
      const total = getTotalPrice();
      expect(total).toBe(0);
    });
  });

  describe('getItemCount', () => {
    it('단일 아이템의 수량을 반환해야 함', () => {
      const { addItem, getItemCount } = useCartStore.getState();
      
      addItem(mockPerformance);
      
      const count = getItemCount();
      expect(count).toBe(1);
    });

    it('여러 아이템의 총 수량을 반환해야 함', () => {
      const { addItem, updateQuantity, getItemCount } = useCartStore.getState();
      
      addItem(mockPerformance);
      updateQuantity(mockPerformance.id, 3);
      addItem({ ...mockPerformance, id: '2' });
      updateQuantity('2', 2);
      
      const count = getItemCount();
      expect(count).toBe(5); // 3 + 2
    });

    it('장바구니가 비어있으면 0을 반환해야 함', () => {
      const { getItemCount } = useCartStore.getState();
      
      const count = getItemCount();
      expect(count).toBe(0);
    });
  });

  describe('setIsOpen', () => {
    it('장바구니 열림 상태를 설정해야 함', () => {
      const { setIsOpen, isOpen } = useCartStore.getState();
      
      setIsOpen(true);
      expect(useCartStore.getState().isOpen).toBe(true);
      
      setIsOpen(false);
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('isInCart', () => {
    it('장바구니에 있는 아이템은 true를 반환해야 함', () => {
      const { addItem, isInCart } = useCartStore.getState();
      
      addItem(mockPerformance);
      
      expect(isInCart(mockPerformance.id)).toBe(true);
    });

    it('장바구니에 없는 아이템은 false를 반환해야 함', () => {
      const { isInCart } = useCartStore.getState();
      
      expect(isInCart('non-existent-id')).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('장바구니 상태가 localStorage에 저장되어야 함', async () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockPerformance);
      
      // persist 미들웨어가 비동기로 저장하므로 약간의 지연 후 확인
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stored = localStorage.getItem('cart-storage');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.items.length).toBe(1);
      }
    });
  });
});
