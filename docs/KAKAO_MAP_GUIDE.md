# 카카오 맵 통합 가이드 🗺️

> 코드캠프 프로젝트의 카카오 맵 구현을 MuseYou에 적용했습니다.

## 📋 완료된 작업

### 1. 라이브러리 설치 ✅
```bash
pnpm add react-kakao-maps-sdk
```

**버전:** `v1.2.0` (코드캠프와 동일)

### 2. PerformanceMap 컴포넌트 생성 ✅

**경로:** `app/src/components/performances/PerformanceMap.tsx`

**기능:**
- 공연 장소 지도 표시
- 마커 + 인포윈도우 표시
- 장소명, 주소 표시
- 반응형 디자인

**Props:**
```typescript
interface PerformanceMapProps {
  venue?: {
    name: string;      // 공연장 이름
    address: string;   // 주소
    lat: number;       // 위도
    lng: number;       // 경도
  } | null;
  className?: string;
}
```

### 3. PerformanceDetail 통합 ✅

**변경사항:**
- "장소/경로" 탭에 카카오 맵 추가
- 기존 placeholder 제거
- PerformanceMap 컴포넌트 사용

### 4. 카카오 맵 SDK 추가 ✅

**파일:** `app/index.html`

```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY&libraries=services"></script>
```

---

## 🔑 API 키 설정

### 1. 카카오 개발자 계정 생성
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 또는 회원가입
3. "내 애플리케이션" 메뉴 선택

### 2. 애플리케이션 등록
1. "애플리케이션 추가하기" 클릭
2. 앱 이름: `MuseYou` 입력
3. 사업자명: 개인 또는 회사명 입력

### 3. JavaScript 키 발급
1. 생성된 앱 선택
2. "앱 키" 메뉴에서 **JavaScript 키** 복사
3. 플랫폼 추가:
   - 웹 플랫폼 선택
   - 사이트 도메인: `http://localhost:3001` 추가

### 4. API 키 적용

**Option A: 직접 수정 (개발 환경)**

`app/index.html` 파일 수정:
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_ACTUAL_KEY_HERE&libraries=services"></script>
```

**Option B: 환경 변수 사용 (권장, 프로덕션)**

1. `.env.local` 생성:
```bash
VITE_KAKAO_MAP_API_KEY=your_actual_key_here
```

2. `vite.config.ts`에서 환경 변수 주입:
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __KAKAO_MAP_API_KEY__: JSON.stringify(process.env.VITE_KAKAO_MAP_API_KEY),
  },
});
```

3. `index.html`에서 사용:
```html
<script>
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${__KAKAO_MAP_API_KEY__}&libraries=services`;
  document.head.appendChild(script);
</script>
```

---

## 🚀 사용 방법

### 기본 사용

```tsx
import { PerformanceMap } from './components/performances/PerformanceMap';

<PerformanceMap 
  venue={{
    name: "예술의전당 콘서트홀",
    address: "서울시 서초구 남부순환로 2406",
    lat: 37.4782,
    lng: 127.0122
  }}
/>
```

### 현재 구현 (임시 좌표)

```tsx
// PerformanceDetail.tsx
<PerformanceMap 
  venue={{
    name: performance.venue,
    address: `서울시 ${performance.district}`,
    // TODO: 실제 API에서 좌표 받아오기
    lat: 37.5665,  // 서울 시청
    lng: 126.9780
  }}
/>
```

---

## 📍 실제 좌표 데이터 통합

### 방법 1: Supabase에 좌표 추가

#### 1단계: performances 테이블 수정
```sql
ALTER TABLE performances 
ADD COLUMN lat DOUBLE PRECISION,
ADD COLUMN lng DOUBLE PRECISION;

-- 기존 데이터 업데이트 (예시)
UPDATE performances 
SET lat = 37.4782, lng = 127.0122 
WHERE venue = '예술의전당';
```

#### 2단계: Performance 타입 업데이트
```typescript
// PerformanceCard.tsx
export interface Performance {
  id: string;
  title: string;
  // ... 기존 필드
  lat?: number;  // 추가
  lng?: number;  // 추가
}
```

#### 3단계: PerformanceDetail 업데이트
```tsx
<PerformanceMap 
  venue={{
    name: performance.venue,
    address: `서울시 ${performance.district}`,
    lat: performance.lat || 37.5665,  // fallback
    lng: performance.lng || 126.9780
  }}
