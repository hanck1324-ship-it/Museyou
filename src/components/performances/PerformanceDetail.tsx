import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MapPin, Calendar, Clock, Star, Navigation } from "lucide-react";
import { Performance } from "./PerformanceCard";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { ReviewSection } from "./ReviewSection";
import { PerformanceMap } from "./PerformanceMap";
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";
import { getVenueCoordinates } from "../../lib/utils/geocode";
import { getVenueCoordinates as getStoredCoordinates, DEFAULT_COORDINATES } from "../../lib/utils/venueCoordinates";
import { usePerformanceRating } from "../../lib/hooks/usePerformanceRating";
import { loadKakaoMapSDK } from "../../lib/utils/kakaoMapLoader";

interface PerformanceDetailProps {
  performance: Performance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceDetail({ performance, open, onOpenChange }: PerformanceDetailProps) {
  if (!performance) return null;

  const [venueInfo, setVenueInfo] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [subwayStations, setSubwayStations] = useState<Array<{ name: string; distanceM?: number }>>([]);
  const [isLoadingSubway, setIsLoadingSubway] = useState(false);
  
  // 실시간 평점 Hook 사용
  const { rating: realtimeRating, reviewCount: realtimeReviewCount } = usePerformanceRating(performance.id);
  
  // 실시간 평점이 있으면 사용, 없으면 기본 평점 사용
  const displayRating = realtimeRating > 0 ? realtimeRating : performance.rating;
  const displayReviewCount = realtimeReviewCount > 0 ? realtimeReviewCount : performance.reviewCount;

  // 공연장 좌표 정보 로드
  useEffect(() => {
    if (!performance || !open) return;

    const loadCoordinates = async () => {
      setIsLoadingCoordinates(true);

      // 1. 저장된 좌표가 있으면 사용
      if (performance.lat && performance.lng) {
        setVenueInfo({
          name: performance.venue,
          address: `서울시 ${performance.district} ${performance.venue}`,
          lat: performance.lat,
          lng: performance.lng,
        });
        setIsLoadingCoordinates(false);
        return;
      }

      // 2. 저장된 좌표 테이블에서 찾기
      const storedCoords = getStoredCoordinates(performance.venue);
      if (storedCoords) {
        setVenueInfo({
          name: performance.venue,
          address: `서울시 ${performance.district} ${performance.venue}`,
          lat: storedCoords.lat,
          lng: storedCoords.lng,
        });
        setIsLoadingCoordinates(false);
        return;
      }

      // 3. API로 좌표 검색 (비동기)
      const address = `서울시 ${performance.district} ${performance.venue}`;
      const coords = await getVenueCoordinates(performance.venue, address, performance.district);
      
      if (coords) {
        setVenueInfo({
          name: performance.venue,
          address: address,
          lat: coords.lat,
          lng: coords.lng,
        });
      } else {
        // 4. 기본 좌표 사용
        setVenueInfo({
          name: performance.venue,
          address: address,
          lat: DEFAULT_COORDINATES.lat,
          lng: DEFAULT_COORDINATES.lng,
        });
      }

      setIsLoadingCoordinates(false);
    };

    loadCoordinates();
  }, [performance, open]);

  // 주변 지하철역 검색 (Kakao Maps Places)
  useEffect(() => {
    if (!open || !venueInfo) return;

    let cancelled = false;
    setIsLoadingSubway(true);
    setSubwayStations([]);

    loadKakaoMapSDK()
      .then(() => {
        if (cancelled) return;
        if (!window.kakao?.maps?.services?.Places) {
          throw new Error("Kakao Maps services.Places is not available");
        }

        const places = new window.kakao.maps.services.Places();
        const location = new window.kakao.maps.LatLng(venueInfo.lat, venueInfo.lng);

        places.keywordSearch(
          "지하철역",
          (data: any[], status: string) => {
            if (cancelled) return;
            if (status !== window.kakao.maps.services.Status.OK || !Array.isArray(data)) {
              setSubwayStations([]);
              setIsLoadingSubway(false);
              return;
            }

            const top = data.slice(0, 3).map((p: any) => ({
              name: String(p.place_name || ""),
              distanceM: p.distance != null ? Number(p.distance) : undefined,
            })).filter((p: any) => p.name);

            setSubwayStations(top);
            setIsLoadingSubway(false);
          },
          { location, radius: 2000, sort: window.kakao.maps.services.SortBy.DISTANCE }
        );
      })
      .catch((e) => {
        if (cancelled) return;
        console.warn("주변 지하철역 검색 실패:", e);
        setSubwayStations([]);
        setIsLoadingSubway(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, venueInfo]);

  const handleNavigate = () => {
    // 카카오맵 앱 또는 웹으로 길찾기
    const address = venueInfo?.address || `서울시 ${performance.district} ${performance.venue}`;
    const encodedAddress = encodeURIComponent(address);
    
    // 카카오맵 앱이 설치되어 있으면 앱으로, 없으면 웹으로
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedAddress}`;
    window.open(kakaoMapUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="pr-6 text-base sm:text-lg lg:text-xl dark:text-gray-100">{performance.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={performance.image}
              alt={performance.title}
              className="w-full h-full object-cover"
            />
          </div>

            <div className="flex items-center gap-2 flex-wrap">
            <Badge className="text-xs sm:text-sm dark:bg-gray-700 dark:text-gray-200">{performance.category}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm dark:border-gray-600 dark:text-gray-300">{performance.district}</Badge>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="size-3 sm:size-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500" />
              <span className="text-sm sm:text-base dark:text-gray-200">{displayRating}</span>
              <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                ({displayReviewCount}개)
              </span>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto dark:bg-gray-800">
              <TabsTrigger value="info" className="text-xs sm:text-sm py-2 dark:text-gray-300 dark:data-[state=active]:text-white">공연정보</TabsTrigger>
              <TabsTrigger value="location" className="text-xs sm:text-sm py-2 dark:text-gray-300 dark:data-[state=active]:text-white">장소/경로</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2 dark:text-gray-300 dark:data-[state=active]:text-white">리뷰</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-3 sm:space-y-4 pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 text-sm sm:text-base dark:text-gray-200">공연 설명</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                    {performance.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="mb-1 text-xs sm:text-sm dark:text-gray-200">주최</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">{performance.organizer}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs sm:text-sm dark:text-gray-200">관람료</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">{performance.price}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3 sm:size-4 text-muted-foreground dark:text-gray-400 shrink-0" />
                    <span className="text-xs sm:text-sm dark:text-gray-300">{performance.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3 sm:size-4 text-muted-foreground dark:text-gray-400 shrink-0" />
                    <span className="text-xs sm:text-sm dark:text-gray-300">{performance.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3 sm:size-4 text-muted-foreground dark:text-gray-400 shrink-0" />
                    <span className="text-xs sm:text-sm dark:text-gray-300">{performance.venue}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-3 sm:space-y-4 pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 text-sm sm:text-base dark:text-gray-200">공연장소</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">{performance.venue}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">서울시 {performance.district}</p>
                </div>

                {venueInfo && <PerformanceMap venue={venueInfo} />}
                {isLoadingCoordinates && (
                  <div className="h-40 sm:h-48 rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 text-sm" 
                    onClick={handleNavigate}
                    variant="default"
                  >
                    <Navigation className="size-4 mr-2" />
                    카카오맵 길찾기
                  </Button>
                  {venueInfo && (
                    <Button
                      className="text-sm"
                      onClick={() => {
                        // 네이버 지도 길찾기
                        const address = venueInfo.address;
                        const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
                        window.open(naverMapUrl, '_blank');
                      }}
                      variant="outline"
                    >
                      네이버 지도
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm dark:text-gray-200">교통편</h4>
                  <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>🚇 지하철:</span>
                      {isLoadingSubway ? (
                        <Skeleton className="h-4 w-32" />
                      ) : subwayStations.length > 0 ? (
                        <span>
                          {subwayStations
                            .map((s) =>
                              s.distanceM != null ? `${s.name} (${s.distanceM}m)` : s.name
                            )
                            .join(", ")}
                        </span>
                      ) : (
                        <span>가까운 역 정보를 찾지 못했어요</span>
                      )}
                    </div>
                    <p>🚌 버스: 123, 456, 789번</p>
                    <p>🚗 주차: 공연장 지하 주차장 이용 가능</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <ReviewSection performanceId={performance.id} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
