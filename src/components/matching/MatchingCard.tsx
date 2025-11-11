import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, MapPin, Calendar, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

export interface UserMatch {
  id: string;
  name: string;
  age: number;
  gender: string;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  wantToSee: {
    performanceId: string;
    performanceTitle: string;
    date: string;
  };
  matchScore: number;
}

interface MatchingCardProps {
  user: UserMatch;
  onLike: (userId: string) => void;
  onMessage: (userId: string) => void;
  onViewProfile: (user: UserMatch) => void;
}

export function MatchingCard({ user, onLike, onMessage, onViewProfile }: MatchingCardProps) {
  const isUserMale = user.gender === "남성";
  const gradientClass = isUserMale 
    ? "from-emerald-500 to-teal-500" 
    : "from-pink-500 to-rose-500";
  const hoverGradientClass = isUserMale
    ? "hover:from-emerald-600 hover:to-teal-600"
    : "hover:from-pink-600 hover:to-rose-600";
  const borderClass = isUserMale
    ? "border-emerald-200 hover:border-emerald-300"
    : "border-pink-200 hover:border-pink-300";
  const bgAccentClass = isUserMale
    ? "bg-emerald-50"
    : "bg-pink-50";
  
  return (
    <Card className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/90 border-2 ${borderClass}`}>
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
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{user.bio}</p>

        <div className="flex flex-wrap gap-1">
          {user.interests.slice(0, 3).map((interest, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className={`text-xs ${isUserMale ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'} border-0`}
            >
              {interest}
            </Badge>
          ))}
          {user.interests.length > 3 && (
            <Badge 
              variant="secondary" 
              className={`text-xs ${isUserMale ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'} border-0`}
            >
              +{user.interests.length - 3}
            </Badge>
          )}
        </div>

        <div className={`${bgAccentClass} p-2.5 sm:p-3 rounded-lg border ${isUserMale ? 'border-emerald-100' : 'border-pink-100'} shadow-sm`}>
          <div className="flex items-start gap-2">
            <Calendar className={`size-3 sm:size-4 ${isUserMale ? 'text-emerald-600' : 'text-pink-600'} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">함께 보고 싶어 해요</p>
              <p className="text-xs sm:text-sm line-clamp-1">{user.wantToSee.performanceTitle}</p>
              <p className="text-xs text-muted-foreground">{user.wantToSee.date}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-0 p-3 sm:p-6">
        <Button
          variant="outline"
          className={`flex-1 text-xs sm:text-sm h-8 sm:h-10 ${isUserMale ? 'border-emerald-200 hover:bg-emerald-50' : 'border-pink-200 hover:bg-pink-50'} transition-all`}
          onClick={() => onViewProfile(user)}
        >
          프로필 보기
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`size-8 sm:size-10 ${isUserMale ? 'border-emerald-200 hover:bg-emerald-50' : 'border-pink-200 hover:bg-pink-50'} transition-all`}
          onClick={() => onMessage(user.id)}
        >
          <MessageCircle className="size-3 sm:size-4" />
        </Button>
        <Button
          size="icon"
          className={`bg-gradient-to-r ${gradientClass} ${hoverGradientClass} size-8 sm:size-10 shadow-lg hover:shadow-xl transition-all group-button relative overflow-hidden`}
          onClick={() => onLike(user.id)}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-button-hover:translate-y-0 transition-transform duration-300" />
          <Heart className="size-3 sm:size-4 relative z-10" />
        </Button>
      </CardFooter>
    </Card>
  );
}
