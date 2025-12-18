"use client";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";

export default function CartIndicator() {
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? totalItems : 0; // tránh lệch hydrate
  return (
    <Link href="/cart" className="relative px-3 py-2 rounded-lg hover:underline">
      Cart
      <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 text-xs px-1 rounded-full bg-black text-white">
        {count}
      </span>
    </Link>
  );
}