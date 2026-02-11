import api from "@/shared/configs/axios.config";
import { Permission } from "../models/permission";

export class PermissionService {
    static async getPagedPermissions(page: number = 0, limit: number = 10, keyword: string = ""): Promise<any> {
        try {
            const response = await api.get("/permissions", {
                params: {
                    page,
                    limit,
                    keyword,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAllPermissions(): Promise<Permission[]> {
        try {
            const response = await api.get("/permissions/all");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createPermission(permission: Permission): Promise<Permission> {
        try {
            const response = await api.post("/permissions", permission);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updatePermission(permission: Permission): Promise<Permission> {
        try {
            const response = await api.put("/permissions", permission);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deletePermission(id: number): Promise<void> {
        try {
            await api.delete(`/permissions/${id}`);
        } catch (error) {
            throw error;
        }
    }
}
