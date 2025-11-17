import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../../ui/utils";

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  location: string;
  traffic: "high" | "mid" | "low";
  className?: string;
  onClick?: () => void;
}

const trafficConfig = {
  high: {
    color: "#E74C3C",
    label: "교통 혼잡",
    bgColor: "rgba(231, 76, 60, 0.1)",
  },
  mid: {
    color: "#F1C40F",
    label: "교통 보통",
    bgColor: "rgba(241, 196, 15, 0.1)",
  },
  low: {
    color: "#2ECC71",
    label: "교통 여유",
    bgColor: "rgba(46, 204, 113, 0.1)",
  },
};

export function EventCard({
  image,
  title,
  date,
  location,
  traffic,
  className,
  onClick,
}: EventCardProps) {
  const trafficInfo = trafficConfig[traffic];

  return (
    <div
      className={cn(
        "group cursor-pointer transition-all duration-300",
        "bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
        "overflow-hidden flex flex-col",
        className
      )}
      style={{
        borderRadius: "var(--radius-large)",
        boxShadow: "var(--shadow-soft)",
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{
            borderRadius: "var(--radius-large) var(--radius-large) 0 0",
          }}
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Title */}
        <h3 
          className="text-xl font-semibold line-clamp-2 group-hover:text-[#FF4D73] transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>

        {/* Date & Location */}
        <p 
          className="text-xs flex-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {date}<br />{location}
        </p>

        {/* Traffic Info */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: trafficInfo.color }}
          />
          <span 
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {trafficInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
}
