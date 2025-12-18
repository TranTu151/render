import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="py-10 text-center">
      <h2 className="text-xl font-semibold">Không tìm thấy sản phẩm</h2>
      <p className="text-gray-600 mt-2">Có thể đường dẫn sai hoặc sản phẩm đã bị xoá.</p>
      <div className="mt-4">
        <Link href="/shop" className="underline">← Về trang Shop</Link>
      </div>
    </div>
  );
}