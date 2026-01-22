/**
 * 카카오 주소 검색 API를 사용한 좌표 변환 유틸리티
 */

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY || '';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * 주소를 좌표로 변환하는 함수
 * @param address 주소 문자열
 * @returns 좌표 객체 또는 null
 */
export async function getCoordinatesFromAddress(address: string): Promise<Coordinates | null> {
  // API 키가 없으면 null 반환
  if (!KAKAO_REST_API_KEY) {
    console.warn('카카오 REST API 키가 설정되지 않았습니다.');
    return null;
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('카카오 주소 검색 API 오류:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const firstResult = data.documents[0];
      return {
        lat: parseFloat(firstResult.y),
        lng: parseFloat(firstResult.x),
      };
    }

    return null;
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return null;
  }
}

/**
 * 키워드로 장소를 검색하는 함수
 * @param keyword 검색 키워드
 * @returns 좌표 객체 또는 null
 */
export async function getCoordinatesFromKeyword(keyword: string): Promise<Coordinates | null> {
  // API 키가 없으면 null 반환
  if (!KAKAO_REST_API_KEY) {
    console.warn('카카오 REST API 키가 설정되지 않았습니다.');
    return null;
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('카카오 키워드 검색 API 오류:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const firstResult = data.documents[0];
      return {
        lat: parseFloat(firstResult.y),
        lng: parseFloat(firstResult.x),
      };
    }

    return null;
  } catch (error) {
    console.error('키워드 검색 오류:', error);
    return null;
  }
}

/**
 * 공연장 정보로 좌표를 가져오는 함수 (우선순위: 저장된 좌표 > 주소 검색 > 키워드 검색)
 * @param venueName 공연장 이름
 * @param address 주소
 * @param district 구 이름
 * @returns 좌표 객체 또는 null
 */
export async function getVenueCoordinates(
  venueName: string,
  address?: string,
  district?: string
): Promise<Coordinates | null> {
  // 1. 저장된 좌표 테이블에서 찾기
  const { getVenueCoordinates: getStoredCoordinates, getCoordinatesByDistrict } = await import('./venueCoordinates');
  
  const storedCoords = getStoredCoordinates(venueName);
  if (storedCoords) {
    return storedCoords;
  }

  // 2. 구 이름으로 찾기
  if (district) {
    const districtCoords = getCoordinatesByDistrict(district, venueName);
    if (districtCoords) {
      return districtCoords;
    }
  }

  // 3. 주소 검색 API 사용
  if (address) {
    const addressCoords = await getCoordinatesFromAddress(address);
    if (addressCoords) {
      return addressCoords;
    }
  }

  // 4. 키워드 검색 API 사용
  const keywordCoords = await getCoordinatesFromKeyword(`${venueName} ${district || ''}`);
  if (keywordCoords) {
    return keywordCoords;
  }

  return null;
}
