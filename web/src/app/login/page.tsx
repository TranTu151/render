"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";
import { useState } from "react";

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), mode: "onChange" });
  
  async function onSubmit(values: LoginValues) {
    setServerMsg(null);
    // Mock call: gửi tới Route Handler /api/auth/login
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng nhập thất bại");
      return;
    }
    setServerMsg("Đăng nhập thành công (mock)");
  }

  return (
    <main className="py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            disabled={isSubmitting}
            placeholder="ban@example.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            disabled={isSubmitting}
            placeholder="••••••"
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {serverMsg && <p className="text-sm mt-2">{serverMsg}</p>}
      </form>
    </main>
  );
}