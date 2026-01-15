import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Calendar, Star, Clock, Heart, Share2 } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Performance {
  id: string;
  title: string;
  category: string;
  venue: string;
  district: string;
  date: string;
  time: string;
  price: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  organizer: string;
  lat?: number;  // 위도 (선택사항)
  lng?: number;  // 경도 (선택사항)
}

interface PerformanceCardProps {
  performance: Performance;
  onViewDetails: (performance: Performance) => void;
  onDateProposal?: (performance: Performance) => void;
  isLiked?: boolean;
  onToggleLike?: (performanceId: string) => void;
  isLoggedIn?: boolean;
}

export function PerformanceCard({ 
  performance, 
  onViewDetails, 
  onDateProposal,
  isLiked = false,
  onToggleLike,
  isLoggedIn = false
}: PerformanceCardProps) {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);

  // isLiked prop이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    if (!isLoggedIn) {
      // 로그인 필요 시 부모 컴포넌트에 알림 (App.tsx에서 처리)
      return;
    }

    if (!onToggleLike) return;

    setIsLiking(true);
    try {
      // 낙관적 업데이트
      setLocalIsLiked(!localIsLiked);
      await onToggleLike(performance.id);
    } catch (error) {
      // 에러 발생 시 롤백
      setLocalIsLiked(localIsLiked);
      console.error('좋아요 처리 중 오류:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    const shareData = {
      title: performance.title,
      text: `${performance.title} - ${performance.category} 공연`,
      url: `${window.location.origin}/performance/${performance.id}`,
    };

    try {
      // Web Share API 지원 여부 확인
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('공유되었습니다!');
      } else {
        // Fallback: 클립보드에 링크 복사
        await navigator.clipboard.writeText(shareData.url);
        toast.success('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error: any) {
      // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
      if (error.name !== 'AbortError') {
        // 클립보드 복사 실패 시 fallback
        try {
          const textArea = document.createElement('textarea');
          textArea.value = shareData.url;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success('링크가 클립보드에 복사되었습니다!');
        } catch (fallbackError) {
          toast.error('공유에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-xl">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <ImageWithFallback
          src={performance.image}
          alt={performance.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* 상단 액션 버튼들 */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <div className="flex items-center gap-2">
            {/* 좋아요 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className={`size-9 rounded-full backdrop-blur-md transition-all shadow-lg ${
                localIsLiked
                  ? 'bg-red-500/95 hover:bg-red-600/95 text-white'
                  : 'bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''} ${!isLoggedIn ? 'opacity-70' : ''}`}
              onClick={handleToggleLike}
              disabled={isLiking}
              aria-label={localIsLiked ? '좋아요 취소' : '좋아요'}
              title={!isLoggedIn ? '로그인이 필요합니다' : localIsLiked ? '좋아요 취소' : '좋아요'}
            >
              <Heart 
                className={`size-4 transition-all ${
                  localIsLiked ? 'fill-current' : ''
                }`} 
              />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 카테고리 배지 */}
            <Badge className="text-xs sm:text-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-gray-100 shadow-lg border-0 font-medium px-2.5 py-1">
              {performance.category}
            </Badge>
            {/* 공유 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full backdrop-blur-md bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-lg"
              onClick={handleShare}
              aria-label="공유하기"
              title="공유하기"
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-1">
            {performance.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 px-2.5 py-1.5 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
            <Star className="size-3.5 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{performance.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 pb-4 p-4 sm:p-5 pt-0">
        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{performance.venue}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{performance.date}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{performance.time}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <Badge variant="outline" className="text-xs font-medium border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20">
            {performance.district}
          </Badge>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{performance.price}</span>
        </div>
      </CardContent>

      <CardFooter className="gap-2.5 p-4 sm:p-5 pt-0">
        <Button 
          className="flex-1 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white shadow-md hover:shadow-lg transition-all font-medium" 
          onClick={() => onViewDetails(performance)}
        >
          상세정보
        </Button>
        {onDateProposal && (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-2 border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-400 dark:hover:border-pink-600 transition-all"
            onClick={() => onDateProposal(performance)}
          >
            <Heart className="size-4 text-pink-500 dark:text-pink-400 hover:fill-pink-500 dark:hover:fill-pink-400 transition-all" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}