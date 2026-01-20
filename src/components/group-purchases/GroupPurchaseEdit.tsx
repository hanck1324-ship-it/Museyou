import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/forms/input";
import { Label } from "../ui/forms/label";
import { Textarea } from "../ui/forms/textarea";
import { Percent, CalendarDays, Users, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { GroupPurchase } from "../../lib/types/groupPurchase";
import { useGroupPurchaseStore } from "../../store/useGroupPurchaseStore";

interface GroupPurchaseEditProps {
  groupPurchase: GroupPurchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupPurchaseEdit({ groupPurchase, open, onOpenChange }: GroupPurchaseEditProps) {
  const { updateGroupPurchase } = useGroupPurchaseStore();
  
  const [targetParticipants, setTargetParticipants] = useState<number>(10);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 공동구매 데이터로 폼 초기화
  useEffect(() => {
    if (groupPurchase && open) {
      setTargetParticipants(groupPurchase.targetParticipants);
      setDiscountRate(groupPurchase.discountRate);
      const deadlineDate = new Date(groupPurchase.deadline);
      const year = deadlineDate.getFullYear();
      const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
      const day = String(deadlineDate.getDate()).padStart(2, '0');
      const hours = String(deadlineDate.getHours()).padStart(2, '0');
      const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
      setDeadline(`${year}-${month}-${day}T${hours}:${minutes}`);
      setDescription(groupPurchase.description || "");
    }
  }, [groupPurchase, open]);

  if (!groupPurchase) return null;

  // 할인가 계산
  const discountedPrice = Math.floor(groupPurchase.originalPrice * (1 - discountRate / 100));
  const savings = groupPurchase.originalPrice - discountedPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handleSubmit = async () => {
    // 검증
    if (targetParticipants < 2) {
      alert('목표 인원은 최소 2명 이상이어야 합니다.');
      return;
    }
    if (targetParticipants < groupPurchase.currentParticipants) {
      alert(`목표 인원은 현재 참여 인원(${groupPurchase.currentParticipants}명) 이상이어야 합니다.`);
      return;
    }
    if (discountRate < 1 || discountRate > 50) {
      alert('할인율은 1% 이상 50% 이하여야 합니다.');
      return;
    }
    if (!deadline) {
      alert('마감일을 설정해주세요.');
      return;
    }
    
    const deadlineDate = new Date(deadline);
    if (deadlineDate.getTime() <= Date.now()) {
      alert('마감일은 현재 시간 이후로 설정해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateGroupPurchase(groupPurchase.id, {
        targetParticipants,
        discountRate,
        deadline: deadlineDate.toISOString(),
        description: description.trim() || undefined,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('공동구매 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            공동구매 수정
          </DialogTitle>
          <DialogDescription>
            {groupPurchase.performance.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 목표 인원 */}
          <div className="space-y-2">
            <Label htmlFor="target-participants" className="flex items-center gap-2">
              <Users className="size-4" />
              목표 인원 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setTargetParticipants(Math.max(groupPurchase.currentParticipants, targetParticipants - 1))}
                disabled={targetParticipants <= groupPurchase.currentParticipants}
              >
                -
              </Button>
              <Input
                id="target-participants"
                type="number"
                min={groupPurchase.currentParticipants}
                max={100}
                value={targetParticipants}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || groupPurchase.currentParticipants;
                  setTargetParticipants(Math.max(groupPurchase.currentParticipants, Math.min(100, value)));
                }}
                className="text-center w-24"
              />
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setTargetParticipants(Math.min(100, targetParticipants + 1))}
                disabled={targetParticipants >= 100}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground">명</span>
              <span className="text-xs text-muted-foreground ml-2">
                (현재 {groupPurchase.currentParticipants}명 참여 중)
              </span>
            </div>
          </div>

          {/* 할인율 */}
          <div className="space-y-2">
            <Label htmlFor="discount-rate" className="flex items-center gap-2">
              <Percent className="size-4" />
              할인율 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="discount-rate"
                type="number"
                min={1}
                max={50}
                value={discountRate}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setDiscountRate(Math.max(1, Math.min(50, value)));
                }}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">%</span>
              <div className="flex-1" />
              <div className="text-sm space-y-1 text-right">
                <div className="text-muted-foreground line-through">
                  {formatPrice(groupPurchase.originalPrice)}
                </div>
                <div className="font-bold text-purple-600 dark:text-purple-400">
                  {formatPrice(discountedPrice)}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  {formatPrice(savings)} 절약
                </div>
              </div>
            </div>
          </div>

          {/* 마감일 */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              마감일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="size-4" />
              공동구매 설명 (선택사항)
            </Label>
            <Textarea
              id="description"
              placeholder="공동구매에 대한 설명을 작성해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