/>
```

### 방법 2: 카카오 주소 검색 API 사용

```typescript
// utils/geocode.ts
export async function getCoordinates(address: string) {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${YOUR_REST_API_KEY}`,
    },
  });
  
  const data = await response.json();
  
  if (data.documents.length > 0) {
    return {
      lat: parseFloat(data.documents[0].y),
      lng: parseFloat(data.documents[0].x),
    };
  }
  
  return null;
}

// 사용
const coords = await getCoordinates("서울시 서초구 남부순환로 2406");
```

### 방법 3: 공연장 좌표 매핑 테이블

```typescript
// constants/venueCoordinates.ts
export const VENUE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "예술의전당": { lat: 37.4782, lng: 127.0122 },
  "세종문화회관": { lat: 37.5720, lng: 126.9761 },
  "롯데콘서트홀": { lat: 37.5121, lng: 127.1056 },
  "블루스퀘어": { lat: 37.5408, lng: 127.0022 },
  // ... 더 많은 공연장
};

// 사용
const coords = VENUE_COORDINATES[performance.venue] || { lat: 37.5665, lng: 126.9780 };
```

---

## 🎨 커스터마이징

### 지도 스타일 변경

```tsx
// PerformanceMap.tsx
const options = {
  center: new window.kakao.maps.LatLng(venue.lat, venue.lng),
  level: 3,  // 확대 레벨 (1-14, 작을수록 확대)
  mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,  // ROADMAP, SKYVIEW
};
```

### 마커 커스텀

```tsx
// 커스텀 마커 이미지
const imageSrc = '/marker-icon.png';
const imageSize = new window.kakao.maps.Size(64, 69);
const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

const markerImage = new window.kakao.maps.MarkerImage(
  imageSrc, 
  imageSize, 
  imageOption
);

const marker = new window.kakao.maps.Marker({
  map: map,
  position: new window.kakao.maps.LatLng(venue.lat, venue.lng),
  image: markerImage,
});
```

### 인포윈도우 스타일

```tsx
const infowindow = new window.kakao.maps.InfoWindow({
  content: `
    <div style="
      padding: 12px;
      min-width: 150px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    ">
      <h4 style="margin: 0 0 4px 0; font-weight: 600;">${venue.name}</h4>
      <p style="margin: 0; font-size: 12px; color: #666;">${venue.address}</p>
    </div>
  `,
});
```

---

## 🐛 트러블슈팅

### 문제 1: 지도가 표시되지 않음

**원인:**
- API 키가 올바르지 않음
- SDK 스크립트가 로드되지 않음
- 도메인이 등록되지 않음

**해결:**
```javascript
// 콘솔에서 확인
console.log(window.kakao);  // undefined면 SDK 미로드
console.log(window.kakao.maps);  // undefined면 API 키 문제
```

### 문제 2: 마커가 표시되지 않음

**원인:**
- 좌표가 유효하지 않음
- lat/lng 순서가 바뀜

**해결:**
```typescript
// 좌표 유효성 검사
if (venue?.lat && venue?.lng) {
  console.log(`좌표: ${venue.lat}, ${venue.lng}`);
  // 서울 범위: 37.4-37.7, 126.7-127.2
  const isValidSeoul = 
    venue.lat >= 37.4 && venue.lat <= 37.7 &&
    venue.lng >= 126.7 && venue.lng <= 127.2;
    
  if (!isValidSeoul) {
    console.warn('서울 범위 밖 좌표');
  }
}
```

### 문제 3: 빌드 에러

**원인:**
- window 객체가 서버에서 undefined

**해결:**
```typescript
// "use client" 추가 필수
"use client";

// 또는 동적 import
const PerformanceMap = dynamic(
  () => import('./PerformanceMap'),
  { ssr: false }
);
```

---

## 📚 참고 자료

### 공식 문서
- [Kakao Maps Web API](https://apis.map.kakao.com/web/)
- [react-kakao-maps-sdk](https://github.com/JaeSeoKim/react-kakao-maps-sdk)

### 예제
- 코드캠프 구현: `/Users/hanchang-gi/Desktop/code-camp/Final_test/components/product-detail/product-map.tsx`
- MuseYou 구현: `/Users/hanchang-gi/Desktop/프론트앤드/Muse_YOU/Museyou/app/src/components/performances/PerformanceMap.tsx`

---

## 🚀 다음 단계

### Phase 1: 기본 기능 완성
- [ ] 카카오 API 키 발급 및 적용
- [ ] 실제 공연장 좌표 데이터 추가
- [ ] 지도 스타일 조정

### Phase 2: 고급 기능
- [ ] 길찾기 버튼 → 카카오맵 앱 연동
- [ ] 주변 지하철역 표시
- [ ] 공연장 정보 오버레이

### Phase 3: UX 개선
- [ ] 지도 로딩 스켈레톤
- [ ] 에러 fallback UI
- [ ] 지도 확대/축소 컨트롤 커스텀

---

**Last Updated:** 2025-11-25  
**Version:** 1.0.0  
**Status:** 통합 완료 ✅

