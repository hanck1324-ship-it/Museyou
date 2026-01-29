import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

/**
 * GroupPurchaseDetail의 로딩 스켈레톤 컴포넌트
 */
export function GroupPurchaseDetailSkeleton() {
  return (
    <Dialog open={true}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </DialogHeader>

        {/* 이미지 영역 */}
        <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
          {/* 상태 배지 */}
          <Skeleton className="absolute top-4 left-4 w-20 h-6 rounded-full" />
          {/* 할인율 배지 */}
          <Skeleton className="absolute top-4 right-4 w-16 h-6 rounded-full" />
        </div>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* 진행률 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* 가격 정보 */}
          <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
        </div>

        {/* 탭 */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger value="info" disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="participants" disabled>
              <Skeleton className="h-4 w-20" />
            </TabsTrigger>
            <TabsTrigger value="details" disabled>
              <Skeleton className="h-4 w-12" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
