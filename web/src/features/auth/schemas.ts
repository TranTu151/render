import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng nhập xác nhận mật khẩu"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;