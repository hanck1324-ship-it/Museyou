import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Calendar, Star, Clock, Heart, Share2, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCartStore } from "../../store/useCartStore";

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
  const { addItem, isInCart, setIsOpen } = useCartStore();

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    addItem(performance);
    setIsOpen(true); // 장바구니 열기
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 hover:border-emerald-200 dark:border-gray-700 dark:hover:border-emerald-700">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <ImageWithFallback
          src={performance.image}
          alt={performance.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-12 sm:top-14 right-2 sm:right-3 text-xs sm:text-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-black dark:text-white hover:bg-white dark:hover:bg-gray-800 shadow-lg border-0">
          {performance.category}
        </Badge>
        {/* 좋아요 버튼 - 로그인 여부와 관계없이 표시 */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 sm:top-3 left-2 sm:left-3 size-8 sm:size-9 rounded-full backdrop-blur-sm transition-all ${
            localIsLiked
              ? 'bg-red-500/90 hover:bg-red-600/90 text-white'
              : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''} ${!isLoggedIn ? 'opacity-70' : ''}`}
          onClick={handleToggleLike}
          disabled={isLiking}
          aria-label={localIsLiked ? '좋아요 취소' : '좋아요'}
          title={!isLoggedIn ? '로그인이 필요합니다' : localIsLiked ? '좋아요 취소' : '좋아요'}
        >
          <Heart 
            className={`size-4 sm:size-5 transition-all ${
              localIsLiked ? 'fill-current' : ''
            }`} 
          />
        </Button>
        {/* 공유 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 sm:top-3 right-2 sm:right-3 size-8 sm:size-9 rounded-full backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-lg"
          onClick={handleShare}
          aria-label="공유하기"
          title="공유하기"
        >
          <Share2 className="size-4 sm:size-5" />
        </Button>
      </div>
      
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base sm:text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors dark:text-gray-100">{performance.title}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
            <Star className="size-3 sm:size-4 fill-yellow-400 text-yellow-400 dark:text-yellow-500" />
            <span className="text-xs sm:text-sm dark:text-gray-200">{performance.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 sm:space-y-2 pb-2 sm:pb-3 p-3 sm:p-6 pt-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors">
          <MapPin className="size-3 sm:size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <span className="truncate">{performance.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors">
          <Calendar className="size-3 sm:size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <span className="truncate">{performance.date}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors">
          <Clock className="size-3 sm:size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <span className="truncate">{performance.time}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <Badge variant="outline" className="text-xs border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">{performance.district}</Badge>
          <span className="text-xs sm:text-sm dark:text-gray-300">{performance.price}</span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-3 sm:p-6 pt-0">
        <Button 
          className="flex-1 text-xs sm:text-sm h-8 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all" 
          onClick={() => onViewDetails(performance)}
        >
          상세정보
        </Button>
        <Button
          variant={isInCart(performance.id) ? "default" : "outline"}
          size="icon"
          className={`size-8 sm:size-10 transition-all ${
            isInCart(performance.id)
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
              : 'border-2 border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-400'
          }`}
          onClick={handleAddToCart}
          title={isInCart(performance.id) ? '장바구니에 추가됨' : '장바구니에 추가'}
        >
          <ShoppingCart className={`size-3 sm:size-4 ${isInCart(performance.id) ? 'text-white' : 'text-emerald-500'}`} />
        </Button>
        {onDateProposal && (
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 size-8 sm:size-10 hover:border-pink-400 transition-all"
            onClick={() => onDateProposal(performance)}
          >
            <Heart className="size-3 sm:size-4 text-pink-500 hover:fill-pink-500 transition-all" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}  