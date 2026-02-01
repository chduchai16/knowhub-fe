import api from "@/shared/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { GetRolesParams } from "../models/get-page-role-params";
import { Role } from "../models/role";

export class RoleService {
    static async getPagedRoles(params: GetRolesParams = {}): Promise<PageResponse<Role>> {
        const queryParams: Record<string, string> = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "page" && typeof value === "number") {
                    queryParams[key] = String(value - 1);
                } else {
                    queryParams[key] = String(value);
                }
            }
        });

        const searchParams = new URLSearchParams(queryParams);
        const url = `/roles${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        const response = await api.get(url);
        return response.data;
    }

    static async getRoleById(id: string): Promise<Role> {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    }

    static async updateRole(role: Role): Promise<Role> {
        const response = await api.put(`/roles`, role);
        return response.data;
    }

    static async createRole(role: Partial<Role>): Promise<Role> {
        const response = await api.post(`/roles`, role);
        return response.data;
    }

    static async deleteRole(id: string): Promise<void> {
        await api.delete(`/roles/${id}`);
    }
}