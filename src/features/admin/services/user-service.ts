import api from "@/shared/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { User } from "../models/user";
import { GetUsersParams } from "../models/get-user-params";

export class UserService {

    static async getPagedUsers(params: GetUsersParams = {}): Promise<PageResponse<User>> {
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
        const url = `/users${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        const response = await api.get(url);
        return response.data;
    }

    static async getUserById(id: string): Promise<User> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    }

    static async updateUser(user: User): Promise<User> {
        const response = await api.put(`/users`, user);
        return response.data;
    }

    static async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    }
}