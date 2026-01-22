import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * MatchingCard의 로딩 스켈레톤 컴포넌트
 */
export function MatchingCardSkeleton() {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700">
      <div className="relative">
        {/* 프로필 이미지 영역 */}
        <div className="h-56 sm:h-64 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        
        {/* 매칭률 배지 */}
        <Skeleton className="absolute top-2 sm:top-3 right-2 sm:right-3 w-16 h-6 sm:w-20 sm:h-7 rounded-full" />
      </div>

      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* 이름 및 나이 */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24 sm:w-32" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>

          {/* 자기소개 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* 관심사 태그 */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-18 rounded-full" />
          </div>

          {/* 공연 정보 */}
          <div className="pt-2 border-t dark:border-gray-700 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-4 sm:p-6 pt-0">
        {/* 프로필 보기 버튼 */}
        <Skeleton className="flex-1 h-10 rounded-md" />
        {/* 좋아요 버튼 */}
        <Skeleton className="w-10 h-10 rounded-md" />
        {/* 메시지 버튼 */}
        <Skeleton className="w-10 h-10 rounded-md" />
      </CardFooter>
    </Card>
  );
}
