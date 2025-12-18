"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const qParam = searchParams.get("q") || "";

  const [qInput, setQInput] = useState(qParam);
  useEffect(() => setQInput(qParam), [qParam]);

  const queryArgs = useMemo(() => ({ page: pageParam, limit: LIMIT, q: qParam || undefined }), [pageParam, qParam]);
  const { data, isLoading, isError, error } = useProductsQuery(queryArgs);

  function setUrl(next: { page?: number; q?: string | null }) {
    const sp = new URLSearchParams(searchParams.toString());
    if (typeof next.page === "number") sp.set("page", String(next.page));
    if (next.q !== undefined) {
      if (next.q && next.q.trim()) {
        sp.set("q", next.q.trim());
        sp.set("page", "1");
      } else {
        sp.delete("q");
        sp.set("page", "1");
      }
    }
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <main className="py-8">
      <h1 className="text-2xl font-semibold">Shop</h1>
      {/* Search */}
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setUrl({ q: qInput });
        }}
      >
        <input
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="h-10 px-3 rounded-md border text-sm w-full md:w-80"
          aria-label="Tìm kiếm sản phẩm"
        />
        <button className="h-10 px-4 rounded-md border">Tìm</button>
      </form>

      {/* States */}
      {isLoading && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-100 rounded-xl border" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-6 text-red-600">Lỗi tải dữ liệu: {(error as Error)?.message}</p>
      )}

      {data && data.data.length === 0 && (
        <p className="mt-6 text-gray-600">Không tìm thấy sản phẩm phù hợp.</p>
      )}

      {data && data.data.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && (
        <div className="mt-8 flex items-center gap-3">
          <button
            className="h-9 px-3 rounded-md border disabled:opacity-40"
            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
            disabled={pageParam <= 1}
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">Trang {data.page}</span>
          <button
            className="h-9 px-3 rounded-md border disabled:opacity-40"
            onClick={() => setUrl({ page: data.page + 1 })}
            disabled={!data.hasNext}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}