import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/forms/input";
import { Label } from "../ui/forms/label";
import { Textarea } from "../ui/forms/textarea";
import { Users, MessageSquare } from "lucide-react";
import { useState } from "react";
import { GroupPurchase } from "../../lib/types/groupPurchase";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

interface GroupPurchaseJoinProps {
  groupPurchase: GroupPurchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (participantCount: number, message?: string) => Promise<void>;
}

export function GroupPurchaseJoin({ 
  groupPurchase, 
  open, 
  onOpenChange,
  onJoin 
}: GroupPurchaseJoinProps) {
  const [participantCount, setParticipantCount] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!groupPurchase) return null;

  const maxParticipants = groupPurchase.targetParticipants - groupPurchase.currentParticipants;
  const canJoin = groupPurchase.status === 'recruiting' && maxParticipants > 0;

  const handleSubmit = async () => {
    if (!canJoin) return;
    if (participantCount < 1 || participantCount > maxParticipants) {
      alert(`참여 인원은 1명 이상 ${maxParticipants}명 이하여야 합니다.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onJoin(participantCount, message || undefined);
      setParticipantCount(1);
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error('참여 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>문화 공동구매 참여하기</DialogTitle>
          <DialogDescription>
            공동구매에 참여하여 할인된 가격으로 공연을 관람하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 공연 정보 */}
          <div className="flex gap-3 p-3 bg-muted rounded-lg">
            <div className="relative h-20 w-20 rounded overflow-hidden shrink-0">
              <ImageWithFallback
                src={groupPurchase.performance.image}
                alt={groupPurchase.performance.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="line-clamp-2 text-sm mb-1 font-semibold">{groupPurchase.performance.title}</h4>
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <div>{groupPurchase.performance.venue}</div>
                <div className="flex items-center gap-2">
                  <span className="line-through">{formatPrice(groupPurchase.originalPrice)}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {formatPrice(groupPurchase.discountedPrice)}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ({groupPurchase.discountRate}% 할인)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!canJoin ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {groupPurchase.status !== 'recruiting' 
                  ? '모집이 마감된 공동구매입니다.' 
                  : '참여 가능한 인원이 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              {/* 참여 인원 */}
              <div className="space-y-2">
                <Label htmlFor="participant-count" className="flex items-center gap-2">
                  <Users className="size-4" />
                  참여 인원
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setParticipantCount(Math.max(1, participantCount - 1))}
                    disabled={participantCount <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="participant-count"
                    type="number"
                    min={1}
                    max={maxParticipants}
                    value={participantCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setParticipantCount(Math.max(1, Math.min(maxParticipants, value)));
                    }}
                    className="text-center w-20"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setParticipantCount(Math.min(maxParticipants, participantCount + 1))}
                    disabled={participantCount >= maxParticipants}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    (최대 {maxParticipants}명)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  총 {formatPrice(groupPurchase.discountedPrice * participantCount)} ({participantCount}명 × {formatPrice(groupPurchase.discountedPrice)})
                </p>
              </div>

              {/* 참여 메시지 */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  참여 메시지 (선택사항)
                </Label>
                <Textarea
                  id="message"
                  placeholder="예) 함께 관람하고 싶습니다! 공연 전후로 식사도 함께 하면 좋겠어요 😊"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  💡 긍정적이고 예의바른 메시지를 작성해주세요
                </p>
              </div>

              {/* 참여 정보 요약 */}
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">참여 인원:</span>
                    <span className="font-medium">{participantCount}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">할인율:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {groupPurchase.discountRate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t dark:border-gray-700">
                    <span>총 결제 금액:</span>
                    <span className="text-purple-600 dark:text-purple-400">
                      {formatPrice(groupPurchase.discountedPrice * participantCount)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            {canJoin && (
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '참여 중...' : '참여하기'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
