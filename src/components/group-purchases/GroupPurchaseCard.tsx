import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, Users, Percent, MapPin, Share2 } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { GroupPurchase } from "../../lib/types/groupPurchase";
import { GroupPurchaseProgress } from "./GroupPurchaseProgress";
import { GroupPurchaseStatus } from "./GroupPurchaseStatus";
import { shareContent } from "../../lib/utils/share";
import { memo, useCallback } from "react";
// 날짜 포맷팅 헬퍼 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

interface GroupPurchaseCardProps {
  groupPurchase: GroupPurchase;
  onViewDetail: (id: string) => void;
  onJoin?: (id: string) => void;
}

export const GroupPurchaseCard = memo(function GroupPurchaseCard({ 
  groupPurchase, 
  onViewDetail,
  onJoin 
}: GroupPurchaseCardProps) {
  const canJoin = groupPurchase.status === 'recruiting';
  const deadlineDate = new Date(groupPurchase.deadline);
  const isDeadlineNear = deadlineDate.getTime() - Date.now() < 24 * 60 * 60 * 1000; // 24시간 이내

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/group-purchases/${groupPurchase.id}`;
    await shareContent({
      title: `${groupPurchase.performance.title} 공동구매`,
      text: `${groupPurchase.discountRate}% 할인! ${groupPurchase.currentParticipants}/${groupPurchase.targetParticipants}명 참여 중`,
      url: shareUrl,
    });
  }, [groupPurchase.id, groupPurchase.performance.title, groupPurchase.discountRate, groupPurchase.currentParticipants, groupPurchase.targetParticipants]);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 hover:border-purple-200 dark:border-gray-700 dark:hover:border-purple-700">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <ImageWithFallback
          src={groupPurchase.performance.image}
          alt={groupPurchase.performance.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 상태 배지 */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <GroupPurchaseStatus status={groupPurchase.status} />
        </div>

        {/* 할인율 배지 */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
          {groupPurchase.discountRate}% 할인
        </div>
      </div>

      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <h3 className="line-clamp-2 text-base sm:text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors dark:text-gray-100 font-semibold">
          {groupPurchase.performance.title}
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1">
          <MapPin className="size-3 sm:size-4 shrink-0" />
          <span className="truncate">{groupPurchase.performance.venue}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-2 sm:pb-3 p-3 sm:p-6 pt-0">
        {/* 진행률 */}
        <GroupPurchaseProgress 
          current={groupPurchase.currentParticipants}
          target={groupPurchase.targetParticipants}
          size="sm"
        />

        {/* 가격 정보 */}
        <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground line-through">
              {formatPrice(groupPurchase.originalPrice)}
            </div>
            <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
              {formatPrice(groupPurchase.discountedPrice)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Percent className="size-3 sm:size-4 text-emerald-500" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {groupPurchase.discountRate}% 절약
            </span>
          </div>
        </div>

        {/* 마감일 */}
        <div className={`flex items-center gap-2 text-xs sm:text-sm ${
          isDeadlineNear 
            ? 'text-red-600 dark:text-red-400 font-medium' 
            : 'text-muted-foreground dark:text-gray-400'
        }`}>
          <Calendar className="size-3 sm:size-4 shrink-0" />
          <span>
            마감: {formatDate(deadlineDate)}
            {isDeadlineNear && ' (임박!)'}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-3 sm:p-6 pt-0">
        <Button 
          className="flex-1 text-xs sm:text-sm h-8 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all" 
          onClick={() => onViewDetail(groupPurchase.id)}
        >
          상세보기
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 sm:size-10 border-2 border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-400 transition-all"
          onClick={handleShare}
          title="공유하기"
        >
          <Share2 className="size-3 sm:size-4 text-blue-500" />
        </Button>
        {canJoin && onJoin && (
          <Button
            variant="outline"
            className="text-xs sm:text-sm h-8 sm:h-10 border-2 border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-400 transition-all"
            onClick={() => onJoin(groupPurchase.id)}
          >
            <Users className="size-3 sm:size-4 mr-1" />
            참여
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
