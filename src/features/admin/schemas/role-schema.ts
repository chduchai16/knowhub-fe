import { z } from "zod";

export const roleSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Tên vai trò không được để trống"),
    permissionNames: z.array(z.string()).nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;
