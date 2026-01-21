import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Package, Calendar, CreditCard, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Order } from '../../lib/types/payment';
import { getOrders, cancelOrder } from '../../lib/api/paymentApi';
import { toast } from 'sonner';
import { ImageWithFallback } from '../common/figma/ImageWithFallback';
import { OrderDetail } from './OrderDetail';

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const orderList = getOrders();
      // 최신 주문부터 정렬
      setOrders(orderList.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('주문 내역 로드 오류:', error);
      toast.error('주문 내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('정말 주문을 취소하시겠습니까?')) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.success('주문이 취소되었습니다.');
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || '주문 취소에 실패했습니다.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-emerald-500">
            <CheckCircle2 className="size-3 mr-1" />
            결제 완료
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="size-3 mr-1" />
            대기 중
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <X className="size-3 mr-1" />
            취소됨
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline">
            <AlertCircle className="size-3 mr-1" />
            환불됨
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="size-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="size-16 text-muted-foreground mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">주문 내역이 없습니다</p>
        <p className="text-sm text-muted-foreground">
          공연을 예매하고 주문 내역을 확인해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="size-6" />
            주문 내역
          </h2>
          <p className="text-muted-foreground mt-1">
            총 {orders.length}개의 주문
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">주문 #{order.id.slice(-8)}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {formatDate(order.createdAt)}
                    </span>
                    {order.paidAt && (
                      <span className="flex items-center gap-1">
                        <CreditCard className="size-4" />
                        결제: {formatDate(order.paidAt)}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* 주문 아이템 목록 */}
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}개 · {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      외 {order.items.length - 3}개 상품
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">총 결제금액</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedOrder(order)}
                  >
                    상세 보기
                  </Button>
                  {order.status === 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      주문 취소
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
