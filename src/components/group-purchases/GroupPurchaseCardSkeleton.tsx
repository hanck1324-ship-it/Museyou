import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * GroupPurchaseCard의 로딩 스켈레톤 컴포넌트
 */
export function GroupPurchaseCardSkeleton() {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700">
      {/* 이미지 영역 */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <Skeleton className="w-full h-full" />
        {/* 상태 배지 */}
        <Skeleton className="absolute top-2 sm:top-3 left-2 sm:left-3 w-16 h-6 sm:w-20 sm:h-7 rounded-full" />
        {/* 할인율 배지 */}
        <Skeleton className="absolute top-2 sm:top-3 right-2 sm:right-3 w-12 h-6 sm:w-16 sm:h-7 rounded-full" />
      </div>

      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        {/* 제목 */}
        <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
        {/* 장소 */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-2 sm:pb-3 p-3 sm:p-6 pt-0">
        {/* 진행률 바 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* 가격 정보 */}
        <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
          <div className="space-y-1">
            {/* 원가 */}
            <Skeleton className="h-3 w-24" />
            {/* 할인가 */}
            <Skeleton className="h-5 w-32" />
          </div>
          {/* 할인율 */}
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-3 sm:p-6 pt-0">
        {/* 상세보기 버튼 */}
        <Skeleton className="flex-1 h-8 sm:h-10 rounded-md" />
        {/* 공유 버튼 */}
        <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-md" />
        {/* 참여 버튼 */}
        <Skeleton className="flex-1 h-8 sm:h-10 rounded-md" />
      </CardFooter>
    </Card>
  );
}
