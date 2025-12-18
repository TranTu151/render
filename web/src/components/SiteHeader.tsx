"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/app/lib/cn";
import CartIndicator from "@/components/CartIndicator";

export default function SiteHeader() {
  const pathname = usePathname();
  const [q, setQ] = useState("");

  const Nav = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-lg hover:underline",
        pathname === href && "font-semibold underline"
      )}
    >
      {children}
    </Link>
  );
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <Link href="/" className="font-bold">Shoply</Link>
        <nav className="flex gap-2 ml-auto">
          <Nav href="/shop">Shop</Nav>
          <CartIndicator />
          <Nav href="/admin">Admin</Nav>
          <Nav href="/login">Login</Nav>
          <Nav href="/register">Register</Nav>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="h-9 px-3 rounded-md border text-sm"
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>
      </div>
    </header>
  );
}