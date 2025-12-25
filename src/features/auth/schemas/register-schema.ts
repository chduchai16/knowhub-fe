import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
