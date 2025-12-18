"use client";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/types/product";
import { productToCartItem } from "@/types/cart";

export default function AddToCartButton({
    product,
    disabled,
    fullWidth = true,
    className = "",
}: {
    product: Product;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}) {
    const { dispatch } = useCart();

    const base =
        "h-10 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-40";
    const width = fullWidth ? "w-full" : "px-4";

    return (
        <button
            type="button"          // tránh mặc định submit
            disabled={disabled}
            onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "ADD", payload: productToCartItem(product, 1) });
            }}
            className={`${base} ${width} ${className}`}
            aria-disabled={disabled}
        >
            Thêm vào giỏ
        </button>
    );
}
