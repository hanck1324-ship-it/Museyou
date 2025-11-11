import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Star, ThumbsUp } from "lucide-react";
import { Separator } from "./ui/separator";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  improvements: string;
  helpful: number;
}

interface ReviewSectionProps {
  performanceId: string;
}

export function ReviewSection({ performanceId }: ReviewSectionProps) {
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      author: "김예술",
      rating: 5,
      date: "2025.10.25",
      content: "정말 감동적인 공연이었습니다. 배우들의 연기가 훌륭했고 무대 연출도 완벽했어요!",
      improvements: "좌석이 조금 불편했어요. 쿠션이 있으면 좋겠습니다.",
      helpful: 12,
    },
    {
      id: "2",
      author: "이문화",
      rating: 4,
      date: "2025.10.23",
      content: "가족과 함께 관람했는데 모두 만족했습니다. 아이들도 재미있어 했어요.",
      improvements: "공연 시간이 조금 길어서 아이들이 지루해하는 부분이 있었습니다.",
      helpful: 8,
    },
  ]);

  const [newReview, setNewReview] = useState("");
  const [newImprovement, setNewImprovement] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = () => {
    if (!newReview.trim()) return;
    alert("리뷰가 등록되었습니다! (실제로는 백엔드 저장 필요)");
    setNewReview("");
    setNewImprovement("");
    setRating(5);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4>리뷰 작성</h4>
        
        <div className="space-y-2">
          <label className="text-sm">평점</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-colors"
              >
                <Star
                  className={`size-6 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">후기</label>
          <Textarea
            placeholder="공연에 대한 후기를 남겨주세요"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">개선사항</label>
          <Textarea
            placeholder="개선되었으면 하는 점을 알려주세요 (선택)"
            value={newImprovement}
            onChange={(e) => setNewImprovement(e.target.value)}
            rows={2}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          리뷰 등록
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4>리뷰 ({reviews.length})</h4>
        
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2 pb-4 border-b last:border-0">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarFallback>{review.author[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm">{review.content}</p>
                
                {review.improvements && (
                  <div className="bg-muted p-2 rounded text-sm">
                    <p className="text-xs text-muted-foreground mb-1">💡 개선사항</p>
                    <p className="text-sm">{review.improvements}</p>
                  </div>
                )}

                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="size-3" />
                  도움됨 ({review.helpful})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
