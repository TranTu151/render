import { NextResponse } from "next/server";
import { PRODUCTS } from "@/mock/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") || "12", 10), 1);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  let list = PRODUCTS;
  if (q) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.brand?.toLowerCase().includes(q) ?? false) ||
      (p.category?.toLowerCase().includes(q) ?? false)
    );
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = list.slice(start, end);
  const hasNext = end < total;

  return NextResponse.json({ data, page, limit, total, hasNext });
}