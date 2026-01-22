# Kakao Map API 설정 가이드

## 1. Kakao Map API 키 발급

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 설정 > 플랫폼 > Web 플랫폼 등록
   - 사이트 도메인: `http://localhost:3000` (개발), 실제 도메인 (프로덕션)
4. 앱 키 > JavaScript 키 복사

## 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
VITE_KAKAO_MAP_API_KEY=your_api_key_here
```

## 3. index.html 수정

`index.html`에서 API 키를 환경 변수로 받도록 수정:

```html
<script>
  // 환경 변수에서 API 키 가져오기
  const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY || 'YOUR_KAKAO_MAP_API_KEY';
</script>
<script 
  type="text/javascript" 
  :src="`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&libraries=services,clusterer`"
  defer
></script>
```

또는 Vite의 HTML 변환 플러그인 사용:

```html
<script 
  type="text/javascript" 
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%VITE_KAKAO_MAP_API_KEY%&libraries=services,clusterer"
  defer
></script>
```

## 4. 동적 로드 (권장)

더 나은 방법은 런타임에 동적으로 로드하는 것입니다:

```typescript
// src/lib/utils/kakaoMapLoader.ts
export function loadKakaoMapSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      reject(new Error('Kakao Map API key is not set'));
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao Map SDK'));
    document.head.appendChild(script);
  });
}
```

## 5. PerformanceMap 컴포넌트에서 사용

```typescript
import { loadKakaoMapSDK } from '@/lib/utils/kakaoMapLoader';

useEffect(() => {
  loadKakaoMapSDK()
    .then(() => {
      // 지도 초기화
    })
    .catch((error) => {
      setError(error.message);
    });
}, []);
```

## 6. 주의사항

- API 키는 클라이언트에 노출되므로 도메인 제한 설정 필수
- 무료 플랜: 일일 300,000건 제한
- 유료 플랜: 월 1,000만건 이상 가능

## 7. 문제 해결

### SDK가 로드되지 않는 경우
1. API 키 확인
2. 도메인 등록 확인
3. 브라우저 콘솔에서 에러 확인
4. CORS 설정 확인

### 지도가 표시되지 않는 경우
1. `mapRef.current`가 null이 아닌지 확인
2. 지도 컨테이너의 높이가 설정되어 있는지 확인
3. 좌표값이 올바른지 확인
