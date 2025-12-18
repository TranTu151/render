import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schemas";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Payload không hợp lệ", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true, user: { email: parsed.data.email } });
}