import Link from "next/link";

export default function HomePage() {
  return (
    <main className="py-10">
      <h1 className="text-3xl font-bold">Chào mừng đến Shoply</h1>
      <p className="mt-2 text-gray-600">Catalog, giỏ hàng, đơn hàng, admin CRUD.</p>
      <div className="mt-6 flex gap-4 underline">
        <Link href="/shop">Shop</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </main>
  );
}