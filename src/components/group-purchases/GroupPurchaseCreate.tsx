import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/forms/input";
import { Label } from "../ui/forms/label";
import { Textarea } from "../ui/forms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/forms/select";
import { Calendar, Users, Percent, CalendarDays, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Performance } from "../performances/PerformanceCard";
import { useGroupPurchaseStore } from "../../store/useGroupPurchaseStore";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { performanceApi } from "../../lib/api/api";

interface GroupPurchaseCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupPurchaseCreate({ open, onOpenChange }: GroupPurchaseCreateProps) {
  const { createGroupPurchase } = useGroupPurchaseStore();
  
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<string>("");
  const [targetParticipants, setTargetParticipants] = useState<number>(10);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPerformances, setIsLoadingPerformances] = useState(false);

  // 공연 목록 로드
  useEffect(() => {
    if (open) {
      loadPerformances();
    }
  }, [open]);

  const loadPerformances = async () => {
    setIsLoadingPerformances(true);
    try {
      const data = await performanceApi.getAll();
      if (data.performances) {
        setPerformances(data.performances);
      }
    } catch (error) {
      console.error('공연 목록 로드 실패:', error);
    } finally {
      setIsLoadingPerformances(false);
    }
  };

  const selectedPerformance = performances.find(p => p.id === selectedPerformanceId);

  // 할인가 계산
  const calculateDiscountedPrice = () => {
    if (!selectedPerformance) return 0;
    const priceStr = selectedPerformance.price;
    if (priceStr === '무료') return 0;
    
    const match = priceStr.match(/(\d+,?\d*)/);
    if (match) {
      const originalPrice = parseInt(match[1].replace(/,/g, ''));
      return Math.floor(originalPrice * (1 - discountRate / 100));
    }
    return 0;
  };

  const originalPrice = selectedPerformance 
    ? (() => {
        const priceStr = selectedPerformance.price;
        if (priceStr === '무료') return 0;
        const match = priceStr.match(/(\d+,?\d*)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
      })()
    : 0;

  const discountedPrice = calculateDiscountedPrice();
  const savings = originalPrice - discountedPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 마감일 기본값 설정 (7일 후)
  useEffect(() => {
    if (open && !deadline) {
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 7);
      const year = defaultDeadline.getFullYear();
      const month = String(defaultDeadline.getMonth() + 1).padStart(2, '0');
      const day = String(defaultDeadline.getDate()).padStart(2, '0');
      const hours = String(defaultDeadline.getHours()).padStart(2, '0');
      const minutes = String(defaultDeadline.getMinutes()).padStart(2, '0');
      setDeadline(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [open, deadline]);

  const handleSubmit = async () => {
    // 검증
    if (!selectedPerformanceId) {
      alert('공연을 선택해주세요.');
      return;
    }
    if (targetParticipants < 2) {
      alert('목표 인원은 최소 2명 이상이어야 합니다.');
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
      await createGroupPurchase({
        performanceId: selectedPerformanceId,
        targetParticipants,
        discountRate,
        deadline: deadlineDate.toISOString(),
        description: description.trim() || undefined,
      });
      
      // 폼 초기화
      setSelectedPerformanceId("");
      setTargetParticipants(10);
      setDiscountRate(10);
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error('공동구매 생성 실패:', error);
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
            <Users className="size-5" />
            문화 공동구매 만들기
          </DialogTitle>
          <DialogDescription>
            공연을 함께 관람할 사람들을 모집하고 할인 혜택을 받아보세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 공연 선택 */}
          <div className="space-y-2">
            <Label htmlFor="performance" className="flex items-center gap-2">
              <Calendar className="size-4" />
              공연 선택 <span className="text-red-500">*</span>
            </Label>
            {isLoadingPerformances ? (
              <div className="text-sm text-muted-foreground">공연 목록을 불러오는 중...</div>
            ) : (
              <Select value={selectedPerformanceId} onValueChange={setSelectedPerformanceId}>
                <SelectTrigger id="performance">
                  <SelectValue placeholder="공연을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {performances.map((performance) => (
                    <SelectItem key={performance.id} value={performance.id}>
                      {performance.title} - {performance.venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {selectedPerformance && (
              <div className="flex gap-3 p-3 bg-muted rounded-lg mt-2">
                <div className="relative h-20 w-20 rounded overflow-hidden shrink-0">
                  <ImageWithFallback
                    src={selectedPerformance.image}
                    alt={selectedPerformance.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{selectedPerformance.title}</h4>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <div>{selectedPerformance.venue}</div>
                    <div>{selectedPerformance.date} {selectedPerformance.time}</div>
                    <div className="font-medium text-foreground">{selectedPerformance.price}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                onClick={() => setTargetParticipants(Math.max(2, targetParticipants - 1))}
                disabled={targetParticipants <= 2}
              >
                -
              </Button>
              <Input
                id="target-participants"
                type="number"
                min={2}
                max={100}
                value={targetParticipants}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 2;
                  setTargetParticipants(Math.max(2, Math.min(100, value)));
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
            </div>
            <p className="text-xs text-muted-foreground">
              💡 목표 인원이 달성되면 할인이 확정됩니다
            </p>
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
              {selectedPerformance && originalPrice > 0 && (
                <div className="text-sm space-y-1 text-right">
                  <div className="text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </div>
                  <div className="font-bold text-purple-600 dark:text-purple-400">
                    {formatPrice(discountedPrice)}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    {formatPrice(savings)} 절약
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              💡 할인율은 1% 이상 50% 이하로 설정할 수 있습니다
            </p>
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
            <p className="text-xs text-muted-foreground">
              💡 마감일까지 목표 인원을 모집해야 합니다
            </p>
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="size-4" />
              공동구매 설명 (선택사항)
            </Label>
            <Textarea
              id="description"
              placeholder="예) 이 공연을 오랫동안 보고 싶었어요! 함께 관람하실 분들을 모집합니다. 공연 전후로 식사도 함께 하면 좋겠어요 😊"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              💡 공동구매에 대한 설명을 작성하면 더 많은 분들이 참여하실 수 있어요
            </p>
          </div>

          {/* 요약 정보 */}
          {selectedPerformance && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-3 text-sm">공동구매 요약</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">공연:</span>
                  <span className="font-medium">{selectedPerformance.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">목표 인원:</span>
                  <span className="font-medium">{targetParticipants}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">할인율:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {discountRate}%
                  </span>
                </div>
                {originalPrice > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">원가:</span>
                      <span className="line-through">{formatPrice(originalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">할인가:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {formatPrice(discountedPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                      <span className="font-medium">1인당 절약:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(savings)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

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
              disabled={isSubmitting || !selectedPerformanceId}
            >
              {isSubmitting ? '생성 중...' : '공동구매 만들기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
