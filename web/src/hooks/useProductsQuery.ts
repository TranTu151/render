import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";

export type ProductsResponse = {
  data: Product[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
};

export function useProductsQuery(args: { page: number; limit: number; q?: string }) {
  const { page, limit, q } = args;

  return useQuery<ProductsResponse>({
    queryKey: ["products", { page, limit, q: q ?? "" }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()) as ProductsResponse;
    },
    placeholderData: (prev) => prev, // v5: thay cho keepPreviousData
  });
}