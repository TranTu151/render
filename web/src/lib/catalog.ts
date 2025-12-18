import type { Product } from "@/types/product";
import type { MinProduct } from "@/mock/min-products";
import { PRODUCTS } from "@/mock/products";
import { MIN_PRODUCTS } from "@/mock/min-products";

export function toProduct(p: MinProduct): Product {
  return {
    _id: `legacy-${p.slug}`,
    title: p.title,
    slug: p.slug,
    price: p.price,
    images: [p.image ?? "/placeholder.png"],
    stock: p.stock ?? 0,
  };
}

export function asProduct(p: Product | MinProduct): Product {
  const maybe = p as Product;
  if (typeof maybe._id === "string" && Array.isArray(maybe.images)) return maybe;
  return toProduct(p as MinProduct);
}

// 🔧 Thêm hàm hợp nhất dữ liệu theo slug
export function getProductBySlug(slug: string): Product | null {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (p) return p;
  const m = MIN_PRODUCTS.find((x) => x.slug === slug);
  return m ? toProduct(m) : null;
}
