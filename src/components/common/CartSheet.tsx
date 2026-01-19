import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

export function CartSheet() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, getTotalPrice, getItemCount } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('장바구니가 비어있습니다.');
      return;
    }
    toast.info('결제 기능은 곧 출시됩니다! 💳');
    // TODO: 결제 페이지로 이동
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            장바구니
            {getItemCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getItemCount()}개
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            선택한 공연을 확인하고 결제하세요
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="size-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">장바구니가 비어있습니다</p>
              <p className="text-sm text-muted-foreground">공연을 추가해보세요!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base line-clamp-2 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.venue} · {item.date}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 sm:size-8 shrink-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                          onClick={() => removeItem(item.id)}
                          aria-label="제거"
                        >
                          <X className="size-3 sm:size-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 sm:size-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-3 sm:size-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium dark:text-gray-200">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 sm:size-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="size-3 sm:size-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm sm:text-base font-semibold dark:text-gray-100">
                            {item.price === '무료' 
                              ? '무료' 
                              : (() => {
                                  const match = item.price.match(/(\d+,?\d*)/);
                                  if (match) {
                                    const price = parseInt(match[1].replace(/,/g, '')) * item.quantity;
                                    return formatPrice(price);
                                  }
                                  return item.price;
                                })()
                            }
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              개당 {item.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">총 상품 수</span>
                  <span className="font-medium dark:text-gray-200">{getItemCount()}개</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="dark:text-gray-100">총 결제금액</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
          {items.length > 0 && (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={clearCart}
              >
                <Trash2 className="size-4 mr-2" />
                전체 삭제
              </Button>
              <Button
                className="w-full sm:flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                <ShoppingCart className="size-4 mr-2" />
                결제하기 ({formatPrice(getTotalPrice())})
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
