import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/forms/input';
import { Label } from '../ui/forms/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { CreditCard, User, Mail, Phone, MapPin, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useCartStore, CartItem } from '../../store/useCartStore';
import { PaymentInfo, PaymentMethod } from '../../lib/types/payment';
import { requestPayment } from '../../lib/api/paymentApi';
import { toast } from 'sonner';
import { ImageWithFallback } from '../common/figma/ImageWithFallback';

interface CheckoutPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: (orderId: string) => void;
}

export function CheckoutPage({ open, onOpenChange, onPaymentSuccess }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'success'>('info');

  // 결제 정보 폼
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods: PaymentMethod[] = [
    { type: 'card', label: '신용/체크카드', icon: '💳' },
    { type: 'account', label: '계좌이체', icon: '🏦' },
    { type: 'virtual', label: '가상계좌', icon: '📱' },
    { type: 'phone', label: '휴대폰 결제', icon: '📞' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const totalAmount = getTotalPrice();

  // 결제 정보 입력 단계
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName || !buyerEmail || !buyerPhone) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      toast.error('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    // 전화번호 형식 검증
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(buyerPhone.replace(/-/g, ''))) {
      toast.error('올바른 전화번호를 입력해주세요.');
      return;
    }

    setPaymentStep('payment');
  };

  // 결제 처리
  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('결제 수단을 선택해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // 장바구니 아이템을 결제 정보로 변환
      const paymentItems = items.map((item: CartItem) => {
        const priceStr = item.price;
        let price = 0;
        
        if (priceStr !== '무료') {
          const match = priceStr.match(/(\d+,?\d*)/);
          if (match) {
            price = parseInt(match[1].replace(/,/g, ''));
          }
        }

        return {
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price,
          image: item.image,
          venue: item.venue,
          date: item.date,
        };
      });

      const paymentInfo: PaymentInfo = {
        items: paymentItems,
        totalAmount,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress: buyerAddress || undefined,
      };

      const result = await requestPayment(paymentInfo);

      if (result.success) {
        // 결제 성공
        setPaymentStep('success');
        
        // 장바구니 비우기
        clearCart();
        
        // 성공 콜백 호출
        if (onPaymentSuccess) {
          onPaymentSuccess(result.orderId || '');
        }

        toast.success('결제가 완료되었습니다! 🎉');
      } else {
        throw new Error(result.error || '결제에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('결제 오류:', error);
      toast.error(error.message || '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 다이얼로그 닫기
  const handleClose = () => {
    if (paymentStep === 'success') {
      onOpenChange(false);
      navigate('/');
    } else if (paymentStep === 'payment' && !isProcessing) {
      setPaymentStep('info');
    } else if (paymentStep === 'info') {
      onOpenChange(false);
    }
  };

  // 초기화
  useEffect(() => {
    if (open && items.length === 0) {
      toast.error('장바구니가 비어있습니다.');
      onOpenChange(false);
      return;
    }

    if (open) {
      setPaymentStep('info');
      setIsProcessing(false);
      setSelectedPaymentMethod(null);
    }
  }, [open, items.length, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
            <CreditCard className="size-5" />
            {paymentStep === 'info' && '결제 정보 입력'}
            {paymentStep === 'payment' && '결제 수단 선택'}
            {paymentStep === 'success' && '결제 완료'}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {paymentStep === 'info' && '결제에 필요한 정보를 입력해주세요'}
            {paymentStep === 'payment' && '결제 수단을 선택하고 결제를 진행해주세요'}
            {paymentStep === 'success' && '결제가 성공적으로 완료되었습니다'}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'info' && (
          <form onSubmit={handleInfoSubmit} className="space-y-6">
            {/* 주문 내역 요약 */}
            <div className="space-y-3 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-semibold text-sm mb-3">주문 내역</h3>
              {items.map((item) => {
                const priceStr = item.price;
                let itemPrice = 0;
                
                if (priceStr !== '무료') {
                  const match = priceStr.match(/(\d+,?\d*)/);
                  if (match) {
                    itemPrice = parseInt(match[1].replace(/,/g, '')) * item.quantity;
                  }
                }

                return (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
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
                        {item.quantity}개 · {formatPrice(itemPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <Separator />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>총 결제금액</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* 구매자 정보 입력 */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 dark:text-gray-200">
                <User className="size-4" />
                구매자 정보
              </h3>

              <div className="space-y-2">
                <Label htmlFor="buyer-name">이름 *</Label>
                <Input
                  id="buyer-name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer-email">이메일 *</Label>
                <Input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer-phone">전화번호 *</Label>
                <Input
                  id="buyer-phone"
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9-]/g, '');
                    setBuyerPhone(value);
                  }}
                  placeholder="010-0000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer-address">주소 (선택)</Label>
                <Input
                  id="buyer-address"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="주소를 입력하세요"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" className="flex-1">
                다음 단계
              </Button>
            </div>
          </form>
        )}

        {paymentStep === 'payment' && (
          <div className="space-y-6">
            {/* 주문 요약 */}
            <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground dark:text-gray-400">구매자</span>
                <span className="font-medium dark:text-gray-200">{buyerName}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground dark:text-gray-400">이메일</span>
                <span className="font-medium dark:text-gray-200">{buyerEmail}</span>
              </div>
              <Separator className="my-3 dark:bg-gray-700" />
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="dark:text-gray-200">총 결제금액</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* 결제 수단 선택 */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 dark:text-gray-200">
                <CreditCard className="size-4" />
                결제 수단 선택
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.type}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPaymentMethod?.type === method.type
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600'
                        : 'border-gray-200 hover:border-emerald-300 dark:border-gray-700 dark:hover:border-emerald-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium dark:text-gray-200">{method.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setPaymentStep('info')}
                disabled={isProcessing}
              >
                <ArrowLeft className="size-4 mr-2" />
                이전
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    결제 처리 중...
                  </>
                ) : (
                  <>
                    <CreditCard className="size-4 mr-2" />
                    {formatPrice(totalAmount)} 결제하기
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="space-y-6 text-center py-8">
            <div className="flex justify-center">
              <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">결제가 완료되었습니다!</h3>
              <p className="text-muted-foreground">
                주문 내역은 이메일로 발송되었습니다.
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">결제 금액</span>
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  navigate('/');
                }}
              >
                홈으로
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  navigate('/orders');
                }}
              >
                주문 내역 보기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
