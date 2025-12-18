export function formatVND(value: number): string {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("vi-VN");
}