import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Heart, MessageCircle, MapPin, Calendar, Sparkles, X } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";
import { UserMatch } from "./MatchingCard";

interface SwipeableMatchingCardProps {
  user: UserMatch;
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  onMessage: (userId: string) => void;
  onViewProfile: (user: UserMatch) => void;
  index: number;
  total: number;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_MULTIPLIER = 0.1;

export function SwipeableMatchingCard({
  user,
  onLike,
  onPass,
  onMessage,
  onViewProfile,
  index,
  total,
}: SwipeableMatchingCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const isUserMale = user.gender === "남성";
  const gradientClass = isUserMale 
    ? "from-emerald-500 to-teal-500" 
    : "from-pink-500 to-rose-500";
  const hoverGradientClass = isUserMale
    ? "hover:from-emerald-600 hover:to-teal-600"
    : "hover:from-pink-600 hover:to-rose-600";
  const borderClass = isUserMale
    ? "border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700"
    : "border-pink-200 dark:border-pink-800 hover:border-pink-300 dark:hover:border-pink-700";
  const bgAccentClass = isUserMale
    ? "bg-emerald-50 dark:bg-emerald-900/20"
    : "bg-pink-50 dark:bg-pink-900/20";

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);
  
  // 좋아요/패스 오버레이
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isExiting) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
      setIsExiting(true);
      if (offset > 0 || velocity > 0) {
        // 오른쪽 스와이프 = 좋아요
        onLike(user.id);
      } else {
        // 왼쪽 스와이프 = 패스
        onPass(user.id);
      }
    }
  };

  const handleLike = () => {
    if (isExiting) return;
    setIsExiting(true);
    onLike(user.id);
  };

  const handlePass = () => {
    if (isExiting) return;
    setIsExiting(true);
    onPass(user.id);
  };

  // 스택에서 뒤에 있는 카드들의 스타일
  const isTopCard = index === 0;
  const scale = isTopCard ? 1 : 1 - (index * 0.05);
  const y = isTopCard ? 0 : index * 8;
  const zIndex = total - index;

  if (isExiting) {
    return null;
  }

  return (
    <motion.div
      style={{
        x: isTopCard ? x : 0,
        rotate: isTopCard ? rotate : 0,
        opacity: isTopCard ? opacity : 1,
        scale,
        y,
        zIndex,
        position: "absolute",
        width: "100%",
        maxWidth: "400px",
        pointerEvents: isTopCard ? "auto" : "none",
      }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ 
        x: x.get() > 0 ? 1000 : -1000,
        rotate: x.get() > 0 ? 30 : -30,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full"
    >
      <Card className={`group overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 ${borderClass} cursor-grab active:cursor-grabbing`}>
        {/* 좋아요 오버레이 */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 z-10 pointer-events-none rounded-lg flex items-center justify-center"
        >
          <div className="bg-emerald-500/90 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            좋아요!
          </div>
        </motion.div>

        {/* 패스 오버레이 */}
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 z-10 pointer-events-none rounded-lg flex items-center justify-center"
        >
          <div className="bg-gray-500/90 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            패스
          </div>
        </motion.div>

        <div className="relative">
          <div className="h-56 sm:h-64 overflow-hidden">
            <ImageWithFallback
              src={user.photo}
              alt={user.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          </div>
          
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-2">
            <Badge className={`bg-gradient-to-r ${gradientClass} text-white border-0 text-xs sm:text-sm shadow-lg backdrop-blur-sm`}>
              <Sparkles className="size-3 mr-1 animate-pulse" />
              {user.matchScore}%
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 text-white">
            <h3 className="text-white mb-1 text-base sm:text-lg">{user.name}, {user.age}</h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-white/90">
              <MapPin className="size-3" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        <CardContent className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">{user.bio}</p>

          <div className="flex flex-wrap gap-1">
            {user.interests.slice(0, 3).map((interest, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className={`text-xs ${isUserMale ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'} border-0`}
              >
                {interest}
              </Badge>
            ))}
            {user.interests.length > 3 && (
              <Badge 
                variant="secondary" 
                className={`text-xs ${isUserMale ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'} border-0`}
              >
                +{user.interests.length - 3}
              </Badge>
            )}
          </div>

          <div className={`${bgAccentClass} p-2.5 sm:p-3 rounded-lg border ${isUserMale ? 'border-emerald-100 dark:border-emerald-800' : 'border-pink-100 dark:border-pink-800'} shadow-sm`}>
            <div className="flex items-start gap-2">
              <Calendar className={`size-3 sm:size-4 ${isUserMale ? 'text-emerald-600 dark:text-emerald-400' : 'text-pink-600 dark:text-pink-400'} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground dark:text-gray-400">함께 보고 싶어 해요</p>
                <p className="text-xs sm:text-sm line-clamp-1 dark:text-gray-200">{user.wantToSee.performanceTitle}</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">{user.wantToSee.date}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-2 pt-0 p-3 sm:p-6">
          <Button
            variant="outline"
            className={`flex-1 text-xs sm:text-sm h-8 sm:h-10 ${isUserMale ? 'border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : 'border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30'} transition-all dark:text-gray-200`}
            onClick={() => onViewProfile(user)}
          >
            프로필 보기
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`size-8 sm:size-10 ${isUserMale ? 'border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : 'border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30'} transition-all dark:text-gray-200`}
            onClick={() => onMessage(user.id)}
          >
            <MessageCircle className="size-3 sm:size-4" />
          </Button>
          <Button
            size="icon"
            className={`bg-gradient-to-r ${gradientClass} ${hoverGradientClass} size-8 sm:size-10 shadow-lg hover:shadow-xl transition-all group-button relative overflow-hidden`}
            onClick={handleLike}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-button-hover:translate-y-0 transition-transform duration-300" />
            <Heart className="size-3 sm:size-4 relative z-10" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 sm:size-10 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all dark:text-gray-200"
            onClick={handlePass}
          >
            <X className="size-3 sm:size-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
