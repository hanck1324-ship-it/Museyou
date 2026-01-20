import { Badge } from "../ui/badge";
import { Clock, CheckCircle2, XCircle, Users, AlertCircle } from "lucide-react";
import { GroupPurchaseStatus as StatusType } from "../../lib/types/groupPurchase";

interface GroupPurchaseStatusProps {
  status: StatusType;
  className?: string;
}

export function GroupPurchaseStatus({ status, className = "" }: GroupPurchaseStatusProps) {
  const statusConfig = {
    recruiting: {
      label: '모집중',
      variant: 'default' as const,
      className: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      icon: Users,
    },
    in_progress: {
      label: '진행중',
      variant: 'default' as const,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
      icon: Clock,
    },
    completed: {
      label: '목표달성',
      variant: 'default' as const,
      className: 'bg-purple-500 hover:bg-purple-600 text-white',
      icon: CheckCircle2,
    },
    closed: {
      label: '마감',
      variant: 'secondary' as const,
      className: 'bg-gray-500 hover:bg-gray-600 text-white',
      icon: XCircle,
    },
    cancelled: {
      label: '취소됨',
      variant: 'destructive' as const,
      className: 'bg-red-500 hover:bg-red-600 text-white',
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className} flex items-center gap-1`}
    >
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}
