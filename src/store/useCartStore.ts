import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Performance } from '../components/performances/PerformanceCard';
import { toast } from 'sonner';

export interface CartItem extends Performance {
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (performance: Performance) => void;
  removeItem: (performanceId: string) => void;
  updateQuantity: (performanceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  setIsOpen: (isOpen: boolean) => void;
  isInCart: (performanceId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (performance: Performance) => {
        const state = get();
        const existingItem = state.items.find(item => item.id === performance.id);

        if (existingItem) {
          // 이미 장바구니에 있으면 수량 증가
          set({
            items: state.items.map(item =>
              item.id === performance.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success('장바구니에 추가되었습니다! (수량 증가)');
        } else {
          // 새 아이템 추가
          const newItem: CartItem = {
            ...performance,
            quantity: 1,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...state.items, newItem] });
          toast.success('장바구니에 추가되었습니다! 🛒');
        }
      },

      removeItem: (performanceId: string) => {
        const state = get();
        set({
          items: state.items.filter(item => item.id !== performanceId),
        });
        toast.success('장바구니에서 제거되었습니다.');
      },

      updateQuantity: (performanceId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(performanceId);
          return;
        }

        const state = get();
        set({
          items: state.items.map(item =>
            item.id === performanceId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('장바구니가 비워졌습니다.');
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          // 가격 문자열에서 숫자 추출 (예: "10,000원" -> 10000)
          const priceStr = item.price;
          if (priceStr === '무료') return total;
          
          const match = priceStr.match(/(\d+,?\d*)/);
          if (match) {
            const price = parseInt(match[1].replace(/,/g, '')) * item.quantity;
            return total + price;
          }
          return total;
        }, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      isInCart: (performanceId: string) => {
        const state = get();
        return state.items.some(item => item.id === performanceId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
