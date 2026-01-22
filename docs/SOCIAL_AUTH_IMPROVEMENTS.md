# 소셜 로그인 개선 사항

## 개선된 기능

### 1. OAuth 콜백 처리 개선
- URL 파라미터에서 에러 정보 추출
- 더 상세한 에러 메시지 표시
- 사용자 메타데이터에서 이름 추출 개선

### 2. 사용자 정보 추출 개선
다음 순서로 사용자 이름을 추출합니다:
1. `user_metadata.name`
2. `user_metadata.full_name`
3. `user_metadata.display_name`
4. 이메일 주소의 @ 앞부분
5. 기본값: '사용자'

### 3. 에러 처리 개선
- URL에서 에러 설명 추출
- 사용자 친화적인 에러 메시지
- 로그인 실패 시 명확한 안내

## Supabase 설정

### 1. OAuth Provider 설정

Supabase Dashboard > Authentication > Providers에서 설정:

#### Google
1. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
2. 승인된 리디렉션 URI 추가: `https://[your-project].supabase.co/auth/v1/callback`
3. Client ID와 Client Secret을 Supabase에 입력

#### Kakao
1. Kakao Developers에서 애플리케이션 생성
2. Redirect URI 설정: `https://[your-project].supabase.co/auth/v1/callback`
3. REST API 키를 Supabase에 입력

#### Naver
1. Naver Developers에서 애플리케이션 등록
2. Callback URL 설정: `https://[your-project].supabase.co/auth/v1/callback`
3. Client ID와 Client Secret을 Supabase에 입력

### 2. Redirect URL 설정

Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `http://localhost:3000` (개발), 실제 도메인 (프로덕션)
- Redirect URLs: 
  - `http://localhost:3000/auth/callback`
  - `https://yourdomain.com/auth/callback`

## 사용 방법

### 1. 소셜 로그인 시작

```typescript
import { signInWithGoogle, signInWithKakao, signInWithNaver } from '@/lib/utils/socialAuth';

// 구글 로그인
await signInWithGoogle();

// 카카오 로그인
await signInWithKakao();

// 네이버 로그인
await signInWithNaver();
```

### 2. 콜백 처리

`/auth/callback` 페이지에서 자동으로 처리됩니다.

### 3. 사용자 정보 확인

```typescript
import { useAuthStore } from '@/store/useAuthStore';

const { user, isLoggedIn } = useAuthStore();
```

## 문제 해결

### 로그인이 완료되지 않는 경우
1. Redirect URL이 Supabase에 등록되어 있는지 확인
2. 브라우저 콘솔에서 에러 확인
3. Supabase Dashboard > Authentication > Logs에서 확인

### 사용자 이름이 표시되지 않는 경우
1. 소셜 로그인 제공자에서 이름 권한 확인
2. Supabase Dashboard > Authentication > Users에서 메타데이터 확인
3. `user_metadata`에 이름이 포함되어 있는지 확인

### 세션이 유지되지 않는 경우
1. `localStorage`에 `access_token`이 저장되는지 확인
2. `useAuthStore`의 `persist` 설정 확인
3. 브라우저 쿠키 설정 확인

## 추가 개선 가능 사항

### 1. 프로필 사진
```typescript
const avatarUrl = result.user.user_metadata?.avatar_url || 
                  result.user.user_metadata?.picture ||
                  null;
```

### 2. 추가 정보 수집
- 생년월일
- 전화번호
- 관심사
- 지역

### 3. 자동 회원가입 처리
소셜 로그인 시 자동으로 프로필 생성 및 추가 정보 수집
