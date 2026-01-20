import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { GroupPurchaseParticipant } from "../../lib/types/groupPurchase";
import { Users } from "lucide-react";

interface GroupPurchaseParticipantsProps {
  participants: GroupPurchaseParticipant[];
  maxDisplay?: number;
  showCount?: boolean;
}

export function GroupPurchaseParticipants({ 
  participants, 
  maxDisplay = 5,
  showCount = true 
}: GroupPurchaseParticipantsProps) {
  const displayParticipants = participants.slice(0, maxDisplay);
  const remainingCount = Math.max(0, participants.length - maxDisplay);
  const totalParticipants = participants.reduce((sum, p) => sum + p.participantCount, 0);

  if (participants.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        <span>아직 참여자가 없습니다</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showCount && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium dark:text-gray-200">
            참여자 ({participants.length}명)
          </span>
          <span className="text-xs text-muted-foreground">
            총 {totalParticipants}명 참여
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {displayParticipants.map((participant) => (
          <Avatar 
            key={participant.id} 
            className="size-8 sm:size-10 border-2 border-white dark:border-gray-700 shadow-md hover:scale-110 transition-transform cursor-pointer"
            title={participant.user.name}
          >
            <AvatarImage src={participant.user.avatar} alt={participant.user.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs">
              {participant.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
        
        {remainingCount > 0 && (
          <div className="size-8 sm:size-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 shadow-md">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}
