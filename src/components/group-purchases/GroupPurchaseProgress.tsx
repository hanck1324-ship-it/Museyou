import { Progress } from "../ui/progress";
import { CheckCircle2 } from "lucide-react";

interface GroupPurchaseProgressProps {
  current: number;
  target: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function GroupPurchaseProgress({ 
  current, 
  target, 
  showPercentage = true,
  size = 'md'
}: GroupPurchaseProgressProps) {
  const progress = Math.min(100, (current / target) * 100);
  const isCompleted = current >= target;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${textSizeClasses[size]} dark:text-gray-200`}>
            {current}명 / {target}명
          </span>
          {isCompleted && (
            <CheckCircle2 className="size-4 text-emerald-500" />
          )}
        </div>
        {showPercentage && (
          <span className={`font-semibold ${textSizeClasses[size]} ${
            isCompleted 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <Progress 
        value={progress} 
        className={`${sizeClasses[size]} ${
          isCompleted 
            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
            : ''
        }`}
      />
    </div>
  );
}
