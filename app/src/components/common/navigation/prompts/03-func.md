# 네비게이션 - 기능 명세

## 기능 개요
사용자가 앱의 주요 섹션 간 원활하게 이동할 수 있도록 하는 네비게이션 시스템입니다.

## 핵심 기능

### 1. 페이지 라우팅
- 각 네비게이션 아이템 클릭 시 해당 페이지로 이동
- React Router 또는 Next.js Router 활용
- 브라우저 히스토리 관리

### 2. 활성 상태 추적
- 현재 페이지에 해당하는 네비게이션 아이템 하이라이트
- URL 경로 기반 활성 상태 판단
- 중첩 라우트 지원

### 3. 권한 기반 표시
- 로그인 상태에 따른 아이템 표시/숨김
- 사용자 역할별 네비게이션 아이템 필터링

## 기술 스택

```typescript
// 주요 의존성
- React 18+
- React Router DOM v6+ 또는 Next.js
- TypeScript
- Tailwind CSS
- lucide-react (아이콘)
```

## 컴포넌트 구조

```
navigation/
├── Navigation.tsx           # 메인 컴포넌트
├── NavigationItem.tsx       # 개별 아이템 컴포넌트
├── useNavigation.ts         # 커스텀 훅
├── navigation.types.ts      # 타입 정의
└── navigation.config.ts     # 네비게이션 설정
```

## 타입 정의

```typescript
// navigation.types.ts

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  requiresAuth?: boolean;
  badge?: number | string;
  disabled?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  variant?: 'bottom' | 'top' | 'sidebar';
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
}

export interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}
```

## 설정 파일

```typescript
// navigation.config.ts

import { Home, Music, Heart, User } from 'lucide-react';
import { NavigationItem } from './navigation.types';

export const navigationConfig: NavigationItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: Home,
    path: '/',
    requiresAuth: false,
  },
  {
    id: 'performances',
    label: '공연',
    icon: Music,
    path: '/performances',
    requiresAuth: false,
  },
  {
    id: 'matching',
    label: '매칭',
    icon: Heart,
    path: '/matching',
    requiresAuth: true,
  },
  {
    id: 'profile',
    label: '마이',
    icon: User,
    path: '/profile',
    requiresAuth: true,
  },
];
```

## 커스텀 훅

```typescript
// useNavigation.ts

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // 인증 훅
import { NavigationItem } from './navigation.types';

export function useNavigation(items: NavigationItem[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 현재 경로와 일치하는 아이템 찾기
  const getActiveItem = () => {
    return items.find(item => {
      if (item.path === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(item.path);
    });
  };

  // 권한 필터링된 아이템 반환
  const visibleItems = items.filter(item => {
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }
    return true;
  });

  // 네비게이션 핸들러
  const handleNavigation = (item: NavigationItem) => {
    if (item.disabled) return;
    
    if (item.requiresAuth && !isAuthenticated) {
      // 로그인 필요 시 로그인 페이지로 리다이렉트
      navigate('/login', { state: { from: item.path } });
      return;
    }

    navigate(item.path);
  };

  return {
    activeItem: getActiveItem(),
    visibleItems,
    handleNavigation,
    isActive: (item: NavigationItem) => getActiveItem()?.id === item.id,
  };
}
```

## 메인 컴포넌트

```typescript
// Navigation.tsx

import React from 'react';
import { NavigationItem } from './NavigationItem';
import { useNavigation } from './useNavigation';
import { navigationConfig } from './navigation.config';
import { NavigationProps } from './navigation.types';
import { cn } from '@/lib/utils';

export function Navigation({ 
  items = navigationConfig,
  variant = 'bottom',
  className,
  onItemClick 
}: NavigationProps) {
  const { visibleItems, isActive, handleNavigation } = useNavigation(items);

  const containerClasses = cn(
    'bg-white/90 backdrop-blur-lg border-gray-200',
    {
      'fixed bottom-0 left-0 right-0 z-50 h-16 border-t': variant === 'bottom',
      'fixed top-0 left-0 right-0 z-50 h-18 border-b': variant === 'top',
      'fixed left-0 top-0 bottom-0 z-40 w-64 border-r': variant === 'sidebar',
    },
    className
  );

  const navClasses = cn(
    'flex h-full max-w-screen-xl mx-auto',
    {
      'flex-row items-center justify-around px-4': variant === 'bottom' || variant === 'top',
      'flex-col items-start justify-start py-4': variant === 'sidebar',
    }
  );

  const handleClick = (item: NavigationItem) => {
    handleNavigation(item);
    onItemClick?.(item);
  };

  return (
    <div className={containerClasses}>
      <nav className={navClasses} role="navigation" aria-label="주요 네비게이션">
        {visibleItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isActive(item)}
            onClick={() => handleClick(item)}
          />
        ))}
      </nav>
    </div>
  );
}
```

