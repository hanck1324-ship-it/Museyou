import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, MapPin, Briefcase, GraduationCap, Music, Calendar, Sparkles } from "lucide-react";
import { UserMatch } from "./MatchingCard";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

interface UserProfileProps {
  user: UserMatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLike: (userId: string) => void;
  onMessage: (userId: string) => void;
}

export function UserProfile({ user, open, onOpenChange, onLike, onMessage }: UserProfileProps) {
  if (!user) return null;

  const handleLike = () => {
    onLike(user.id);
    onOpenChange(false);
  };

  const handleMessage = () => {
    onMessage(user.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{user.name}, {user.age}</span>
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              <Sparkles className="size-3 mr-1" />
              {user.matchScore}% 매칭
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative h-80 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={user.photo}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span>{user.location}</span>
          </div>

          <div>
            <h4 className="mb-2">소개</h4>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </div>

          <div>
            <h4 className="mb-2">관심 분야</h4>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, idx) => (
                <Badge key={idx} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Calendar className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="mb-1">함께 보고 싶은 공연</h4>
                <p className="text-sm">{user.wantToSee.performanceTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.wantToSee.date}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              className="h-12"
              onClick={handleMessage}
            >
              <MessageCircle className="size-4 mr-2" />
              메시지 보내기
            </Button>
            <Button
              className="h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={handleLike}
            >
              <Heart className="size-4 mr-2" />
              관심 표현하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
