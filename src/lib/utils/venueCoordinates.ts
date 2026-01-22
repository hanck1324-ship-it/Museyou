/**
 * 주요 공연장 좌표 매핑 테이블
 * 실제 좌표 데이터가 없을 때 사용하는 fallback 데이터
 */
export const VENUE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // 주요 공연장
  "예술의전당": { lat: 37.4782, lng: 127.0122 },
  "예술의전당 콘서트홀": { lat: 37.4782, lng: 127.0122 },
  "세종문화회관": { lat: 37.5720, lng: 126.9761 },
  "세종문화회관 대극장": { lat: 37.5720, lng: 126.9761 },
  "롯데콘서트홀": { lat: 37.5121, lng: 127.1056 },
  "블루스퀘어": { lat: 37.5408, lng: 127.0022 },
  "블루스퀘어 마스터카드홀": { lat: 37.5408, lng: 127.0022 },
  "올림픽공원": { lat: 37.5219, lng: 127.1264 },
  "올림픽공원 올림픽홀": { lat: 37.5219, lng: 127.1264 },
  "잠실종합운동장": { lat: 37.5150, lng: 127.0714 },
  "잠실실내체육관": { lat: 37.5150, lng: 127.0714 },
  "고려대학교 화정체육관": { lat: 37.5896, lng: 127.0273 },
  "연세대학교 대강당": { lat: 37.5643, lng: 126.9364 },
  "서울대학교 문화관": { lat: 37.4596, lng: 126.9519 },
  "한국전쟁기념관": { lat: 37.5364, lng: 126.9770 },
  "국립중앙박물관": { lat: 37.5249, lng: 126.9773 },
  "국립극장": { lat: 37.5474, lng: 126.9934 },
  "LG아트센터": { lat: 37.5121, lng: 127.1056 },
  "한전아트센터": { lat: 37.5665, lng: 126.9780 },
  "충무아트홀": { lat: 37.5606, lng: 126.9942 },
  "대학로": { lat: 37.5826, lng: 127.0014 },
  "대학로 아르코예술극장": { lat: 37.5826, lng: 127.0014 },
  "명동": { lat: 37.5636, lng: 126.9826 },
  "홍대": { lat: 37.5563, lng: 126.9238 },
  "강남": { lat: 37.4979, lng: 127.0276 },
  "잠실": { lat: 37.5133, lng: 127.1028 },
  "잠실 롯데월드": { lat: 37.5133, lng: 127.1028 },
  "잠실 롯데월드타워": { lat: 37.5125, lng: 127.1025 },
  "송파": { lat: 37.5145, lng: 127.1058 },
  "서초": { lat: 37.4837, lng: 127.0324 },
  "강남구": { lat: 37.4979, lng: 127.0276 },
  "서초구": { lat: 37.4837, lng: 127.0324 },
  "송파구": { lat: 37.5145, lng: 127.1058 },
  "마포구": { lat: 37.5663, lng: 126.9019 },
  "종로구": { lat: 37.5735, lng: 126.9788 },
  "중구": { lat: 37.5640, lng: 126.9970 },
  "용산구": { lat: 37.5326, lng: 126.9904 },
  "영등포구": { lat: 37.5264, lng: 126.8962 },
  "성동구": { lat: 37.5634, lng: 127.0368 },
  "광진구": { lat: 37.5384, lng: 127.0822 },
  "강동구": { lat: 37.5301, lng: 127.1238 },
  "강서구": { lat: 37.5509, lng: 126.8495 },
  "양천구": { lat: 37.5170, lng: 126.8663 },
  "구로구": { lat: 37.4954, lng: 126.8874 },
  "금천구": { lat: 37.4519, lng: 126.8956 },
  "관악구": { lat: 37.4783, lng: 126.9516 },
  "서대문구": { lat: 37.5791, lng: 126.9368 },
  "은평구": { lat: 37.6027, lng: 126.9291 },
  "노원구": { lat: 37.6542, lng: 127.0568 },
  "도봉구": { lat: 37.6688, lng: 127.0471 },
  "강북구": { lat: 37.6398, lng: 127.0253 },
  "성북구": { lat: 37.5894, lng: 127.0167 },
  "동대문구": { lat: 37.5744, lng: 127.0396 },
  "중랑구": { lat: 37.6063, lng: 127.0926 },
};

/**
 * 공연장 이름으로 좌표를 찾는 함수
 * @param venueName 공연장 이름
 * @returns 좌표 객체 또는 null
 */
export function getVenueCoordinates(venueName: string): { lat: number; lng: number } | null {
  // 정확한 매칭 시도
  if (VENUE_COORDINATES[venueName]) {
    return VENUE_COORDINATES[venueName];
  }

  // 부분 매칭 시도 (대소문자 무시)
  const normalizedName = venueName.toLowerCase().trim();
  for (const [key, value] of Object.entries(VENUE_COORDINATES)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }

  return null;
}

/**
 * 주소로 좌표를 찾는 함수 (구/동 기준)
 * @param district 구 이름
 * @param venueName 공연장 이름 (선택사항)
 * @returns 좌표 객체 또는 null
 */
export function getCoordinatesByDistrict(district: string, venueName?: string): { lat: number; lng: number } | null {
  // 공연장 이름이 있으면 먼저 시도
  if (venueName) {
    const venueCoords = getVenueCoordinates(venueName);
    if (venueCoords) return venueCoords;
  }

  // 구 이름으로 찾기
  const districtKey = district.replace('구', '') + '구';
  if (VENUE_COORDINATES[districtKey]) {
    return VENUE_COORDINATES[districtKey];
  }

  return null;
}

/**
 * 기본 좌표 (서울 시청)
 */
export const DEFAULT_COORDINATES = { lat: 37.5665, lng: 126.9780 };
