import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata: Metadata = { title: "Shop — Shoply" };

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // Breadcrumb đơn giản dựa vào pathname (chỉ để demo; bài sau sẽ có router tốt hơn)
  const pathname = (await headers()).get("x-pathname") || "/shop"; // fallback
  const isDetail = pathname.startsWith("/shop/") && pathname.split("/").length > 2;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <nav className="text-sm text-gray-500">
          <Link className="underline" href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link className="underline" href="/shop">Shop</Link>
          {isDetail && <span className="mx-2">/</span>}
          {isDetail && <span className="text-gray-700">Chi tiết</span>}
        </nav>
      </div>
      {children}
    </section>
  );
}