import api from "@/shared/configs/axios.config";
import { Permission } from "../models/permission";

export class PermissionService {
    static async getPagedPermissions(page: number = 0, limit: number = 10, keyword: string = ""): Promise<any> {
        const response = await api.get("/permissions", {
            params: {
                page,
                limit,
                keyword,
            },
        });
        return response.data;
    }

    static async getAllPermissions(): Promise<Permission[]> {
        const response = await api.get("/permissions/all");
        return response.data;
    }

    static async createPermission(permission: Permission): Promise<Permission> {
        const response = await api.post("/permissions", permission);
        return response.data;
    }

    static async updatePermission(permission: Permission): Promise<Permission> {
        const response = await api.put("/permissions", permission);
        return response.data;
    }

    static async deletePermission(id: number): Promise<void> {
        await api.delete(`/permissions/${id}`);
    }
}
