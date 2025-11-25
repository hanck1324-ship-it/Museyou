# 컴포넌트 개선 가이드 📚

> **목적:** 기존 기능을 유지하면서 프롬프트 기반 개선 방향을 제시합니다.

## 📋 목차

1. [개요](#개요)
2. [작성된 Prompts 목록](#작성된-prompts-목록)
3. [우선순위별 개선 계획](#우선순위별-개선-계획)
4. [컴포넌트별 주요 개선사항](#컴포넌트별-주요-개선사항)
5. [공통 개선사항](#공통-개선사항)
6. [다음 단계](#다음-단계)

---

## 개요

### 🎯 목표
- **기존 코드 건드리지 않음**: 현재 동작하는 기능 보존
- **Prompts 작성**: 각 컴포넌트의 개선 방향 문서화
- **단계적 개선**: 우선순위에 따라 점진적으로 개선

### 📁 Prompts 구조
각 컴포넌트마다 다음 구조로 prompts 작성:

```
components/
└── [feature]/
    └── [component-name]/
        └── prompts/
            ├── 01.wireframe.txt  # 레이아웃 및 구조
            ├── 02.ui.txt          # 디자인 및 스타일
            └── 03.func.txt        # 기능 및 API 연동
```

---

## 작성된 Prompts 목록

### ✅ 완료된 Prompts

#### 1. Performance Card
```
📂 components/performances/performance-card/prompts/
├── 01.wireframe.txt  ✅
├── 02.ui.txt          ✅
└── 03.func.txt        ✅
```

**주요 내용:**
- 공연 카드 레이아웃 (이미지, 정보, 액션)
- 반응형 디자인 (모바일/데스크톱)
- 좋아요, 장바구니, 공유 기능 개선안
- Supabase API 연동 계획
- 성능 최적화 (메모이제이션, 가상화)

#### 2. Performance Detail
```
📂 components/performances/performance-detail/prompts/
├── 01.wireframe.txt  ✅
└── 02.ui.txt          ✅
```

**주요 내용:**
- Dialog 기반 상세 페이지
- Tab 구조 (공연정보/장소/리뷰)
- 지도 통합 계획 (Google Maps)
- 이미지 갤러리, 예매 버튼
- 관련 공연 추천 기능

#### 3. Matching Card
```
📂 components/matching/matching-card/prompts/
└── 01.wireframe.txt  ✅
```

**주요 내용:**
- 매칭 후보자 카드 레이아웃
- 스와이프 인터랙션 (좋아요/패스)
- 성별별 색상 차별화
- 매칭률 표시 및 애니메이션
- 프로필 상세보기 연동

#### 4. Auth Dialog
```
📂 components/auth/auth-dialog/prompts/
└── 01.wireframe.txt  ✅
```

**주요 내용:**
- 로그인/회원가입 탭 구조
- 폼 유효성 검사
- Supabase Auth 연동
- 에러 처리 및 Toast 메시지
- 자동 로그인 플로우

#### 5. Navigation (이미 작성됨)
```
📂 app/src/components/common/navigation/prompts/
├── 01-wireframe.md    ✅
├── 02-ui.md           ✅
├── 03-func.md         ✅
└── 00-implementation-plan.md  ✅
```

---

## 우선순위별 개선 계획

### 🔴 Phase 1: 핵심 기능 강화 (1-2주)

#### 1.1 Performance Card 개선
- [ ] **좋아요 기능** (Supabase likes 테이블)
- [ ] **실시간 평점 업데이트** (Supabase Realtime)
- [ ] **이미지 최적화** (WebP 변환)
- [ ] **에러 처리 강화** (에러 바운더리)

#### 1.2 Performance Detail 개선
- [ ] **지도 통합** (Kakao Map API)
- [ ] **예매 버튼 연동** (외부 예매 링크)
- [ ] **공유 기능** (Web Share API)
- [ ] **관련 공연 추천**

#### 1.3 Auth Dialog 개선
- [ ] **소셜 로그인** (카카오, 구글)
- [ ] **비밀번호 재설정**
- [ ] **이메일 인증**
- [ ] **프로필 사진 업로드**

### 🟡 Phase 2: UX 향상 (3-4주)

#### 2.1 Matching Card 개선
- [ ] **스와이프 애니메이션** (Framer Motion)
- [ ] **매칭 알고리즘 개선**
- [ ] **채팅 연동**
- [ ] **프로필 상세 모달**

#### 2.2 공통 UI/UX
- [ ] **다크모드 지원**
- [ ] **로딩 스켈레톤** (모든 카드)
- [ ] **무한 스크롤** (목록 페이지)
- [ ] **필터/정렬** (공연, 매칭)

#### 2.3 성능 최적화
- [ ] **이미지 Lazy Loading**
- [ ] **컴포넌트 메모이제이션**
- [ ] **가상화 (Virtual List)**
- [ ] **Code Splitting**

### 🟢 Phase 3: 고급 기능 (5-6주)

#### 3.1 추가 기능
- [ ] **알림 시스템** (Supabase Realtime)
- [ ] **결제 연동** (토스 페이먼츠)
- [ ] **리뷰 시스템 강화**
- [ ] **AI 추천** (OpenAI API)

#### 3.2 분석 및 모니터링
- [ ] **Google Analytics**
- [ ] **Sentry 에러 트래킹**
- [ ] **성능 모니터링**
- [ ] **A/B 테스팅**

---

## 컴포넌트별 주요 개선사항

### 1. Performance Card

#### 현재 상태 ✅
- 공연 정보 표시 (제목, 카테고리, 장소, 날짜, 평점)
- 상세보기 버튼
- 데이트 신청 버튼 (optional)
- 반응형 디자인
- Hover 애니메이션

#### 필요한 개선 🔧

##### 1.1 좋아요 기능
```typescript
// Supabase 테이블
CREATE TABLE likes (
  user_id UUID REFERENCES users(id),
  performance_id UUID REFERENCES performances(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, performance_id)
);

// Hook
function usePerformanceLike(performanceId: string) {
  const [isLiked, setIsLiked] = useState(false);
  
  const toggleLike = async () => {
    // Supabase 연동
  };
  
  return { isLiked, toggleLike };
}
```

##### 1.2 장바구니 기능
```typescript
// Zustand Store
interface CartStore {
  items: Performance[];
  addItem: (item: Performance) => void;
  removeItem: (id: string) => void;
}
```

##### 1.3 공유 기능
```typescript
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: performance.title,
      text: performance.description,
      url: window.location.href
    });
  }
};
```

### 2. Performance Detail

#### 현재 상태 ✅
- Dialog 기반 상세 페이지
- Tab 구조 (공연정보/장소/리뷰)
- 반응형 디자인
- 리뷰 섹션 컴포넌트

#### 필요한 개선 🔧

##### 2.1 지도 통합
```tsx
import { Map, MapMarker } from 'react-kakao-maps-sdk';

<Map
  center={{ lat: venue.latitude, lng: venue.longitude }}
  style={{ width: '100%', height: '200px' }}
>
  <MapMarker position={{ lat: venue.latitude, lng: venue.longitude }}>
    <div>{venue.name}</div>
  </MapMarker>
</Map>
```

##### 2.2 이미지 갤러리
```tsx
<Carousel className="h-64">
  {performance.images.map(img => (
    <CarouselItem key={img.id}>
      <img src={img.url} alt={img.alt} />
    </CarouselItem>
  ))}
</Carousel>
```

##### 2.3 예매 버튼
```tsx
<Button 
  className="w-full"
  onClick={() => window.open(performance.bookingUrl, '_blank')}
>
  <Ticket className="mr-2" />
  예매하기
</Button>
```

### 3. Matching Card

#### 현재 상태 ✅
- 매칭 후보자 정보 표시
- 성별별 색상 차별화
- 매칭률 표시
- 관심사 표시
- 프로필 보기/메시지/좋아요 버튼

#### 필요한 개선 🔧

##### 3.1 스와이프 기능
```tsx
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => onPass(user.id),
  onSwipedRight: () => onLike(user.id),
  trackMouse: true
});

<div {...handlers}>
  <Card>...</Card>
</div>
```

##### 3.2 매칭 애니메이션
```tsx
import { motion } from 'framer-motion';

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.x > 100) {
      onLike(user.id);
    } else if (offset.x < -100) {
      onPass(user.id);
    }
  }}
>
  <Card>...</Card>
</motion.div>
```

### 4. Auth Dialog

#### 현재 상태 ✅
- 로그인/회원가입 탭
- 폼 유효성 검사
- Supabase Auth 연동
- 에러 처리 (Toast)
- 자동 로그인

#### 필요한 개선 🔧

##### 4.1 소셜 로그인
```typescript
// 카카오 로그인
const handleKakaoLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};

// 구글 로그인
const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
};
```

##### 4.2 비밀번호 재설정
```typescript
const handleResetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (!error) {
    toast.success('비밀번호 재설정 이메일을 보냈습니다.');
  }
};
```

##### 4.3 프로필 사진 업로드
```typescript
const handleUploadAvatar = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);
  
  if (!error) {
    // Update user profile with new avatar URL
  }
};
```

---

## 공통 개선사항

### 1. 다크모드 지원 🌙

#### 구현 방법
```typescript
// context/ThemeContext.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### 적용
```tsx
// 모든 컴포넌트에 다크모드 클래스 추가
className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
"
```

### 2. 로딩 스켈레톤 ⏳

#### Performance Card Skeleton
```tsx
export function PerformanceCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
```

### 3. 에러 처리 🚨

#### Error Boundary
```tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to Sentry
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### 4. 성능 최적화 ⚡

#### 메모이제이션
```tsx
// React.memo로 불필요한 리렌더링 방지
export const PerformanceCard = React.memo(
  PerformanceCardComponent,
  (prevProps, nextProps) => {
    return prevProps.performance.id === nextProps.performance.id &&
           prevProps.isLiked === nextProps.isLiked;
  }
);

// useMemo로 계산 결과 캐싱
const sortedPerformances = useMemo(() => {
  return performances.sort((a, b) => b.rating - a.rating);
}, [performances]);

// useCallback으로 함수 참조 유지
const handleLike = useCallback((id: string) => {
  setLikedItems(prev => [...prev, id]);
}, []);
```

#### 가상화 (Virtual List)
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function PerformanceList({ performances }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: performances.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350,
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <PerformanceCard performance={performances[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 다음 단계

### 📅 이번 주 (Week 1)
1. **Performance Card 좋아요 기능 구현**
   - Supabase likes 테이블 생성
   - `usePerformanceLike` Hook 구현
   - UI에 좋아요 버튼 추가

2. **Performance Detail 지도 통합**
   - Kakao Map API 키 발급
   - Map 컴포넌트 구현
   - 길찾기 버튼 연동

3. **에러 처리 강화**
   - Error Boundary 적용
   - Toast 메시지 일관성
   - Fallback UI 구현

### 📅 다음 주 (Week 2)
1. **다크모드 지원**
   - ThemeContext 구현
   - 모든 컴포넌트 다크모드 클래스 추가
   - 토글 버튼 UI

2. **로딩 스켈레톤**
   - 모든 카드 컴포넌트 Skeleton 작성
   - 데이터 로딩 상태 관리

3. **공유 기능**
   - Web Share API 구현
   - 링크 복사 fallback
   - SNS 공유 버튼

### 📅 3주차 이후
1. **성능 최적화**
   - 메모이제이션 적용
   - 가상화 구현
   - Code Splitting

2. **고급 기능**
   - 소셜 로그인
   - 알림 시스템
   - AI 추천

3. **분석 및 모니터링**
   - Google Analytics
   - Sentry
   - 성능 모니터링

---

## 📚 참고 자료

### Supabase
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

### React 성능
- [React.memo](https://react.dev/reference/react/memo)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [React Virtual](https://tanstack.com/virtual/latest)

### 애니메이션
- [Framer Motion](https://www.framer.com/motion/)
- [React Spring](https://www.react-spring.dev/)

### 지도
- [Kakao Map API](https://apis.map.kakao.com/)
- [Google Maps](https://developers.google.com/maps)

---

## 🎯 성공 지표

각 개선사항 완료 시 다음 지표를 확인:

### 기능
- ✅ 기능이 의도대로 동작하는가?
- ✅ 에러 없이 실행되는가?
- ✅ 모든 엣지 케이스가 처리되는가?

### UX
- ✅ 로딩 시간이 적절한가? (< 3초)
- ✅ 애니메이션이 부드러운가? (60fps)
- ✅ 모바일에서 잘 동작하는가?

### 코드 품질
- ✅ TypeScript 타입이 명확한가?
- ✅ 컴포넌트가 재사용 가능한가?
- ✅ 테스트가 작성되었는가?

### 접근성
- ✅ WCAG AA 기준을 만족하는가?
- ✅ 키보드 네비게이션이 가능한가?
- ✅ 스크린 리더가 지원되는가?

---

**Last Updated:** 2025-11-25  
**Version:** 1.0.0  
**Author:** MuseYou Team

