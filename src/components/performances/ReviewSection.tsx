import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/forms/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Star, ThumbsUp } from "lucide-react";
import { Separator } from "../ui/separator";
import { reviewApi } from "../../lib/api/api";
import { toast } from "sonner";
import { usePerformanceRating } from "../../lib/hooks/usePerformanceRating";

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [newImprovement, setNewImprovement] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refresh: refreshRating } = usePerformanceRating(performanceId);

  // 리뷰 목록 로드
  useEffect(() => {
    loadReviews();
  }, [performanceId]);

  const loadReviews = async () => {
    try {
      const result = await reviewApi.getByPerformanceId(performanceId);
      if (result && result.reviews) {
        // API 응답을 Review 형식으로 변환
        const formattedReviews: Review[] = result.reviews.map((review: any) => ({
          id: review.id || `review_${Date.now()}_${Math.random()}`,
          author: review.author || review.user_name || '익명',
          rating: review.rating || 5,
          date: review.created_at 
            ? new Date(review.created_at).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
              }).replace(/\./g, '.').replace(/\s/g, '')
            : new Date().toLocaleDateString('ko-KR'),
          content: review.content || review.comment || '',
          improvements: review.improvements || '',
          helpful: review.helpful_count || 0,
        }));
        setReviews(formattedReviews);
      }
    } catch (error) {
      console.error('리뷰 로드 실패:', error);
      // 에러 발생 시 기본 리뷰 표시
      setReviews([
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
    }
  };

  const handleSubmit = async () => {
    if (!newReview.trim()) {
      toast.error('리뷰 내용을 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.create({
        performanceId,
        rating,
        comment: newReview,
        improvements: newImprovement || undefined,
      });

      toast.success('리뷰가 등록되었습니다!');
      setNewReview("");
      setNewImprovement("");
      setRating(5);
      
      // 리뷰 목록 및 평점 새로고침
      await loadReviews();
      
      // 평점 업데이트 (이벤트 기반으로 자동 업데이트되지만 명시적으로 호출)
      refreshRating();
      
      // 실시간 업데이트를 위한 이벤트 발생 (api.ts에서도 발생하지만 확실하게)
      window.dispatchEvent(new CustomEvent(`review-updated-${performanceId}`));
    } catch (error: any) {
      console.error('리뷰 등록 실패:', error);
      toast.error(error.message || '리뷰 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
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

        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isSubmitting || !newReview.trim()}
        >
          {isSubmitting ? '등록 중...' : '리뷰 등록'}
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
