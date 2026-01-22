import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * PerformanceCard의 로딩 스켈레톤 컴포넌트
 */
export function PerformanceCardSkeleton() {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700">
      {/* 이미지 영역 */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <Skeleton className="w-full h-full" />
        {/* 카테고리 배지 */}
        <Skeleton className="absolute top-12 sm:top-14 right-2 sm:right-3 w-16 h-5 sm:w-20 sm:h-6 rounded-full" />
        {/* 좋아요 버튼 */}
        <Skeleton className="absolute top-2 sm:top-3 left-2 sm:left-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full" />
        {/* 공유 버튼 */}
        <Skeleton className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full" />
      </div>

      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          {/* 제목 */}
          <Skeleton className="h-5 sm:h-6 w-3/4" />
          {/* 평점 */}
          <Skeleton className="h-6 w-12 sm:w-16 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 sm:space-y-2 pb-2 sm:pb-3 p-3 sm:p-6 pt-0">
        {/* 장소 */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* 날짜 */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        {/* 시간 */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        {/* 지역 및 가격 */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-3 sm:p-6 pt-0">
        {/* 상세정보 버튼 */}
        <Skeleton className="flex-1 h-8 sm:h-10 rounded-md" />
        {/* 장바구니 버튼 */}
        <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-md" />
      </CardFooter>
    </Card>
  );
}
