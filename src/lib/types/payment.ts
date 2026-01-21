export interface PaymentItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
  venue?: string;
  date?: string;
}

export interface PaymentInfo {
  items: PaymentItem[];
  totalAmount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress?: string;
}

export interface PaymentMethod {
  type: 'card' | 'account' | 'virtual' | 'phone';
  label: string;
  icon?: string;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  amount: number;
  method: string;
  paidAt?: string;
  error?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: PaymentItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  createdAt: string;
  paidAt?: string;
}
