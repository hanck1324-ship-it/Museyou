import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { loadKakaoMapSDK } from '@/lib/utils/kakaoMapLoader';

interface Venue {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface PerformanceMapProps {
  venue?: Venue | null;
  className?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function PerformanceMap({ venue, className = '' }: PerformanceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!venue || !mapRef.current) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const initializeMap = () => {
      try {
        const lat = venue.lat;
        const lng = venue.lng;

        const mapOption = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);
        mapInstanceRef.current = map;

        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="
              padding: 12px;
              min-width: 150px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
              <h4 style="
                margin: 0 0 4px 0;
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
              ">${venue.name}</h4>
              <p style="
                margin: 0;
                font-size: 12px;
                color: #6b7280;
                line-height: 1.4;
              ">${venue.address}</p>
            </div>
          `,
        });

        infowindow.open(map, marker);

        if (!cancelled) setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error('지도 초기화 오류:', err);
          setError('지도를 불러오는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }
    };

    loadKakaoMapSDK()
      .then(() => {
        if (cancelled || !mapRef.current) return;
        initializeMap();
      })
      .catch((sdkError) => {
        if (cancelled) return;
        console.error('Kakao Map SDK 로드 실패:', sdkError);
        setError('카카오 맵을 불러올 수 없습니다. API 키를 확인해주세요.');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      mapInstanceRef.current = null;
    };
  }, [venue]);

  if (!venue) {
    return (
      <div className={`bg-muted h-40 sm:h-48 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <MapPin className="size-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs sm:text-sm text-muted-foreground">장소 정보가 없습니다</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-muted h-40 sm:h-48 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <MapPin className="size-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="size-6 mx-auto text-muted-foreground animate-spin mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="h-40 sm:h-48 rounded-lg overflow-hidden"
        style={{ minHeight: '160px' }}
      />
    </div>
  );
}
