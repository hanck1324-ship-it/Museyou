# 🛠️ 기능 구현 방법 가이드

> 프롬프트 기반 개발 방식으로 기능을 구현하는 단계별 가이드

## 📋 목차

1. [기본 워크플로우](#기본-워크플로우)
2. [실전 예시: 좋아요 기능 구현](#실전-예시-좋아요-기능-구현)
3. [실전 예시: 지도 통합](#실전-예시-지도-통합)
4. [실전 예시: 소셜 로그인](#실전-예시-소셜-로그인)
5. [문제 해결 가이드](#문제-해결-가이드)

---

## 기본 워크플로우

### 1단계: 프롬프트 확인 (5분)

```bash
# 작업할 컴포넌트의 프롬프트 읽기
cat components/[feature]/[component]/prompts/01.wireframe.txt
cat components/[feature]/[component]/prompts/02.ui.txt
cat components/[feature]/[component]/prompts/03.func.txt
```

**확인 사항:**
- [ ] 기능 명세 확인
- [ ] API 연동 계획 확인
- [ ] 타입 정의 확인
- [ ] 에러 처리 방법 확인

### 2단계: 설계 (10분)

```typescript
// 1. 타입 정의
interface NewFeatureProps {
  // Props 타입 정의
}

// 2. 상태 관리 계획
// - 로컬 상태 vs 전역 상태
// - Supabase 연동 필요 여부

// 3. 컴포넌트 구조
// - 단일 컴포넌트 vs 여러 컴포넌트
// - Hook 분리 필요 여부
```

### 3단계: 구현 (30분~2시간)

#### 3.1 Supabase 테이블 생성 (필요시)

```sql
-- Supabase Dashboard에서 실행
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- 컬럼 정의
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.2 API 함수 작성

```typescript
// src/lib/api/[feature]Api.ts
import { supabase } from '@/lib/supabase/config';

export async function fetchData() {
  const { data, error } = await supabase
    .from('table_name')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

#### 3.3 Hook 구현

```typescript
// src/lib/hooks/use[Feature].ts
import { useState, useEffect } from 'react';
import { fetchData } from '@/lib/api/[feature]Api';

export function useFeature() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { data, isLoading, error };
}
```

#### 3.4 컴포넌트 구현

```typescript
// src/components/[feature]/[Component].tsx
import { useFeature } from '@/lib/hooks/use[Feature]';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Component() {
  const { data, isLoading, error } = useFeature();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div>
      {/* UI 구현 */}
    </div>
  );
}
```

### 4단계: 테스트 (15분)

```bash
# 1. 타입 체크
npx tsc --noEmit

# 2. 린트 체크
pnpm lint

# 3. 빌드 테스트
pnpm build

# 4. 수동 테스트
pnpm dev
```

---

## 실전 예시: 좋아요 기능 구현

### 목표
Performance Card에 좋아요 기능 추가 (Supabase 연동)

### 1단계: 프롬프트 확인

```bash
cat components/performances/performance-card/prompts/03.func.txt
```

**확인된 내용:**
- Supabase `likes` 테이블 사용
- `toggleLike` 함수 필요
- 낙관적 업데이트 적용
- 에러 처리 필요

### 2단계: Supabase 테이블 생성

```sql
-- Supabase Dashboard > SQL Editor에서 실행
CREATE TABLE IF NOT EXISTS likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  performance_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, performance_id)
);

-- RLS (Row Level Security) 활성화
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 좋아요만 조회/삭제 가능
CREATE POLICY "Users can view their own likes"
  ON likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);
```

### 3단계: API 함수 작성

```typescript
// src/lib/api/performanceApi.ts
import { supabase } from '@/lib/supabase/config';

/**
 * 좋아요 토글
 * @param performanceId 공연 ID
 * @returns 좋아요 상태 (true: 추가됨, false: 삭제됨)
 */
export async function toggleLike(performanceId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('로그인이 필요합니다');
  }

  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from('likes')
    .select()
    .eq('user_id', user.id)
    .eq('performance_id', performanceId)
    .single();

  if (existing) {
    // 좋아요 삭제
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('performance_id', performanceId);
    
    if (error) throw error;
    return false; // 좋아요 취소됨
  } else {
    // 좋아요 추가
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, performance_id: performanceId });
    
    if (error) throw error;
    return true; // 좋아요 추가됨
  }
}

/**
 * 사용자의 좋아요 목록 조회
 */
export async function fetchUserLikes(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('likes')
    .select('performance_id')
    .eq('user_id', user.id);

  if (error) throw error;
  return data.map(item => item.performance_id);
}
```

### 4단계: Hook 구현

```typescript
// src/lib/hooks/usePerformanceLike.ts
import { useState, useEffect } from 'react';
import { toggleLike as toggleLikeApi, fetchUserLikes } from '@/lib/api/performanceApi';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export function usePerformanceLike(performanceId: string) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 좋아요 상태 로드
  useEffect(() => {
    async function loadLikeStatus() {
      if (!user) return;
      
      try {
        const likedIds = await fetchUserLikes();
        setIsLiked(likedIds.includes(performanceId));
      } catch (error) {
        console.error('좋아요 상태 로드 실패:', error);
      }
    }
    
    loadLikeStatus();
  }, [user, performanceId]);

  const toggle = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    setIsLoading(true);
    const previousState = isLiked;

    try {
      // 낙관적 업데이트
      setIsLiked(!previousState);
      
      const newState = await toggleLikeApi(performanceId);
      setIsLiked(newState);
      
      if (newState) {
        toast.success('좋아요를 추가했습니다');
      } else {
        toast.success('좋아요를 취소했습니다');
      }
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(previousState);
      toast.error('좋아요 처리 중 오류가 발생했습니다');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLiked, toggle, isLoading };
}
```

### 5단계: 컴포넌트에 적용

```typescript
// src/components/performances/PerformanceCard.tsx
import { usePerformanceLike } from '@/lib/hooks/usePerformanceLike';

export function PerformanceCard({ performance }: Props) {
  const { isLiked, toggle, isLoading } = usePerformanceLike(performance.id);

  return (
    <Card>
      {/* ... 기존 코드 ... */}
      
      <Button
        onClick={toggle}
        disabled={isLoading}
        className={isLiked ? 'text-red-500' : ''}
      >
        <Heart className={isLiked ? 'fill-current' : ''} />
      </Button>
    </Card>
  );
}
```

### 6단계: 테스트

```bash
# 1. 개발 서버 실행
pnpm dev

# 2. 수동 테스트
# - 로그인 상태에서 좋아요 버튼 클릭
# - 좋아요 추가/취소 확인
# - 새로고침 후 상태 유지 확인
```

---

## 실전 예시: 지도 통합

### 목표
Performance Detail에 Kakao Map 통합

### 1단계: 프롬프트 확인

```bash
cat components/performances/performance-detail/prompts/02.ui.txt
```

### 2단계: 환경 변수 설정

```bash
# .env.local
VITE_KAKAO_MAP_API_KEY=your_api_key_here
```

### 3단계: 컴포넌트 구현

```typescript
// src/components/performances/PerformanceMap.tsx
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';

interface PerformanceMapProps {
  lat: number;
  lng: number;
  venueName: string;
}

export function PerformanceMap({ lat, lng, venueName }: PerformanceMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Kakao Map SDK 로드 확인
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-64 bg-gray-200 flex items-center justify-center">
        <p>지도를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <Map
      center={{ lat, lng }}
      style={{ width: '100%', height: '256px' }}
      level={3}
      className="rounded-lg"
    >
      <MapMarker position={{ lat, lng }}>
        <div className="p-2">
          <p className="font-semibold">{venueName}</p>
        </div>
      </MapMarker>
    </Map>
  );
}
```

### 4단계: Performance Detail에 통합

```typescript
// src/components/performances/PerformanceDetail.tsx
import { PerformanceMap } from './PerformanceMap';

export function PerformanceDetail({ performance }: Props) {
  return (
    <Dialog>
      <Tabs>
        <TabsContent value="location">
          {performance.lat && performance.lng ? (
            <PerformanceMap
              lat={performance.lat}
              lng={performance.lng}
              venueName={performance.venue}
            />
          ) : (
            <p>위치 정보가 없습니다</p>
          )}
        </TabsContent>
      </Tabs>
    </Dialog>
  );
}
```

---

## 실전 예시: 소셜 로그인

### 목표
Auth Dialog에 카카오/구글 로그인 추가

### 1단계: Supabase 설정

1. Supabase Dashboard > Authentication > Providers
2. Kakao, Google 활성화
3. Redirect URL 설정: `http://localhost:3000/auth/callback`

### 2단계: API 함수 작성

```typescript
// src/lib/api/authApi.ts
import { supabase } from '@/lib/supabase/config';

export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) throw error;
  return data;
}
```

### 3단계: 컴포넌트 구현

```typescript
// src/components/auth/AuthDialog.tsx
import { signInWithKakao, signInWithGoogle } from '@/lib/api/authApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AuthDialog() {
  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      toast.error('카카오 로그인에 실패했습니다');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('구글 로그인에 실패했습니다');
    }
  };

  return (
    <Dialog>
      <div className="space-y-4">
        <Button onClick={handleKakaoLogin} className="w-full">
          카카오로 로그인
        </Button>
        <Button onClick={handleGoogleLogin} className="w-full">
          구글로 로그인
        </Button>
      </div>
    </Dialog>
  );
}
```

### 4단계: 콜백 페이지 구현

```typescript
// src/auth/callback/page.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/config';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('인증 오류:', error);
        navigate('/login');
        return;
      }

      if (data.session) {
        navigate('/');
      }
    }

    handleCallback();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
```

---

## 문제 해결 가이드

### 문제 1: Supabase 연결 오류

**증상:**
```
Error: Failed to fetch
```

**해결 방법:**
1. 환경 변수 확인 (`.env.local`)
2. Supabase URL/Key 확인
3. CORS 설정 확인 (Supabase Dashboard)

### 문제 2: 타입 에러

**증상:**
```
Property 'xxx' does not exist on type 'any'
```

**해결 방법:**
```typescript
// ❌ 나쁜 예
const data: any = await fetchData();

// ✅ 좋은 예
interface Data {
  id: string;
  name: string;
}
const data: Data = await fetchData();
```

### 문제 3: RLS 정책 오류

**증상:**
```
new row violates row-level security policy
```

**해결 방법:**
1. Supabase Dashboard > Authentication > Policies 확인
2. 정책이 올바르게 설정되었는지 확인
3. 사용자 인증 상태 확인

### 문제 4: 빌드 실패

**증상:**
```
Build failed with errors
```

**해결 방법:**
```bash
# 1. 타입 체크
npx tsc --noEmit

# 2. 린트 체크
pnpm lint

# 3. 의존성 재설치
rm -rf node_modules
pnpm install
```

---

## 📚 참고 자료

### Supabase
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### React
- [React Hooks 문서](https://react.dev/reference/react)
- [React Router](https://reactrouter.com/)

### 지도
- [Kakao Map API](https://apis.map.kakao.com/)
- [react-kakao-maps-sdk](https://www.npmjs.com/package/react-kakao-maps-sdk)

---

**Last Updated:** 2025-01-25  
**Version:** 1.0.0
