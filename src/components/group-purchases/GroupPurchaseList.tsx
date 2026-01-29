import { useEffect } from "react";
import { useGroupPurchaseStore } from "../../store/useGroupPurchaseStore";
import { GroupPurchaseCard } from "./GroupPurchaseCard";
import { GroupPurchaseCardSkeleton } from "./GroupPurchaseCardSkeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/forms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/forms/select";
import { Plus, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { GroupPurchaseDetail } from "./GroupPurchaseDetail";
import { GroupPurchaseJoin } from "./GroupPurchaseJoin";
import { GroupPurchaseCreate } from "./GroupPurchaseCreate";
import { useState, useMemo } from "react";
import { useInfiniteScroll } from "../../lib/hooks/useInfiniteScroll";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GroupPurchaseStatus as StatusType } from "../../lib/types/groupPurchase";
import { MyGroupPurchases } from "./MyGroupPurchases";
import { useGroupPurchaseListRealtime } from "../../lib/hooks/useGroupPurchaseRealtime";
import { GroupPurchaseStats } from "./GroupPurchaseStats";

interface GroupPurchaseListProps {
  onCreateClick?: () => void; // deprecated, 내부에서 처리
}

export function GroupPurchaseList({ onCreateClick }: GroupPurchaseListProps) {
  const { 
    groupPurchases, 
    isLoading, 
    error,
    filters,
    sortBy,
    selectedGroupPurchase,
    fetchGroupPurchases,
    fetchGroupPurchaseDetail,
    joinGroupPurchase,
    updateFilters,
    setSortBy,
    clearSelected
  } = useGroupPurchaseStore();

  const [detailOpen, setDetailOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // 무한 스크롤 상태
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 12;

  // 실시간 목록 업데이트 구독
  useGroupPurchaseListRealtime();

  // 필터/정렬 변경 시 목록 새로고침 및 페이지 리셋
  useEffect(() => {
    fetchGroupPurchases();
    setPage(1);
  }, [fetchGroupPurchases, filters, sortBy]);

  // 검색어 변경 시 필터 업데이트
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters({ searchQuery: searchQuery.trim() || undefined });
    }, 300); // 디바운스

    return () => clearTimeout(timeoutId);
  }, [searchQuery, updateFilters]);

  const districts = [
    "all",
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구"
  ];

  const categories = ["all", "클래식", "연극", "뮤지컬", "무용", "전통예술", "전시"];

  const statusOptions: { value: StatusType | "all"; label: string }[] = [
    { value: "all", label: "전체 상태" },
    { value: "recruiting", label: "모집중" },
    { value: "in_progress", label: "진행중" },
    { value: "completed", label: "목표달성" },
    { value: "closed", label: "마감" },
  ];

  const sortOptions: { value: typeof sortBy; label: string }[] = [
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
    { value: "newest", label: "최신순" },
    { value: "discount", label: "할인율순" },
  ];

  const hasActiveFilters = 
    filters.category || 
    filters.district || 
    filters.status || 
    filters.minDiscountRate ||
    searchQuery.trim();

  const handleClearFilters = () => {
    setSearchQuery("");
    updateFilters({});
    setSortBy("popular");
  };

  const handleViewDetail = async (id: string) => {
    await fetchGroupPurchaseDetail(id);
    setDetailOpen(true);
  };

  const handleJoin = async (id: string) => {
    await fetchGroupPurchaseDetail(id);
    setJoinOpen(true);
  };

  const handleJoinSubmit = async (participantCount: number, message?: string) => {
    if (!selectedGroupPurchase) return;
    await joinGroupPurchase(selectedGroupPurchase.id, {
      participantCount,
      message
    });
    setJoinOpen(false);
    // 상세 정보 새로고침
    await fetchGroupPurchaseDetail(selectedGroupPurchase.id);
  };

  // 필터링된 목록에서 현재 페이지까지의 항목만 표시
  const displayedGroupPurchases = useMemo(() => {
    return groupPurchases.slice(0, page * ITEMS_PER_PAGE);
  }, [groupPurchases, page]);

  const hasMore = displayedGroupPurchases.length < groupPurchases.length;

  // 무한 스크롤: 더 많은 공동구매 로드
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    // 다음 페이지 로드 (실제로는 이미 필터링된 데이터에서 슬라이스만 하므로 즉시 완료)
    await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 효과를 위한 딜레이
    setPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  // 무한 스크롤 훅
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              문화 공동구매
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              함께 참여하면 더 저렴하게 공연을 관람할 수 있어요
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <GroupPurchaseCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => fetchGroupPurchases()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              문화 공동구매
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              함께 참여하면 더 저렴하게 공연을 관람할 수 있어요
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="size-4 mr-2" />
            공동구매 만들기
          </Button>
        </div>

        <TabsList className="grid w-full grid-cols-2 mb-4 dark:bg-gray-800">
          <TabsTrigger value="all" className="dark:text-gray-300 dark:data-[state=active]:text-white">전체 공동구매</TabsTrigger>
          <TabsTrigger value="my" className="dark:text-gray-300 dark:data-[state=active]:text-white">내 공동구매</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* 통계 */}
          <GroupPurchaseStats groupPurchases={groupPurchases} />
          
          {/* 필터 및 검색 */}
          <div className="space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground dark:text-gray-400" />
          <Input
            placeholder="공연명, 장소 검색..."
            className="pl-10 border-purple-200 dark:border-purple-800 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 모바일 필터 버튼 */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="sm:hidden border-purple-200 dark:border-purple-800 dark:border-purple-800">
                <SlidersHorizontal className="size-4 mr-2" />
                필터
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] dark:bg-gray-900 dark:border-gray-700">
              <SheetHeader>
                <SheetTitle className="dark:text-gray-100">필터</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm mb-2 block dark:text-gray-300">카테고리</label>
                  <Select 
                    value={filters.category || "all"} 
                    onValueChange={(value) => updateFilters({ category: value === "all" ? undefined : value })}
                  >
                    <SelectTrigger className="border-purple-200 dark:border-purple-800 dark:border-purple-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "전체 카테고리" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-2 block dark:text-gray-300">지역</label>
                  <Select 
                    value={filters.district || "all"} 
                    onValueChange={(value) => updateFilters({ district: value === "all" ? undefined : value })}
                  >
                    <SelectTrigger className="border-purple-200 dark:border-purple-800 dark:border-purple-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district === "all" ? "전체 지역" : district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-2 block">상태</label>
                  <Select 
                    value={filters.status || "all"} 
                    onValueChange={(value) => updateFilters({ status: value === "all" ? undefined : value as StatusType })}
                  >
                    <SelectTrigger className="border-purple-200 dark:border-purple-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-2 block">최소 할인율</label>
                  <Select 
                    value={filters.minDiscountRate?.toString() || "all"} 
                    onValueChange={(value) => updateFilters({ minDiscountRate: value === "all" ? undefined : parseInt(value) })}
                  >
                    <SelectTrigger className="border-purple-200 dark:border-purple-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="5">5% 이상</SelectItem>
                      <SelectItem value="10">10% 이상</SelectItem>
                      <SelectItem value="15">15% 이상</SelectItem>
                      <SelectItem value="20">20% 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => setFiltersOpen(false)}
                >
                  적용
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* 데스크톱 필터 */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap flex-1">
            <Select 
              value={filters.category || "all"} 
              onValueChange={(value) => updateFilters({ category: value === "all" ? undefined : value })}
            >
              <SelectTrigger className="w-[140px] border-purple-200 dark:border-purple-800">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "전체 카테고리" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.district || "all"} 
              onValueChange={(value) => updateFilters({ district: value === "all" ? undefined : value })}
            >
              <SelectTrigger className="w-[140px] border-purple-200 dark:border-purple-800">
                <SelectValue placeholder="지역" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district === "all" ? "전체 지역" : district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.status || "all"} 
              onValueChange={(value) => updateFilters({ status: value === "all" ? undefined : value as StatusType })}
            >
              <SelectTrigger className="w-[140px] border-purple-200 dark:border-purple-800">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.minDiscountRate?.toString() || "all"} 
              onValueChange={(value) => updateFilters({ minDiscountRate: value === "all" ? undefined : parseInt(value) })}
            >
              <SelectTrigger className="w-[140px] border-purple-200 dark:border-purple-800">
                <SelectValue placeholder="할인율" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="5">5% 이상</SelectItem>
                <SelectItem value="10">10% 이상</SelectItem>
                <SelectItem value="15">15% 이상</SelectItem>
                <SelectItem value="20">20% 이상</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[140px] border-purple-200 dark:border-purple-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 필터 초기화 */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <X className="size-4 mr-1" />
              초기화
            </Button>
            )}
          </div>

          {/* 목록 */}
          {groupPurchases.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground dark:text-gray-400 mb-4">아직 생성된 공동구매가 없습니다.</p>
          <Button onClick={() => setCreateOpen(true)} variant="outline">
            첫 공동구매 만들기
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {displayedGroupPurchases.map((groupPurchase) => (
              <GroupPurchaseCard
                key={groupPurchase.id}
                groupPurchase={groupPurchase}
                onViewDetail={handleViewDetail}
                onJoin={handleJoin}
              />
            ))}
          </div>

          {/* 무한 스크롤 로딩 인디케이터 */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex items-center justify-center py-8">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <Loader2 className="size-5 animate-spin" />
                  <span>더 많은 공동구매를 불러오는 중...</span>
                </div>
              )}
            </div>
          )}

          {/* 더 이상 데이터가 없을 때 */}
          {!hasMore && displayedGroupPurchases.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                모든 공동구매를 불러왔습니다
              </p>
            </div>
          )}
        </>
      )}
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          <MyGroupPurchases />
        </TabsContent>
      </Tabs>

      {/* 상세 다이얼로그 */}
      {selectedGroupPurchase && (
        <>
          <GroupPurchaseDetail
            groupPurchase={selectedGroupPurchase}
            open={detailOpen}
            onOpenChange={(open) => {
              setDetailOpen(open);
              if (!open) {
                clearSelected();
              }
            }}
            onJoin={() => {
              setDetailOpen(false);
              setJoinOpen(true);
            }}
          />
          <GroupPurchaseJoin
            groupPurchase={selectedGroupPurchase}
            open={joinOpen}
            onOpenChange={(open) => {
              setJoinOpen(open);
              if (!open && !detailOpen) {
                clearSelected();
              }
            }}
            onJoin={handleJoinSubmit}
          />
        </>
      )}

      {/* 생성 다이얼로그 */}
      <GroupPurchaseCreate
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            // 생성 후 목록 새로고침
            fetchGroupPurchases();
          }
        }}
      />
    </div>
  );
}
