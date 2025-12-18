import { apiFetch } from "@/lib/api";

export async function getProductBySlug(slug: string) {
  const j = await apiFetch<{ ok: boolean; product: { _id: string; title: string; price: number; images?: string[]; stock?: number } }>(
    `/api/v1/products/slug/${encodeURIComponent(slug)}`
  );
  return j.product;
}