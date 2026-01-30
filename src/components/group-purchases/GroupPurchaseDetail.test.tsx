import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GroupPurchaseDetail } from './GroupPurchaseDetail';
import { GroupPurchase } from '../../lib/types/groupPurchase';

// Mock dependencies
vi.mock('../../store/useGroupPurchaseStore', () => ({
  useGroupPurchaseStore: () => ({
    cancelJoin: vi.fn().mockResolvedValue(undefined),
    fetchGroupPurchaseDetail: vi.fn().mockResolvedValue(undefined),
    deleteGroupPurchase: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('../../lib/hooks/useGroupPurchaseRealtime', () => ({
  useGroupPurchaseRealtime: vi.fn(),
}));

vi.mock('../../lib/utils/share', () => ({
  shareContent: vi.fn().mockResolvedValue(undefined),
  shareToFacebook: vi.fn(),
  shareToTwitter: vi.fn(),
}));

vi.mock('../../lib/api/mockData', () => ({
  STORAGE_KEYS: {
    CURRENT_USER: 'current_user',
  },
}));

// Mock UI components
vi.mock('../ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    open ? <div data-testid="dialog">{children}</div> : null
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

vi.mock('../ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) => (
    <div data-testid="tabs" data-default-value={defaultValue}>{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <button data-testid={`tab-${value}`}>{children}</button>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
}));

vi.mock('../ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../ui/separator', () => ({
  Separator: () => <hr />,
}));

vi.mock('../ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    open ? <div data-testid="alert-dialog">{children}</div> : null
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogAction: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
  AlertDialogCancel: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

vi.mock('./GroupPurchaseProgress', () => ({
  GroupPurchaseProgress: ({ current, target }: { current: number; target: number }) => (
    <div data-testid="progress">{current}/{target}</div>
  ),
}));

vi.mock('./GroupPurchaseStatus', () => ({
  GroupPurchaseStatus: ({ status }: { status: string }) => (
    <span data-testid="status">{status}</span>
  ),
}));

vi.mock('./GroupPurchaseParticipants', () => ({
  GroupPurchaseParticipants: ({ participants }: { participants: any[] }) => (
    <div data-testid="participants">{participants.length}명</div>
  ),
}));

vi.mock('./GroupPurchaseEdit', () => ({
  GroupPurchaseEdit: ({ open }: { open: boolean }) => (
    open ? <div data-testid="edit-dialog">Edit Dialog</div> : null
  ),
}));

vi.mock('../common/figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('GroupPurchaseDetail', () => {
  const mockGroupPurchase: GroupPurchase = {
    id: 'gp1',
    performance: {
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
    },
    originalPrice: 30000,
    discountedPrice: 24000,
    discountRate: 20,
    targetParticipants: 10,
    currentParticipants: 5,
    status: 'recruiting',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: 'user1',
      name: '생성자',
      email: 'creator@example.com',
    },
    creatorId: 'user1',
    participants: [
      { userId: 'user2', name: '참여자1', joinedAt: new Date().toISOString() },
      { userId: 'user3', name: '참여자2', joinedAt: new Date().toISOString() },
    ],
    description: '테스트 공동구매 설명',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should not render when closed', () => {
    render(
      <GroupPurchaseDetail
        groupPurchase={mockGroupPurchase}
        open={false}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render group purchase details when open', () => {
    render(
      <GroupPurchaseDetail
        groupPurchase={mockGroupPurchase}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('테스트 공연')).toBeInTheDocument();
    expect(screen.getByText('20% 할인')).toBeInTheDocument();
  });

  it('should display tabs', () => {
    render(
      <GroupPurchaseDetail
        groupPurchase={mockGroupPurchase}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('tab-info')).toBeInTheDocument();
    expect(screen.getByTestId('tab-performance')).toBeInTheDocument();
    expect(screen.getByTestId('tab-participants')).toBeInTheDocument();
  });

  it('should display progress information', () => {
    render(
      <GroupPurchaseDetail
        groupPurchase={mockGroupPurchase}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('should display price information', () => {
    render(
      <GroupPurchaseDetail
        groupPurchase={mockGroupPurchase}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    // 원가와 할인가가 모두 표시되는지 확인 (getAllByText 사용)
    const originalPrices = screen.getAllByText(/30,000원/);
    expect(originalPrices.length).toBeGreaterThan(0);
    
    const discountedPrices = screen.getAllByText(/24,000원/);
    expect(discountedPrices.length).toBeGreaterThan(0);
  });

  it('should show join button when can join', () => {
    const onJoin = vi.fn();
    render(
      <GroupPurchaseDetail
        groupPurchase={mockGroupPurchase}
        open={true}
        onOpenChange={vi.fn()}
        onJoin={onJoin}
      />
    );

    const joinButton = screen.getByText(/공동구매 참여하기/);
    expect(joinButton).toBeInTheDocument();

    fireEvent.click(joinButton);
    expect(onJoin).toHaveBeenCalled();
  });
});
