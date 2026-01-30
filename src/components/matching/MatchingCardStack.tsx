import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { SwipeableMatchingCard } from "./SwipeableMatchingCard";
import { UserMatch } from "./MatchingCard";
import { MatchingCardSkeleton } from "./MatchingCardSkeleton";
import { Heart } from "lucide-react";

interface MatchingCardStackProps {
  users: UserMatch[];
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  onMessage: (userId: string) => void;
  onViewProfile: (user: UserMatch) => void;
  isLoading?: boolean;
}

export function MatchingCardStack({
  users,
  onLike,
  onPass,
  onMessage,
  onViewProfile,
  isLoading = false,
}: MatchingCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedUsers, setDisplayedUsers] = useState<UserMatch[]>([]);

  // 최대 3개의 카드만 동시에 표시 (성능 최적화)
  const MAX_VISIBLE_CARDS = 3;

  useEffect(() => {
    if (users.length > 0) {
      setDisplayedUsers(users.slice(0, MAX_VISIBLE_CARDS));
      setCurrentIndex(0);
    } else {
      setDisplayedUsers([]);
      setCurrentIndex(0);
    }
  }, [users]);

  const handleLike = (userId: string) => {
    onLike(userId);
    removeCard(userId);
  };

  const handlePass = (userId: string) => {
    onPass(userId);
    removeCard(userId);
  };

  const removeCard = (userId: string) => {
    setDisplayedUsers((prev) => {
      const newUsers = prev.filter((user) => user.id !== userId);
      
      // 다음 카드들을 추가로 로드
      const nextIndex = currentIndex + prev.length;
      if (nextIndex < users.length && newUsers.length < MAX_VISIBLE_CARDS) {
        const nextUser = users[nextIndex];
        if (nextUser) {
          return [...newUsers, nextUser];
        }
      }
      
      return newUsers;
    });
    
    setCurrentIndex((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full max-w-6xl">
          {Array.from({ length: 3 }).map((_, index) => (
            <MatchingCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (displayedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] py-12">
        <Heart className="size-16 text-muted-foreground dark:text-gray-500 mb-4" />
        <p className="text-lg font-medium text-muted-foreground dark:text-gray-400 mb-2">
          더 이상 매칭할 사용자가 없습니다
        </p>
        <p className="text-sm text-muted-foreground dark:text-gray-500">
          나중에 다시 확인해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[600px] py-8">
      <div className="relative w-full max-w-md" style={{ height: "600px" }}>
        <AnimatePresence mode="popLayout">
          {displayedUsers.map((user, index) => (
            <SwipeableMatchingCard
              key={user.id}
              user={user}
              onLike={handleLike}
              onPass={handlePass}
              onMessage={onMessage}
              onViewProfile={onViewProfile}
              index={index}
              total={displayedUsers.length}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
