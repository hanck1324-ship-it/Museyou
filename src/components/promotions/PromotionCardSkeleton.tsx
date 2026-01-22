import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * PromotionCard의 로딩 스켈레톤 컴포넌트
 */
export function PromotionCardSkeleton() {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700">
      {/* 이미지 영역 */}
      <div className="relative h-36 sm:h-40 overflow-hidden">
        <Skeleton className="w-full h-full" />
        {/* 지역 배지 */}
        <Skeleton className="absolute top-2 sm:top-3 left-2 sm:left-3 w-16 h-5 sm:w-20 sm:h-6 rounded-full" />
      </div>

      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          {/* 제목 */}
          <Skeleton className="h-5 sm:h-6 w-3/4" />
          {/* 카테고리 배지 */}
          <Skeleton className="h-5 w-16 sm:w-20 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
        {/* 설명 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* 장소 및 날짜 */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* 주최자 */}
        <Skeleton className="h-4 w-1/3 pt-2" />
      </CardContent>
    </Card>
  );
}
