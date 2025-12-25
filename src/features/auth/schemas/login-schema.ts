import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Tên đăng nhập không được để trống"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  remember: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
