"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/mock/products"; // Giả định path
import { calcTotals } from "@/lib/checkout";   // Giả định path
// Thêm các hàm services cần thiết
import { getProductBySlug } from "@/services/products";
import { createOrder } from "@/services/orders";

// --- Utility Types & Functions ---
type PM = "cod" | "banking" | "momo";

// Fallback format nếu bạn chưa có helper formatVND
function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// --- Main Component ---
export default function CheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // Đọc items từ URL: ?items=slug1:2,slug2:1
  const itemsParam = sp.get("items") || "";
  
  // Memoize danh sách sản phẩm đã được làm giàu (enriched products)
  const parsed = useMemo(() => {
    const list = itemsParam
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((pair) => {
        const [slug, qty] = pair.split(":");
        return { slug, quantity: Math.max(parseInt(qty || "1", 10), 1) };
      });
      
    // map sang sản phẩm mock và filter những sản phẩm không tồn tại
    const enriched = list
      .map((it) => {
        const p = PRODUCTS.find((x) => x.slug === it.slug);
        return p ? { ...it, product: p } : null;
      })
      .filter(Boolean) as { slug: string; quantity: number; product: (typeof PRODUCTS)[number] }[];
      
    return enriched;
  }, [itemsParam]);

  // Tính tổng tiền
  const totals = useMemo(() => {
    return calcTotals(parsed.map((x) => ({ price: x.product.price, quantity: x.quantity })), "");
  }, [parsed]);

  // Form state (tối giản)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // --- NEW onSubmit Logic ---
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!parsed.length) { 
      setError("Giỏ hàng trống hoặc tham số URL không hợp lệ."); 
      return; 
    }
    
    if (!name || !addr) { 
      setError("Vui lòng nhập Họ tên và Địa chỉ."); 
      return; 
    }
    
    setSubmitting(true);
    
    try {
      // 1. Lấy productId (Mongo _id) từ backend dựa trên slug
      const items = await Promise.all(
        parsed.map(async (x) => {
          // Gọi API/Service để lấy thông tin sản phẩm từ backend
          const beProduct = await getProductBySlug(x.product.slug); 
          if (!beProduct?._id) {
             throw new Error(`Product with slug ${x.product.slug} not found in DB`);
          }
          // Gửi productId (Mongo _id) và quantity
          return { productId: beProduct._id, quantity: x.quantity }; 
        })
      );

      // 2. Chuẩn bị payload
      const payload = {
        customerName: name,
        customerPhone: phone,
        customerAddress: addr,
        paymentMethod: pm,
        note,
        items, // Chứa productId (Mongo _id) và quantity
      };

      // 3. Gọi service tạo đơn hàng
      const j = await createOrder(payload);
      
      setResult(j.order);
      // Tuỳ chọn: router.replace(`/order/${j.order.id}`); 
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  }

  // --- Render Component ---
  return (
    <section className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Thanh toán (giả lập)</h1>

        {/* Tóm tắt giỏ hàng */}
        <div className="mb-6 border rounded-xl p-4">
          <h2 className="font-medium mb-3">Tóm tắt giỏ hàng</h2>
          {parsed.length === 0 ? (
            <p className="text-gray-500">
              Chưa có sản phẩm. Quay lại{" "}
              <button type="button" className="underline" onClick={() => router.push("/shop")}>
                Shop
              </button>
            </p>
          ) : (
            <ul className="space-y-2">
              {parsed.map((x) => (
                <li key={x.slug} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={x.product.images?.[0] || "/placeholder.png"}
                      alt={x.product.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{x.product.title}</p>
                      <p className="text-sm text-gray-500">SL: {x.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">{formatVND(x.product.price * x.quantity)}</div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 text-right text-sm text-gray-500">{parsed.length} dòng</div>
        </div>

        {/* Form thông tin */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Họ tên *</label>
            <input className="w-full border rounded-md p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label className="block text-sm mb-1">Số điện thoại</label>
            <input className="w-full border rounded-md p-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090..." />
          </div>
          <div>
            <label className="block text-sm mb-1">Địa chỉ *</label>
            <textarea className="w-full border rounded-md p-2" value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" />
          </div>

          <div>
            <label className="block text-sm mb-1">Phương thức thanh toán</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input type="radio" name="pm" value="cod" checked={pm === "cod"} onChange={() => setPM("cod")} />
                <span>COD</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="pm" value="banking" checked={pm === "banking"} onChange={() => setPM("banking")} />
                <span>Banking</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="pm" value="momo" checked={pm === "momo"} onChange={() => setPM("momo")} />
                <span>MoMo</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea className="w-full border rounded-md p-2" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button 
              type="submit" // Kích hoạt onSubmit
              disabled={submitting || parsed.length === 0} 
              className="h-10 px-4 rounded-md border bg-black text-white"
            >
              {submitting ? "Đang xử lý..." : "Đặt hàng"}
            </button>
            <button 
              type="button" 
              className="h-10 px-4 rounded-md border" 
              onClick={() => router.push("/cart")}
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </form>

        {/* Kết quả */}
        {result && (
          <div className="mt-6 border rounded-xl p-4 bg-green-50">
            <h2 className="font-medium mb-2">Đặt hàng thành công (giả lập)</h2>
            <p className="text-sm">
              Mã đơn: <b>{result.id}</b>
            </p>
            <p className="text-sm">Trạng thái: {result.status}</p>
          </div>
        )}
      </div>

      {/* Tóm tắt thanh toán */}
      <aside className="border rounded-xl p-4 h-fit">
        <h2 className="font-medium mb-3">Thanh toán</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatVND(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{formatVND(totals.shippingFee)}</span>
          </div>
        </div>
        <div className="border-t my-2" />
        <div className="flex justify-between font-semibold">
          <span>Tổng cộng</span>
          <span>{formatVND(totals.total)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-3">* Phí ship thay đổi theo địa chỉ & khuyến mãi (giả lập).</p>
      </aside>
    </section>
  );
}