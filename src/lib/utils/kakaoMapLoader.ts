/**
 * Kakao Map SDK 동적 로드 유틸리티
 */

declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * Kakao Map SDK를 동적으로 로드합니다.
 * @returns Promise<void>
 */
export function loadKakaoMapSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 즉시 resolve
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    // 환경 변수에서 API 키 가져오기
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_KAKAO_MAP_API_KEY') {
      console.warn('Kakao Map API key is not set. Please set VITE_KAKAO_MAP_API_KEY in .env.local');
      // API 키가 없어도 에러를 발생시키지 않고 경고만 표시
      // index.html에서 로드된 경우를 대비
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          reject(new Error('Kakao Map API key is not set. Please set VITE_KAKAO_MAP_API_KEY in .env.local'));
        }
      }, 1000);
      return;
    }

    // 이미 로드 중인 스크립트가 있는지 확인
    const existingScript = document.querySelector(
      `script[src*="dapi.kakao.com/v2/maps/sdk.js"]`
    );
    
    if (existingScript) {
      // 스크립트가 이미 있으면 로드 완료를 기다림
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.kakao || !window.kakao.maps) {
          reject(new Error('Failed to load Kakao Map SDK: Timeout'));
        }
      }, 10000);

      return;
    }

    // 새 스크립트 생성 및 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        reject(new Error('Kakao Map SDK loaded but window.kakao.maps is not available'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Kakao Map SDK'));
    };

    document.head.appendChild(script);
  });
}
