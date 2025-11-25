"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface PerformanceMapProps {
  venue?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null;
  className?: string;
}

export function PerformanceMap({ venue, className }: PerformanceMapProps) {
  // 카카오맵 로드
  useEffect(() => {
    if (venue?.lat && venue?.lng) {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("performance-map");
          if (container) {
            const options = {
              center: new window.kakao.maps.LatLng(venue.lat, venue.lng),
              level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);
            
            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: new window.kakao.maps.LatLng(venue.lat, venue.lng),
            });
            
            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:10px;font-size:12px;text-align:center;">${venue.name}</div>`,
            });
            
            // 마커에 인포윈도우 표시
            infowindow.open(map, marker);
          }
        });
      }
    }
  }, [venue]);

  if (!venue) return null;

  return (
    <div className={className}>
      <div className="mb-3">
        <h4 className="text-sm sm:text-base font-semibold mb-1">공연장소</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">{venue.name}</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{venue.address}</p>
      </div>
      <div 
        id="performance-map" 
        className="w-full h-48 sm:h-56 rounded-lg bg-muted"
      />
    </div>
  );
}

