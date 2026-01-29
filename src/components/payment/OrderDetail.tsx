import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Package, Calendar, CreditCard, X, CheckCircle2, Clock, AlertCircle, MapPin, Mail, Phone } from 'lucide-react';
import { Order } from '../../lib/types/payment';
import { cancelOrder } from '../../lib/api/paymentApi';
import { toast } from 'sonner';
import { ImageWithFallback } from '../common/figma/ImageWithFallback';

interface OrderDetailProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetail({ order, open, onOpenChange }: OrderDetailProps) {
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

  const handleCancelOrder = async () => {
    if (!confirm('정말 주문을 취소하시겠습니까?')) {
      return;
    }

    try {
      await cancelOrder(order.id);
      toast.success('주문이 취소되었습니다.');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || '주문 취소에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
            <Package className="size-5" />
            주문 상세
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            주문번호: {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 주문 상태 */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">주문 상태</p>
              {getStatusBadge(order.status)}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">결제 금액</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* 주문 정보 */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 dark:text-gray-200">
              <Calendar className="size-4" />
              주문 정보
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground dark:text-gray-400 mb-1">주문일시</p>
                <p className="font-medium dark:text-gray-200">{formatDate(order.createdAt)}</p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-muted-foreground dark:text-gray-400 mb-1">결제일시</p>
                  <p className="font-medium dark:text-gray-200">{formatDate(order.paidAt)}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground dark:text-gray-400 mb-1">결제 수단</p>
                <p className="font-medium dark:text-gray-200">{order.paymentMethod === 'card' ? '신용/체크카드' : order.paymentMethod}</p>
              </div>
              {order.paymentId && (
                <div>
                  <p className="text-muted-foreground dark:text-gray-400 mb-1">결제 번호</p>
                  <p className="font-medium text-xs dark:text-gray-200">{order.paymentId}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 주문 상품 목록 */}
          <div className="space-y-3">
            <h3 className="font-semibold dark:text-gray-200">주문 상품</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg border bg-white dark:bg-gray-800/50 dark:border-gray-700"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h4 className="font-semibold line-clamp-2 dark:text-gray-200">{item.title}</h4>
                      {item.venue && (
                        <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                          {item.venue}
                        </p>
                      )}
                      {item.date && (
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {item.date}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground dark:text-gray-400">
                        수량: {item.quantity}개
                      </span>
                      <span className="font-semibold dark:text-gray-200">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* 결제 요약 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground dark:text-gray-400">상품 금액</span>
              <span className="font-medium dark:text-gray-200">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground dark:text-gray-400">할인 금액</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                -{formatPrice(0)}
              </span>
            </div>
            <Separator className="dark:bg-gray-700" />
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="dark:text-gray-200">총 결제금액</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* 액션 버튼 */}
          {order.status === 'paid' && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                닫기
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancelOrder}
              >
                주문 취소
              </Button>
            </div>
          )}

          {order.status !== 'paid' && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
