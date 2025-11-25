# Modern Stack 구현 가이드

## 기술 스택

- **Next.js 16** (App Router)
- **TypeScript**
- **GraphQL** (Apollo Client)
- **Zustand** (상태 관리)
- **React-Hook-Form + Zod** (폼 검증)
- **React Native** (향후 모바일 앱)

## 프로젝트 구조

```
src/
├── lib/
│   ├── apollo/          # Apollo Client 설정
│   │   ├── client.ts
│   │   └── provider.tsx
│   ├── graphql/         # GraphQL 쿼리/뮤테이션
│   │   ├── queries/
│   │   └── mutations/
│   └── validations/     # Zod 스키마
│       ├── auth.schema.ts
│       └── board.schema.ts
├── store/               # Zustand 스토어
│   ├── useAuthStore.ts
│   └── usePerformanceStore.ts
└── components/          # React 컴포넌트
```

## 사용 방법

### 1. GraphQL 쿼리 사용

```typescript
import { useQuery } from '@apollo/client';
import { GET_PERFORMANCES } from '@/lib/graphql/queries/performances';

function PerformanceList() {
  const { data, loading, error } = useQuery(GET_PERFORMANCES, {
    variables: { filters: { district: '강남구' } }
  });
  
  // ...
}
```

### 2. Zustand 스토어 사용

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function MyComponent() {
  const { user, isLoggedIn, setUser } = useAuthStore();
  // ...
}
```

### 3. React-Hook-Form + Zod 사용

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.schema';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  // ...
}
```

## 다음 단계

1. ✅ Next.js 16 설정 완료
2. ✅ Apollo Client 설정 완료
3. ✅ Zustand 스토어 생성 완료
4. ✅ Zod 스키마 생성 완료
5. ⏳ GraphQL 서버 구현 (Supabase Edge Functions 또는 별도 서버)
6. ⏳ 기존 REST API를 GraphQL로 마이그레이션
7. ⏳ React Native 프로젝트 초기화

## 환경 변수

`.env.local` 파일에 다음을 추가하세요:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```


