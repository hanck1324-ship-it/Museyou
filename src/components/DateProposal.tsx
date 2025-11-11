import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Calendar, Clock, MapPin, Heart } from "lucide-react";
import { Performance } from "./PerformanceCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DateProposalProps {
  performance: Performance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DateProposal({ performance, open, onOpenChange }: DateProposalProps) {
  const [message, setMessage] = useState("");

  if (!performance) return null;

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("메시지를 입력해주세요!");
      return;
    }
    alert("데이트 제안이 공유되었습니다! 관심있는 분들이 연락할 수 있습니다.");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>데이트 제안하기</DialogTitle>
          <DialogDescription>
            이 공연을 함께 볼 파트너를 찾아보세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 p-3 bg-muted rounded-lg">
            <div className="relative h-20 w-20 rounded overflow-hidden shrink-0">
              <ImageWithFallback
                src={performance.image}
                alt={performance.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="line-clamp-2 text-sm mb-1">{performance.title}</h4>
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>{performance.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  <span className="truncate">{performance.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>제안 메시지</Label>
            <Textarea
              placeholder="예) 이 뮤지컬 오랫동안 보고 싶었어요! 함께 보실 분 찾습니다. 공연 전후로 식사도 함께 하면 좋겠어요 😊"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              💡 긍정적이고 예의바른 메시지를 작성해주세요
            </p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-950/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
            <p className="text-xs text-muted-foreground">
              <Heart className="size-3 inline mr-1 text-pink-500" />
              제안이 게시되면 관심있는 다른 회원들이 메시지를 보낼 수 있습니다.
              안전한 만남을 위해 첫 만남은 공공장소에서 하시고, 개인정보는 주의해서 공유해주세요.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" onClick={handleSubmit}>
              제안 공유하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
