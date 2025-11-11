import { ButtonHTMLAttributes } from "react";
import { cn } from "../ui/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function PrimaryButton({ 
  children, 
  size = "md", 
  className,
  ...props 
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-gradient-to-r from-[#FF4D73] to-[#FFC83D]",
        "hover:from-[#FF3D63] hover:to-[#FFB82D]",
        "active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(255,77,115,0.3)]",
        "text-white font-semibold",
        sizeClasses[size],
        className
      )}
      style={{
        borderRadius: "var(--radius-medium)",
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </button>
  );
}
