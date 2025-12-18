export type PaymentMethod = "cod" | "banking" | "momo";

export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: { color: string; size?: string };
};

export type Order = {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  paymentMethod?: PaymentMethod;
  note?: string;
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
};