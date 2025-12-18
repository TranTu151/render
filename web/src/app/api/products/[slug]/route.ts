import { NextResponse } from "next/server";
import { PRODUCTS } from "@/mock/products";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}