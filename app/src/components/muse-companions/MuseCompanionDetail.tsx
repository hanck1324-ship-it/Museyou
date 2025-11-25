import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/overlay/dialog";
import { Badge } from "../ui/data-display/badge";
import { Button } from "../ui/buttons/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/navigation/tabs";
import { MapPin, Heart, Star, Navigation, Users, Clock, Gift, Calendar, Cloud, Music, MapPinned, UtensilsCrossed, ExternalLink } from "lucide-react";
import { MuseCompanion } from "./MuseCompanionCard";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

interface MuseCompanionDetailProps {
  spot: MuseCompanion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MuseCompanionDetail({ spot, open, onOpenChange }: MuseCompanionDetailProps) {
  if (!spot) return null;

  const handleNavigate = () => {
    // Open Kakao Map with destination
    const destination = encodeURIComponent(spot.address || spot.location);
    const kakaoMapUrl = `https://map.kakao.com/link/to/${destination},${spot.coordinates?.lat || ''},${spot.coordinates?.lng || ''}`;
    window.open(kakaoMapUrl, '_blank');
  };

  const handleNaverMap = () => {
    // Open Naver Map with destination
    const destination = encodeURIComponent(spot.address || spot.location);
    const naverMapUrl = `https://map.naver.com/v5/search/${destination}`;
    window.open(naverMapUrl, '_blank');
  };

  const handleBookmark = () => {
    alert("❤️ 찜 목록에 추가되었습니다!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-6 flex items-center gap-2">
            <span>{spot.title}</span>
            <Badge className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-400 text-white border-0">
              <Users className="size-3 mr-1" />
              Muse 동행자
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {spot.district} · {spot.category} · {spot.atmosphere}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={spot.image}
              alt={spot.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{spot.category}</Badge>
            <Badge variant="secondary">{spot.atmosphere}</Badge>
            <div className="flex items-center gap-1 ml-auto">
              <Heart className="size-4 fill-pink-400 text-pink-400" />
              <span>{spot.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({spot.reviewCount}개 리뷰)
              </span>
            </div>
          </div>

          {spot.companionBenefit && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <Gift className="size-4 text-red-600" />
                <p className="text-sm">
                  <span className="font-medium text-red-600">동행자 혜택</span> {spot.companionBenefit}
                </p>
              </div>
            </div>
          )}

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">상세정보</TabsTrigger>
              <TabsTrigger value="course">동행 코스</TabsTrigger>
              <TabsTrigger value="nearby">주변 맛집</TabsTrigger>
              <TabsTrigger value="tips">팁 & 후기</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1">소개</h4>
                  <p className="text-sm text-muted-foreground">
                    {spot.description}
                  </p>
                </div>

                {/* Enhanced Date and Weather Info */}
                {spot.recommendedDate && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-purple-600" />
                        <span className="text-sm">
                          <span className="font-medium">추천 날짜:</span> {spot.recommendedDate}
                        </span>
                      </div>
                      {spot.weather && (
                        <div className="flex items-center gap-2">
                          <Cloud className="size-4 text-purple-600" />
                          <span className="text-sm">
                            <span className="font-medium">날씨:</span> {spot.weather.icon} {spot.weather.condition}, {spot.weather.temperature}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="mb-1 text-sm">분위기</h4>
                    <p className="text-sm text-muted-foreground">{spot.atmosphere}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm">가격대</h4>
                    <p className="text-sm text-muted-foreground">{spot.priceRange}</p>
                  </div>
                </div>

                {/* Performance Info */}
                {spot.performanceAvailable !== undefined && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Music className="size-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">공연 여부:</span> {spot.performanceAvailable ? '있음' : '없음'}
                        </p>
                        {spot.performanceInfo && (
                          <p className="text-xs text-muted-foreground mt-1">{spot.performanceInfo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-sm">{spot.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{spot.district}</Badge>
                  </div>
                </div>

                {/* Nearby Attractions */}
                {spot.nearbyAttractions && spot.nearbyAttractions.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm flex items-center gap-2">
                      <MapPinned className="size-4" />
                      근처 명소
                    </h4>
                    <div className="space-y-1">
                      {spot.nearbyAttractions.map((attraction, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-purple-600">•</span>
                          <span>{attraction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Features */}
                {spot.specialFeatures && spot.specialFeatures.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm">✨ 특별한 혜택</h4>
                    <div className="space-y-1">
                      {spot.specialFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-pink-600">♥</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-sm">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {spot.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="course" className="space-y-4">
              <div className="space-y-3">
                <h4>추천 동행 코스</h4>
                
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-full size-6 flex items-center justify-center shrink-0 text-sm">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <Clock className="size-3 inline mr-1" />
                          오후 2시 - 공연/전시 관람
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {spot.title}에서 문화생활 즐기기
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-full size-6 flex items-center justify-center shrink-0 text-sm">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <Clock className="size-3 inline mr-1" />
                          오후 5시 - 주변 카페 또는 레스토랑
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          관람 후 감상을 나누며 차 한잔
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full size-6 flex items-center justify-center shrink-0 text-sm">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <Clock className="size-3 inline mr-1" />
                          오후 7시 - 저녁 식사
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          근처 맛집에서 로맨틱한 저녁 시간
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-muted-foreground">
                    💡 주변에 산책하기 좋은 공원과 포토존이 많아 동행 코스로 완벽해요!
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nearby" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2">
                    <UtensilsCrossed className="size-4" />
                    주변 추천 맛집
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const query = encodeURIComponent(`${spot.location} 맛집`);
                      window.open(`https://map.kakao.com/link/search/${query}`, '_blank');
                    }}
                  >
                    <ExternalLink className="size-3 mr-1" />
                    더보기
                  </Button>
                </div>

                {spot.nearbyRestaurants && spot.nearbyRestaurants.length > 0 ? (
                  <div className="space-y-2">
                    {spot.nearbyRestaurants.map((restaurant, idx) => (
                      <div 
                        key={idx} 
                        className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                        onClick={() => {
                          const query = encodeURIComponent(restaurant.name);
                          window.open(`https://map.kakao.com/link/search/${query}`, '_blank');
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{restaurant.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {restaurant.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="size-3" />
                                {restaurant.distance}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                {restaurant.rating}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="size-4 text-muted-foreground shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="size-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      주변 맛집 정보를 카카오맵에서 확인하세요
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const query = encodeURIComponent(`${spot.location} 맛집`);
                        window.open(`https://map.kakao.com/link/search/${query}`, '_blank');
                      }}
                    >
                      <ExternalLink className="size-4 mr-2" />
                      카카오맵에서 보기
                    </Button>
                  </div>
                )}

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-muted-foreground">
                    💡 <span className="font-medium">TIP:</span> 맛집 클릭 시 카카오맵에서 상세 정보와 리뷰를 확인할 수 있어요!
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="space-y-3">
                <h4>동행 팁</h4>
                
                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">💕 포토존:</span> 입구와 3층 테라스가 인생샷 명소예요
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">⏰ 추천 시간:</span> 평일 오후가 한적하고 좋아요
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">🎫 예약:</span> 주말은 사전 예약 필수!
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">🍽️ 주변 맛집:</span> 도보 5분 거리에 많은 사람들이 가는 레스토랑이 있어요
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <h4 className="mb-2 text-sm">이용자들의 한줄평</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground italic">
                      "분위기 정말 로맨틱해요! 기념일 동행로 완벽했습니다 ❤️"
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      "조용하고 아늑해서 대화하기 좋았어요"
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleNavigate} className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FEE500'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'/%3E%3C/svg%3E" alt="Kakao" className="size-4 mr-2" />
                카카오맵
              </Button>
              <Button variant="outline" onClick={handleNaverMap} className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:bg-green-100">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2303C75A'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'/%3E%3C/svg%3E" alt="Naver" className="size-4 mr-2" />
                네이버맵
              </Button>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-400 hover:opacity-90"
              onClick={handleBookmark}
            >
              <Heart className="size-4 mr-2" />
              찜하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
