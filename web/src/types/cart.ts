import type { Product } from "@/types/product";

export type CartItem = {
  productId: string; // dùng _id của Product
  slug: string;
  title: string;
  price: number;
  image?: string;
  quantity: number; // >= 1
  stock?: number;
};

export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: { productId: string } }
  | { type: "SET_QTY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR" };

export function productToCartItem(p: Product, quantity = 1): CartItem {
  return {
    productId: p._id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    image: p.images?.[0],
    quantity,
    stock: p.stock,
  };
}