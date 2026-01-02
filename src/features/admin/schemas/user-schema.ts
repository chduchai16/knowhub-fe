import { z } from "zod";

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().nullable().optional(),
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
})
export type UserSchema = z.infer<typeof userSchema>