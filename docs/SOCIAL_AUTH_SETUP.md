# 소셜 로그인 설정 가이드

> 구글, 카카오, 네이버 소셜 로그인 설정 방법

---

## 📋 Supabase 설정

### 1. Supabase 대시보드에서 OAuth 제공자 설정

#### 구글 (Google)
1. Supabase 대시보드 → Authentication → Providers
2. Google 활성화
3. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
4. Client ID와 Client Secret을 Supabase에 입력
5. Redirect URL: `https://[your-project-id].supabase.co/auth/v1/callback`

#### 카카오 (Kakao)
1. Supabase 대시보드 → Authentication → Providers
2. Kakao 활성화
3. Kakao Developers에서 애플리케이션 등록
4. REST API 키를 Supabase에 입력
5. Redirect URI: `https://[your-project-id].supabase.co/auth/v1/callback`

#### 네이버 (Naver)
1. Supabase 대시보드 → Authentication → Providers
2. Naver 활성화
3. Naver Developers에서 애플리케이션 등록
4. Client ID와 Client Secret을 Supabase에 입력
5. Callback URL: `https://[your-project-id].supabase.co/auth/v1/callback`

---

## 🔧 환경 변수 설정

`.env` 파일에 Supabase 정보가 이미 설정되어 있어야 합니다:

```env
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🚀 사용 방법

### 사용자 관점
1. 로그인/회원가입 다이얼로그 열기
2. 구글, 카카오, 네이버 중 하나 선택
3. 각 서비스의 로그인 페이지로 리다이렉트
4. 로그인 완료 후 자동으로 앱으로 돌아옴
5. 로그인 성공!

### 개발자 관점

#### 소셜 로그인 함수 사용
```typescript
import { signInWithGoogle, signInWithKakao, signInWithNaver } from '@/lib/utils/socialAuth';

// 구글 로그인
await signInWithGoogle();

// 카카오 로그인
await signInWithKakao();

// 네이버 로그인
await signInWithNaver();
```

#### OAuth 콜백 처리
```typescript
import { handleOAuthCallback } from '@/lib/utils/socialAuth';

const result = await handleOAuthCallback();
if (result) {
  // 로그인 성공
  console.log('User:', result.user);
  console.log('Session:', result.session);
}
```

---

## 📝 구현된 기능

### ✅ 완료된 기능
- [x] 구글 로그인
- [x] 카카오 로그인
- [x] 네이버 로그인
- [x] OAuth 콜백 처리
- [x] 세션 관리
- [x] 로그인/회원가입 UI 통합
- [x] 자동 리다이렉트

### 🔄 향후 개선 사항
- [ ] 소셜 로그인 연동 해제 기능
- [ ] 여러 소셜 계정 연동 기능
- [ ] 소셜 로그인 프로필 정보 자동 동기화

---

## ⚠️ 주의사항

1. **Supabase 설정 필수**: 각 소셜 로그인 제공자를 Supabase 대시보드에서 활성화해야 합니다.

2. **Redirect URL 설정**: 각 OAuth 제공자에서 Redirect URL을 정확히 설정해야 합니다.

3. **로컬 개발**: 로컬 개발 시 `http://localhost:5173/auth/callback`도 Redirect URL에 추가해야 할 수 있습니다.

4. **프로덕션 배포**: 프로덕션 배포 시 실제 도메인의 Redirect URL을 설정해야 합니다.

---

## 🐛 문제 해결

### 로그인이 안 되는 경우
1. Supabase 대시보드에서 제공자가 활성화되어 있는지 확인
2. Redirect URL이 정확한지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. Supabase 로그에서 인증 이벤트 확인

### 콜백 페이지에서 에러 발생
1. URL에 `code` 파라미터가 있는지 확인
2. 세션이 정상적으로 생성되는지 확인
3. `handleOAuthCallback` 함수의 에러 로그 확인

---

## 📚 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Google OAuth 설정](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Kakao OAuth 설정](https://supabase.com/docs/guides/auth/social-login/auth-kakao)
- [Naver OAuth 설정](https://supabase.com/docs/guides/auth/social-login/auth-naver)

---

**Last Updated**: 2025-01-25
