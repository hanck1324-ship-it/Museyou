import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PerformanceDetail } from './PerformanceDetail';
import { Performance } from './PerformanceCard';

// Mock dependencies
vi.mock('../../lib/hooks/usePerformanceRating', () => ({
  usePerformanceRating: () => ({
    rating: 4.5,
    reviewCount: 10,
  }),
}));

vi.mock('../../lib/utils/geocode', () => ({
  getVenueCoordinates: vi.fn().mockResolvedValue({ lat: 37.5665, lng: 126.9780 }),
}));

vi.mock('../../lib/utils/venueCoordinates', () => ({
  getVenueCoordinates: vi.fn().mockReturnValue(null),
  DEFAULT_COORDINATES: { lat: 37.5665, lng: 126.9780 },
}));

vi.mock('../../lib/utils/kakaoMapLoader', () => ({
  loadKakaoMapSDK: vi.fn().mockResolvedValue(undefined),
}));

// Mock window.kakao
global.window.kakao = {
  maps: {
    services: {
      Places: vi.fn(),
      Status: { OK: 'OK' },
      SortBy: { DISTANCE: 'distance' },
    },
    LatLng: vi.fn(),
  },
} as any;

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
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('../ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => <div className={className} data-testid="skeleton" />,
}));

vi.mock('./PerformanceMap', () => ({
  PerformanceMap: ({ venue }: { venue: any }) => (
    <div data-testid="performance-map">Map for {venue.name}</div>
  ),
}));

vi.mock('./ReviewSection', () => ({
  ReviewSection: ({ performanceId }: { performanceId: string }) => (
    <div data-testid="review-section">Reviews for {performanceId}</div>
  ),
}));

vi.mock('../common/figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('PerformanceDetail', () => {
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
    vi.clearAllMocks();
  });

  it('should not render when performance is null', () => {
    render(
      <PerformanceDetail performance={null} open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <PerformanceDetail performance={mockPerformance} open={false} onOpenChange={vi.fn()} />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render performance details when open', () => {
    render(
      <PerformanceDetail performance={mockPerformance} open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('테스트 공연')).toBeInTheDocument();
    expect(screen.getByText('뮤지컬')).toBeInTheDocument();
    expect(screen.getByText('강남구')).toBeInTheDocument();
  });

  it('should display performance information in info tab', () => {
    render(
      <PerformanceDetail performance={mockPerformance} open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
    expect(screen.getByText('테스트 주최자')).toBeInTheDocument();
    expect(screen.getByText('30,000원')).toBeInTheDocument();
  });

  it('should display tabs', () => {
    render(
      <PerformanceDetail performance={mockPerformance} open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.getByTestId('tab-info')).toBeInTheDocument();
    expect(screen.getByTestId('tab-location')).toBeInTheDocument();
    expect(screen.getByTestId('tab-reviews')).toBeInTheDocument();
  });

  it('should display review section when reviews tab is active', () => {
    render(
      <PerformanceDetail performance={mockPerformance} open={true} onOpenChange={vi.fn()} />
    );

    const reviewsTab = screen.getByTestId('tab-reviews');
    fireEvent.click(reviewsTab);

    expect(screen.getByTestId('review-section')).toBeInTheDocument();
  });
});
