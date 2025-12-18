"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";
import { useState } from "react";

export default function RegisterPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), mode: "onChange" });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng ký thất bại");
      return;
    }
    setServerMsg("Đăng ký thành công (mock)");
  }

  const pwd = watch("password");

  return (
    <main className="py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Đăng ký</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Họ tên</label>
          <input
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            disabled={isSubmitting}
            placeholder="Nguyễn Văn A"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <label className="block text-sm font-medium">Nhập lại mật khẩu</label>
          <input
            type="password"
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            {...register("confirmPassword")}
            disabled={isSubmitting}
            placeholder="••••••"
          />
          {errors.confirmPassword && (
            <p id="confirm-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
          {pwd && !errors.confirmPassword && (
            <p className="mt-1 text-xs text-gray-500">Mẹo: dùng mật khẩu ≥ 6 ký tự</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50"
        >
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {serverMsg && <p className="text-sm mt-2">{serverMsg}</p>}
      </form>
    </main>
  );
}