## 아이템 컴포넌트

```typescript
// NavigationItem.tsx

import React from 'react';
import { NavigationItemProps } from './navigation.types';
import { cn } from '@/lib/utils';

export function NavigationItem({ 
  item, 
  isActive, 
  onClick 
}: NavigationItemProps) {
  const Icon = item.icon;

  const itemClasses = cn(
    'flex flex-col items-center justify-center gap-1',
    'px-4 py-2 min-w-16 flex-1 rounded-lg',
    'transition-colors duration-200 cursor-pointer',
    'relative',
    {
      'text-primary-600 font-semibold': isActive,
      'text-gray-500 hover:bg-gray-50 hover:text-gray-700': !isActive,
      'opacity-50 cursor-not-allowed': item.disabled,
    }
  );

  return (
    <button
      onClick={onClick}
      disabled={item.disabled}
      className={itemClasses}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* 활성 인디케이터 */}
      {isActive && (
        <span 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full"
          aria-hidden="true"
        />
      )}
      
      {/* 아이콘 */}
      <Icon className="w-6 h-6" aria-hidden="true" />
      
      {/* 라벨 */}
      <span className="text-xs font-medium leading-tight">
        {item.label}
      </span>

      {/* 배지 (선택사항) */}
      {item.badge && (
        <span 
          className="absolute top-1 right-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full"
          aria-label={`${item.badge}개의 알림`}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}
```

## 사용 예시

```typescript
// App.tsx 또는 Layout 컴포넌트

import { Navigation } from '@/components/common/navigation';

function AppLayout() {
  return (
    <div className="min-h-screen pb-16">
      {/* 메인 콘텐츠 */}
      <main>
        {/* ... */}
      </main>

      {/* 하단 네비게이션 */}
      <Navigation variant="bottom" />
    </div>
  );
}
```

## 고급 기능

### 1. 페이지 전환 애니메이션
```typescript
// Framer Motion 활용
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
```

### 2. 스와이프 제스처
```typescript
// 모바일에서 스와이프로 페이지 전환
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => navigateNext(),
  onSwipedRight: () => navigatePrev(),
  trackMouse: false
});
```

### 3. 알림 배지 업데이트
```typescript
// 실시간 알림 카운트
const [notificationCount, setNotificationCount] = useState(0);

useEffect(() => {
  // WebSocket 또는 폴링으로 알림 수 업데이트
  const unsubscribe = subscribeToNotifications((count) => {
    setNotificationCount(count);
  });

  return unsubscribe;
}, []);
```

### 4. 딥 링크 지원
```typescript
// URL 파라미터 기반 페이지 이동
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const section = params.get('section');
  
  if (section) {
    navigate(`/${section}`);
  }
}, [location.search]);
```

## 테스트

```typescript
// Navigation.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { BrowserRouter } from 'react-router-dom';

describe('Navigation', () => {
  it('renders all navigation items', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('홈')).toBeInTheDocument();
    expect(screen.getByLabelText('공연')).toBeInTheDocument();
  });

  it('highlights active item', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const homeItem = screen.getByLabelText('홈');
    expect(homeItem).toHaveAttribute('aria-current', 'page');
  });

  it('handles navigation click', () => {
    const handleClick = jest.fn();
    
    render(
      <BrowserRouter>
        <Navigation onItemClick={handleClick} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByLabelText('공연'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 성능 최적화

1. **메모이제이션**: `React.memo()` 사용으로 불필요한 리렌더링 방지
2. **코드 스플리팅**: 페이지별 lazy loading
3. **이벤트 위임**: 네비게이션 아이템 클릭 핸들러 최적화
4. **Passive Event Listeners**: 스크롤 성능 개선

## 접근성 체크리스트

- [ ] 키보드 네비게이션 (Tab, Enter)
- [ ] ARIA 라벨 및 역할
- [ ] 스크린 리더 호환
- [ ] 포커스 관리
- [ ] 색상 대비 (WCAG AA)
- [ ] 터치 타겟 크기 (최소 48x48px)

