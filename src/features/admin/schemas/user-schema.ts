import { z } from "zod";

export const userSchema = z.object({
    id: z.number().optional(),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ").nullable().optional(),
    fullName: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    roleId: z.number(),
    roleName: z.string().nullable().optional(),
    followerQuantity: z.number().nullable().optional(),
    followingQuantity: z.number().nullable().optional(),
    postQuantity: z.number().nullable().optional(),
    gender: z.string().nullable().optional(),
    dateOfBirth: z.string().nullable().optional(),
    status: z.string(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type UserSchema = z.infer<typeof userSchema>;
