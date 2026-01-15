import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MapPin, Calendar, Clock, Star, Navigation } from "lucide-react";
import { Performance } from "./PerformanceCard";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { ReviewSection } from "./ReviewSection";
import { PerformanceMap } from "./PerformanceMap";

interface PerformanceDetailProps {
  performance: Performance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceDetail({ performance, open, onOpenChange }: PerformanceDetailProps) {
  if (!performance) return null;

  const handleNavigate = () => {
    // 카카오맵 앱 또는 웹으로 길찾기
    const address = `서울시 ${performance.district} ${performance.venue}`;
    const encodedAddress = encodeURIComponent(address);
    
    // 카카오맵 앱이 설치되어 있으면 앱으로, 없으면 웹으로
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedAddress}`;
    window.open(kakaoMapUrl, '_blank');
  };

  // 공연장 좌표 정보 생성 (좌표가 없으면 기본값 사용)
  const venueInfo = performance.lat && performance.lng
    ? {
        name: performance.venue,
        address: `서울시 ${performance.district} ${performance.venue}`,
        lat: performance.lat,
        lng: performance.lng,
      }
    : {
        name: performance.venue,
        address: `서울시 ${performance.district} ${performance.venue}`,
        lat: 37.5665, // 서울 시청 기본 좌표
        lng: 126.9780,
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="pr-6 text-base sm:text-lg lg:text-xl">{performance.title}</DialogTitle>
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
              <span className="text-sm sm:text-base dark:text-gray-200">{performance.rating}</span>
              <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                ({performance.reviewCount}개)
              </span>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="info" className="text-xs sm:text-sm py-2">공연정보</TabsTrigger>
              <TabsTrigger value="location" className="text-xs sm:text-sm py-2">장소/경로</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2">리뷰</TabsTrigger>
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

                <PerformanceMap venue={venueInfo} />

                <Button className="w-full text-sm" onClick={handleNavigate}>
                  <Navigation className="size-4 mr-2" />
                  길찾기
                </Button>

                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm dark:text-gray-200">교통편</h4>
                  <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 space-y-1">
                    <p>🚇 지하철: 가장 가까운 역에서 도보 5분</p>
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
