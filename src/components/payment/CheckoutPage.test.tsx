import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutPage } from './CheckoutPage';
import { useCartStore } from '../../store/useCartStore';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('../../lib/api/paymentApi', () => ({
  requestPayment: vi.fn(),
}));

// Mock UI components
vi.mock('../ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    open ? <div data-testid="dialog">{children}</div> : null
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, disabled, type, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>{children}</button>
  ),
}));

vi.mock('../ui/forms/input', () => ({
  Input: ({ value, onChange, placeholder, id, type, ...props }: any) => (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={id}
      {...props}
    />
  ),
}));

vi.mock('../ui/forms/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock('../ui/forms/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock('../ui/separator', () => ({
  Separator: () => <hr />,
}));

vi.mock('../ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../common/figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CheckoutPage', () => {
  const mockCartItems = [
    {
      id: 'item1',
      title: '테스트 공연 1',
      price: '30,000원',
      quantity: 2,
      image: 'https://example.com/image1.jpg',
      venue: '테스트 극장',
      date: '2025.01.15',
    },
    {
      id: 'item2',
      title: '테스트 공연 2',
      price: '50,000원',
      quantity: 1,
      image: 'https://example.com/image2.jpg',
      venue: '테스트 극장 2',
      date: '2025.01.16',
    },
  ];

  beforeEach(() => {
    // Reset cart store
    useCartStore.setState({
      items: [],
      getTotalPrice: () => 0,
    });
  });

  it('should render checkout page when open', () => {
    useCartStore.setState({
      items: mockCartItems,
      getTotalPrice: () => 110000,
    });

    renderWithRouter(
      <CheckoutPage open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('결제 정보 입력')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    renderWithRouter(
      <CheckoutPage open={false} onOpenChange={vi.fn()} />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should display cart items in order summary', () => {
    useCartStore.setState({
      items: mockCartItems,
      getTotalPrice: () => 110000,
    });

    renderWithRouter(
      <CheckoutPage open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.getByText('테스트 공연 1')).toBeInTheDocument();
    expect(screen.getByText('테스트 공연 2')).toBeInTheDocument();
  });

  it('should show validation error when submitting empty form', async () => {
    const { toast } = await import('sonner');
    useCartStore.setState({
      items: mockCartItems,
      getTotalPrice: () => 110000,
    });

    renderWithRouter(
      <CheckoutPage open={true} onOpenChange={vi.fn()} />
    );

    const form = screen.getByTestId('buyer-name').closest('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      const submitButton = screen.getByText('다음 단계');
      fireEvent.click(submitButton);
    }

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith('필수 정보를 모두 입력해주세요.');
      },
      { timeout: 2000 }
    );
  });

  it('should validate email format', async () => {
    const { toast } = await import('sonner');
    useCartStore.setState({
      items: mockCartItems,
      getTotalPrice: () => 110000,
    });

    renderWithRouter(
      <CheckoutPage open={true} onOpenChange={vi.fn()} />
    );

    const nameInput = screen.getByTestId('buyer-name');
    const emailInput = screen.getByTestId('buyer-email');
    const phoneInput = screen.getByTestId('buyer-phone');

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(phoneInput, { target: { value: '010-1234-5678' } });

    const form = nameInput.closest('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      const submitButton = screen.getByText('다음 단계');
      fireEvent.click(submitButton);
    }

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith('올바른 이메일 주소를 입력해주세요.');
      },
      { timeout: 2000 }
    );
  });

  it('should validate phone number format', async () => {
    const { toast } = await import('sonner');
    useCartStore.setState({
      items: mockCartItems,
      getTotalPrice: () => 110000,
    });

    renderWithRouter(
      <CheckoutPage open={true} onOpenChange={vi.fn()} />
    );

    const nameInput = screen.getByTestId('buyer-name');
    const emailInput = screen.getByTestId('buyer-email');
    const phoneInput = screen.getByTestId('buyer-phone');

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123' } });

    const submitButton = screen.getByText('다음 단계');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('올바른 전화번호를 입력해주세요.');
    });
  });

  // Note: Form submission and state transition tests are complex due to async state updates
  // These tests focus on basic rendering and validation
});
