import { Home, Sparkles, Map, User } from "lucide-react";
import { cn } from "../../ui/utils";

interface BottomNavProps {
  activeTab?: "home" | "recommend" | "map" | "profile";
  onTabChange?: (tab: "home" | "recommend" | "map" | "profile") => void;
}

export function BottomNav({ activeTab = "recommend", onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "홈" },
    { id: "recommend" as const, icon: Sparkles, label: "추천" },
    { id: "map" as const, icon: Map, label: "지도" },
    { id: "profile" as const, icon: User, label: "마이페이지" },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t dark:border-gray-700"
      style={{
        backgroundColor: "var(--bg-white)",
        borderColor: "rgba(0, 0, 0, 0.08)",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="container mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}
              >
                {/* Icon with gradient background for active state */}
                <div
                  className={cn(
                    "relative p-2 rounded-xl transition-all duration-300",
                    isActive && "bg-gradient-to-r from-[#FF4D73] to-[#FFC83D]"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-colors duration-300",
                      isActive ? "text-white" : "text-[#555555]"
                    )}
                  />
                  
                  {/* Active indicator glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF4D73] to-[#FFC83D] blur-md opacity-40 -z-10" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-xs transition-colors duration-300",
                    isActive ? "font-semibold" : "font-normal"
                  )}
                  style={{
                    color: isActive ? "var(--seoul-love)" : "var(--text-secondary)",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
