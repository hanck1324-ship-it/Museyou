import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/overlay/dialog";
import { Badge } from "../ui/data-display/badge";
import { Button } from "../ui/buttons/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/navigation/tabs";
import { MapPin, Calendar, Clock, Star, Navigation } from "lucide-react";
import { Performance } from "./PerformanceCard";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { ReviewSection } from "./ReviewSection";

interface PerformanceDetailProps {
  performance: Performance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceDetail({ performance, open, onOpenChange }: PerformanceDetailProps) {
  if (!performance) return null;

  const handleNavigate = () => {
    // 실제로는 지도 앱으로 연결
    alert(`${performance.venue}로 경로 안내를 시작합니다.`);
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
            <Badge className="text-xs sm:text-sm">{performance.category}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{performance.district}</Badge>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="size-3 sm:size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm sm:text-base">{performance.rating}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">
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
                  <h4 className="mb-1 text-sm sm:text-base">공연 설명</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {performance.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="mb-1 text-xs sm:text-sm">주최</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{performance.organizer}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs sm:text-sm">관람료</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{performance.price}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm">{performance.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm">{performance.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm">{performance.venue}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-3 sm:space-y-4 pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 text-sm sm:text-base">공연장소</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{performance.venue}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">서울시 {performance.district}</p>
                </div>

                <div className="bg-muted h-40 sm:h-48 rounded-lg flex items-center justify-center">
                  <p className="text-xs sm:text-sm text-muted-foreground px-4 text-center">지도 영역 (Google Maps API 연동)</p>
                </div>

                <Button className="w-full text-sm" onClick={handleNavigate}>
                  <Navigation className="size-4 mr-2" />
                  길찾기
                </Button>

                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm">교통편</h4>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
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
