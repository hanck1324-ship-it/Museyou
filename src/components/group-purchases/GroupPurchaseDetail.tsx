import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Calendar, MapPin, Clock, Percent, Users, User, X } from "lucide-react";
import { GroupPurchase } from "../../lib/types/groupPurchase";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { GroupPurchaseProgress } from "./GroupPurchaseProgress";
import { GroupPurchaseStatus } from "./GroupPurchaseStatus";
import { GroupPurchaseParticipants } from "./GroupPurchaseParticipants";
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";
import { useGroupPurchaseStore } from "../../store/useGroupPurchaseStore";
import { STORAGE_KEYS } from "../../lib/api/mockData";
import { GroupPurchaseEdit } from "./GroupPurchaseEdit";
import { Edit, Trash2 } from "lucide-react";
import { useGroupPurchaseRealtime } from "../../lib/hooks/useGroupPurchaseRealtime";

// 로컬 스토리지 헬퍼
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

interface GroupPurchaseDetailProps {
  groupPurchase: GroupPurchase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin?: () => void;
}

export function GroupPurchaseDetail({ 
  groupPurchase, 
  open, 
  onOpenChange,
  onJoin 
}: GroupPurchaseDetailProps) {
  const { cancelJoin, fetchGroupPurchaseDetail, deleteGroupPurchase } = useGroupPurchaseStore();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canJoin = groupPurchase.status === 'recruiting';
  const deadlineDate = new Date(groupPurchase.deadline);
  const isDeadlineNear = deadlineDate.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  // 실시간 업데이트 구독
  useGroupPurchaseRealtime(open && groupPurchase ? groupPurchase.id : null);

  // 현재 사용자가 참여 중인지, 생성자인지 확인
  useEffect(() => {
    if (open && groupPurchase) {
      const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (currentUser) {
        const participating = groupPurchase.participants.some(
          p => p.userId === currentUser.id
        );
        setIsParticipating(participating);
        setIsCreator(groupPurchase.creatorId === currentUser.id);
      } else {
        setIsParticipating(false);
        setIsCreator(false);
      }
    }
  }, [open, groupPurchase]);

  const handleCancelJoin = async () => {
    setIsCancelling(true);
    try {
      await cancelJoin(groupPurchase.id);
      await fetchGroupPurchaseDetail(groupPurchase.id);
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('참여 취소 실패:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGroupPurchase(groupPurchase.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{groupPurchase.performance.title}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <GroupPurchaseStatus status={groupPurchase.status} />
                <Badge variant="outline">{groupPurchase.performance.category}</Badge>
                <Badge variant="outline">{groupPurchase.performance.district}</Badge>
              </div>
            </div>
            {isCreator && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditOpen(true)}
                  className="size-8"
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="size-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={groupPurchase.currentParticipants > 0}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* 공연 이미지 */}
          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={groupPurchase.performance.image}
              alt={groupPurchase.performance.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {groupPurchase.discountRate}% 할인
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">공동구매 정보</TabsTrigger>
              <TabsTrigger value="performance">공연 정보</TabsTrigger>
              <TabsTrigger value="participants">참여자</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 pt-4">
              {/* 진행률 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <GroupPurchaseProgress 
                  current={groupPurchase.currentParticipants}
                  target={groupPurchase.targetParticipants}
                  size="lg"
                />
              </div>

              {/* 가격 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">원가</div>
                  <div className="text-lg line-through">{formatPrice(groupPurchase.originalPrice)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-sm text-muted-foreground mb-1">할인가</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatPrice(groupPurchase.discountedPrice)}
                  </div>
                </div>
              </div>

              {/* 공동구매 정보 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">목표 인원:</span> {groupPurchase.targetParticipants}명
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">현재 참여:</span> {groupPurchase.currentParticipants}명
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">할인율:</span> {groupPurchase.discountRate}%
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${isDeadlineNear ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">마감일:</span> {formatDate(deadlineDate)}
                    {isDeadlineNear && ' (임박!)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">생성자:</span> {groupPurchase.creator.name}
                  </span>
                </div>
              </div>

              {groupPurchase.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">공동구매 설명</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {groupPurchase.description}
                    </p>
                  </div>
                </>
              )}

              {/* 참여/취소 버튼 */}
              {isParticipating ? (
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <X className="size-4 mr-2" />
                  참여 취소하기
                </Button>
              ) : canJoin && onJoin ? (
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={onJoin}
                >
                  <Users className="size-4 mr-2" />
                  공동구매 참여하기
                </Button>
              ) : null}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">공연 설명</h4>
                  <p className="text-sm text-muted-foreground">
                    {groupPurchase.performance.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="mb-1 text-sm font-medium">주최</h4>
                    <p className="text-sm text-muted-foreground">{groupPurchase.performance.organizer}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">가격</h4>
                    <p className="text-sm text-muted-foreground">{groupPurchase.performance.price}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{groupPurchase.performance.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{groupPurchase.performance.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{groupPurchase.performance.venue}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="pt-4">
              <GroupPurchaseParticipants 
                participants={groupPurchase.participants}
                showCount={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* 참여 취소 확인 다이얼로그 */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>참여 취소 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 공동구매 참여를 취소하시겠습니까? 
              취소하시면 할인 혜택을 받을 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>돌아가기</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelJoin}
              disabled={isCancelling}
              className="bg-red-500 hover:bg-red-600"
            >
              {isCancelling ? '취소 중...' : '참여 취소'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공동구매 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 공동구매를 삭제하시겠습니까?
              {groupPurchase.currentParticipants > 0 && (
                <span className="block mt-2 text-red-500 font-medium">
                  참여자가 있는 공동구매는 삭제할 수 없습니다.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || groupPurchase.currentParticipants > 0}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 수정 다이얼로그 */}
      <GroupPurchaseEdit
        groupPurchase={groupPurchase}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            // 수정 후 상세 정보 새로고침
            fetchGroupPurchaseDetail(groupPurchase.id);
          }
        }}
      />
    </Dialog>
  );
}
