import { apiFetch } from "@/lib/api";

export type CreateOrderInput = {
  customerName: string;
  customerPhone?: string;
  customerAddress: string;
  paymentMethod: "cod" | "banking" | "momo";
  note?: string;
  items: { productId: string; quantity: number }[];
};

export function createOrder(input: CreateOrderInput) {
  return apiFetch<{ ok: boolean; order: any }>("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}