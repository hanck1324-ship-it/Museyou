import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { Badge } from "../ui/badge";

interface CartButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CartButton({ variant = "outline", size = "icon", className = "" }: CartButtonProps) {
  const { setIsOpen, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <Button
      variant={variant}
      size={size}
      className={`relative ${className}`}
      onClick={() => setIsOpen(true)}
      aria-label="장바구니"
    >
      <ShoppingCart className="size-4 sm:size-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs font-bold"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}
