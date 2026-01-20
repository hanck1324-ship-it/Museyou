import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GroupPurchase } from "../../lib/types/groupPurchase";
import { TrendingUp, Users, Percent, Calendar, CheckCircle2 } from "lucide-react";

interface GroupPurchaseStatsProps {
  groupPurchases: GroupPurchase[];
}

export function GroupPurchaseStats({ groupPurchases }: GroupPurchaseStatsProps) {
  // 통계 계산
  const totalCount = groupPurchases.length;
  const activeCount = groupPurchases.filter(gp => gp.status === 'recruiting').length;
  const completedCount = groupPurchases.filter(gp => gp.status === 'completed').length;
  const cancelledCount = groupPurchases.filter(gp => gp.status === 'cancelled').length;

  const totalParticipants = groupPurchases.reduce((sum, gp) => sum + gp.currentParticipants, 0);
  const totalTargetParticipants = groupPurchases.reduce((sum, gp) => sum + gp.targetParticipants, 0);
  const averageProgress = totalTargetParticipants > 0 
    ? Math.round((totalParticipants / totalTargetParticipants) * 100) 
    : 0;

  const totalDiscount = groupPurchases.reduce((sum, gp) => {
    const saved = gp.originalPrice - gp.discountedPrice;
    return sum + saved * gp.currentParticipants;
  }, 0);

  const averageDiscountRate = totalCount > 0
    ? Math.round(groupPurchases.reduce((sum, gp) => sum + gp.discountRate, 0) / totalCount)
    : 0;

  const stats = [
    {
      title: '전체 공동구매',
      value: totalCount,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: '진행 중',
      value: activeCount,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: '완료',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: '평균 진행률',
      value: `${averageProgress}%`,
      icon: Percent,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      title: '총 절약 금액',
      value: new Intl.NumberFormat('ko-KR').format(totalDiscount) + '원',
      icon: TrendingUp,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    },
    {
      title: '평균 할인율',
      value: `${averageDiscountRate}%`,
      icon: Percent,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`size-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
