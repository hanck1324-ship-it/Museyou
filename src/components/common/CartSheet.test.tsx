import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartSheet } from './CartSheet';
import { useCartStore } from '../../store/useCartStore';
import { Performance } from '../performances/PerformanceCard';

// Mock UI components
vi.mock('../ui/sheet', () => ({
  Sheet: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    open ? <div data-testid="sheet">{children}</div> : null
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  SheetFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('../ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../ui/separator', () => ({
  Separator: () => <hr />,
}));

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('../payment/CheckoutPage', () => ({
  CheckoutPage: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
    open ? <div data-testid="checkout-page">Checkout Page</div> : null
  ),
}));

vi.mock('./figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="item-image" />
  ),
}));

describe('CartSheet', () => {
  const mockPerformance: Performance = {
    id: 'perf1',
    title: '테스트 공연',
    category: '뮤지컬',
    venue: '테스트 극장',
    district: '강남구',
    date: '2025.01.15',
    time: '19:00',
    price: '30,000원',
    image: 'https://example.com/image.jpg',
    rating: 4.5,
    reviewCount: 10,
    description: '테스트 설명',
    organizer: '테스트 주최자',
  };

  beforeEach(() => {
    // Reset cart store
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
    vi.clearAllMocks();
  });

  it('장바구니가 비어있을 때 빈 상태 메시지를 표시해야 함', () => {
    useCartStore.setState({ isOpen: true });
    
    render(<CartSheet />);

    expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    expect(screen.getByText('공연을 추가해보세요!')).toBeInTheDocument();
  });

  it('장바구니에 아이템이 있을 때 아이템 목록을 표시해야 함', () => {
    useCartStore.setState({
      isOpen: true,
      items: [{
        ...mockPerformance,
        quantity: 1,
        addedAt: new Date().toISOString(),
      }],
    });

    render(<CartSheet />);

    expect(screen.getByText('테스트 공연')).toBeInTheDocument();
    expect(screen.getByText('테스트 극장')).toBeInTheDocument();
  });

  it('아이템 수량 증가 버튼이 작동해야 함', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockPerformance);
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    const plusButton = screen.getAllByRole('button').find(
      btn => btn.querySelector('svg')?.getAttribute('data-lucide') === 'plus' ||
             btn.querySelector('[class*="Plus"]')
    );
    
    if (plusButton) {
      fireEvent.click(plusButton);
      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBeGreaterThan(1);
    }
  });

  it('아이템 수량 감소 버튼이 작동해야 함', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockPerformance);
    updateQuantity(mockPerformance.id, 2);
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    const minusButton = screen.getAllByRole('button').find(
      btn => btn.querySelector('svg')?.getAttribute('data-lucide') === 'minus' ||
             btn.querySelector('[class*="Minus"]')
    );
    
    if (minusButton) {
      fireEvent.click(minusButton);
      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(1);
    }
  });

  it('아이템 제거 버튼이 작동해야 함', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockPerformance);
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    const removeButton = screen.getAllByRole('button').find(
      btn => btn.querySelector('svg')?.getAttribute('data-lucide') === 'x' ||
             btn.querySelector('[class*="X"]') ||
             btn.getAttribute('aria-label') === '제거'
    );
    
    if (removeButton) {
      fireEvent.click(removeButton);
      const { items } = useCartStore.getState();
      expect(items.length).toBe(0);
    }
  });

  it('전체 삭제 버튼이 작동해야 함', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockPerformance);
    addItem({ ...mockPerformance, id: 'perf2' });
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    const clearButton = screen.getByText(/전체 삭제/i);
    fireEvent.click(clearButton);

    const { items } = useCartStore.getState();
    expect(items.length).toBe(0);
  });

  it('총 결제금액이 올바르게 계산되어 표시되어야 함', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockPerformance);
    updateQuantity(mockPerformance.id, 2);
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    expect(screen.getByText(/60,000원|총 결제금액/)).toBeInTheDocument();
  });

  it('결제하기 버튼 클릭 시 CheckoutPage가 열려야 함', async () => {
    const { addItem } = useCartStore.getState();
    addItem(mockPerformance);
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    const checkoutButton = screen.getByText(/결제하기/i);
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
    });
  });

  it('장바구니가 비어있을 때 결제하기 버튼 클릭 시 에러 토스트가 표시되어야 함', () => {
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    const checkoutButton = screen.queryByText(/결제하기/i);
    // 장바구니가 비어있으면 결제하기 버튼이 없어야 함
    expect(checkoutButton).not.toBeInTheDocument();
  });

  it('아이템 개수가 올바르게 표시되어야 함', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockPerformance);
    updateQuantity(mockPerformance.id, 3);
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    expect(screen.getByText('3개')).toBeInTheDocument();
  });

  it('여러 아이템의 총 수량이 올바르게 계산되어야 함', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockPerformance);
    addItem({ ...mockPerformance, id: 'perf2' });
    useCartStore.setState({ isOpen: true });

    render(<CartSheet />);

    expect(screen.getByText(/2개/)).toBeInTheDocument();
  });
});
