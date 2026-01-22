# Performance Detail 지도 개선 완료 🗺️

## 📋 작업 개요

Performance Detail 페이지의 지도 기능을 개선하여 실제 공연장 좌표 데이터 통합, 카카오 주소 검색 API 연동, 길찾기 기능 강화를 완료했습니다.

## ✅ 완료된 작업

### 1. 공연장 좌표 데이터 통합
- **파일**: `src/lib/utils/venueCoordinates.ts`
- **기능**:
  - 주요 공연장 좌표 매핑 테이블 생성
  - 50개 이상의 주요 공연장 및 구별 좌표 데이터
  - `getVenueCoordinates()`: 공연장 이름으로 좌표 찾기
  - `getCoordinatesByDistrict()`: 구 이름으로 좌표 찾기
  - 부분 매칭 지원 (대소문자 무시)

### 2. 카카오 주소 검색 API 연동
- **파일**: `src/lib/utils/geocode.ts`
- **기능**:
  - `getCoordinatesFromAddress()`: 주소를 좌표로 변환
  - `getCoordinatesFromKeyword()`: 키워드로 장소 검색
  - `getVenueCoordinates()`: 우선순위 기반 좌표 검색
    - 1순위: 저장된 좌표 테이블
    - 2순위: 구 이름으로 찾기
    - 3순위: 카카오 주소 검색 API
    - 4순위: 카카오 키워드 검색 API
    - 5순위: 기본 좌표 (서울 시청)

### 3. PerformanceDetail 컴포넌트 개선
- **파일**: `src/components/performances/PerformanceDetail.tsx`
- **변경사항**:
  - 좌표 로딩 상태 관리 추가
  - 비동기 좌표 검색 구현
  - 로딩 인디케이터 추가
  - 네이버 지도 길찾기 버튼 추가

### 4. 길찾기 기능 강화
- **기능**:
  - 카카오맵 길찾기 버튼
  - 네이버 지도 길찾기 버튼
  - 주소 기반 자동 검색

## 🔧 기술적 개선사항

### 좌표 검색 우선순위
```typescript
// 1. 저장된 좌표 (가장 빠름)
const storedCoords = getStoredCoordinates(venueName);

// 2. 구 이름으로 찾기
const districtCoords = getCoordinatesByDistrict(district, venueName);

// 3. 카카오 주소 검색 API
const addressCoords = await getCoordinatesFromAddress(address);

// 4. 카카오 키워드 검색 API
const keywordCoords = await getCoordinatesFromKeyword(keyword);

// 5. 기본 좌표 (fallback)
const defaultCoords = DEFAULT_COORDINATES;
```

### 비동기 좌표 로딩
```typescript
useEffect(() => {
  const loadCoordinates = async () => {
    setIsLoadingCoordinates(true);
    
    // 좌표 검색 로직
    const coords = await getVenueCoordinates(...);
    
    setVenueInfo(coords);
    setIsLoadingCoordinates(false);
  };
  
  loadCoordinates();
}, [performance, open]);
```

## 📊 주요 공연장 좌표 데이터

### 포함된 공연장
- 예술의전당 (37.4782, 127.0122)
- 세종문화회관 (37.5720, 126.9761)
- 롯데콘서트홀 (37.5121, 127.1056)
- 블루스퀘어 (37.5408, 127.0022)
- 올림픽공원 (37.5219, 127.1264)
- 잠실종합운동장 (37.5150, 127.0714)
- 기타 주요 공연장 및 서울시 25개 구 좌표

## 🚀 사용 방법

### 환경 변수 설정
```bash
# .env.local
VITE_KAKAO_REST_API_KEY=your_rest_api_key_here
```

### 컴포넌트 사용
```tsx
<PerformanceDetail 
  performance={performance}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

자동으로:
1. 저장된 좌표 테이블에서 검색
2. 없으면 카카오 API로 검색
3. 최종적으로 기본 좌표 사용

## 📝 참고사항

### API 키 설정
- 카카오 REST API 키는 환경 변수로 설정
- 키가 없어도 저장된 좌표 테이블과 기본 좌표로 동작
- API 키가 있으면 더 정확한 좌표 검색 가능

### 성능 최적화
- 저장된 좌표 테이블 우선 사용 (즉시 반환)
- API 호출은 비동기로 처리
- 로딩 상태 표시로 사용자 경험 개선

## 🔗 관련 파일

- `src/lib/utils/venueCoordinates.ts`: 공연장 좌표 매핑 테이블
- `src/lib/utils/geocode.ts`: 카카오 API 연동 유틸리티
- `src/components/performances/PerformanceDetail.tsx`: Performance Detail 컴포넌트
- `src/components/performances/PerformanceMap.tsx`: 지도 컴포넌트

## 🚀 다음 단계

### 추천 개선사항
1. **주변 지하철역 표시**: 카카오 API로 주변 지하철역 검색 및 표시
2. **주변 버스 정류장**: 주변 버스 정류장 정보 표시
3. **주차장 정보**: 주변 주차장 정보 및 요금 표시
4. **좌표 캐싱**: 검색한 좌표를 localStorage에 캐싱하여 재사용

---

**작업 완료일**: 2025-01-27  
**작업자**: AI Assistant  
**상태**: ✅ 완료
