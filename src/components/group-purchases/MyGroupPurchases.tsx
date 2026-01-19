import { useEffect, useState } from "react";
import { useGroupPurchaseStore } from "../../store/useGroupPurchaseStore";
import { GroupPurchaseCard } from "./GroupPurchaseCard";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, Package, Users } from "lucide-react";
import { GroupPurchaseDetail } from "./GroupPurchaseDetail";
import { GroupPurchaseJoin } from "./GroupPurchaseJoin";

export function MyGroupPurchases() {
  const { 
    myGroupPurchases,
    myCreatedGroupPurchases,
    isLoading,
    selectedGroupPurchase,
    fetchMyGroupPurchases,
    fetchMyCreatedGroupPurchases,
    fetchGroupPurchaseDetail,
    joinGroupPurchase,
    clearSelected
  } = useGroupPurchaseStore();

  const [detailOpen, setDetailOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"participated" | "created">("participated");

  useEffect(() => {
    if (activeTab === "participated") {
      fetchMyGroupPurchases();
    } else {
      fetchMyCreatedGroupPurchases();
    }
  }, [activeTab, fetchMyGroupPurchases, fetchMyCreatedGroupPurchases]);

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
    await fetchGroupPurchaseDetail(selectedGroupPurchase.id);
  };

  const currentList = activeTab === "participated" ? myGroupPurchases : myCreatedGroupPurchases;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          내 공동구매
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          참여한 공동구매와 생성한 공동구매를 관리하세요
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participated" className="flex items-center gap-2">
            <Package className="size-4" />
            참여한 공동구매
          </TabsTrigger>
          <TabsTrigger value="created" className="flex items-center gap-2">
            <Users className="size-4" />
            생성한 공동구매
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participated" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-purple-500" />
              <span className="ml-3 text-muted-foreground">로딩 중...</span>
            </div>
          ) : myGroupPurchases.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Package className="size-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">참여한 공동구매가 없습니다</p>
              <p className="text-sm text-muted-foreground">공동구매에 참여해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {myGroupPurchases.map((groupPurchase) => (
                <GroupPurchaseCard
                  key={groupPurchase.id}
                  groupPurchase={groupPurchase}
                  onViewDetail={handleViewDetail}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="created" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-purple-500" />
              <span className="ml-3 text-muted-foreground">로딩 중...</span>
            </div>
          ) : myCreatedGroupPurchases.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Users className="size-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">생성한 공동구매가 없습니다</p>
              <p className="text-sm text-muted-foreground">새로운 공동구매를 만들어보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {myCreatedGroupPurchases.map((groupPurchase) => (
                <GroupPurchaseCard
                  key={groupPurchase.id}
                  groupPurchase={groupPurchase}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          )}
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
    </div>
  );
}
