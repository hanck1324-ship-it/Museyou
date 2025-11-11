import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PrimaryButton } from "./PrimaryButton";
import { cn } from "../ui/utils";

interface MatchCardProps {
  avatar: string;
  name: string;
  age: string;
  tags: string[];
  onRequest?: () => void;
  className?: string;
}

export function SeoulMatchCard({
  avatar,
  name,
  age,
  tags,
  onRequest,
  className,
}: MatchCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 transition-all duration-300",
        "hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]",
        className
      )}
      style={{
        backgroundColor: "var(--bg-sub)",
        borderRadius: "var(--radius-large)",
      }}
    >
      {/* Avatar */}
      <Avatar className="w-16 h-16 shrink-0">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback style={{ backgroundColor: "var(--seoul-love)", color: "white" }}>
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 
          className="font-semibold text-base truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {name} ({age})
        </h4>
        <p 
          className="text-xs truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {tags.join(" ")}
        </p>
      </div>

      {/* Request Button */}
      <PrimaryButton 
        size="sm" 
        onClick={onRequest}
        className="shrink-0"
      >
        요청
      </PrimaryButton>
    </div>
  );
}
