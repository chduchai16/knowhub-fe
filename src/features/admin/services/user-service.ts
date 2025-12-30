import api from "@/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { User } from "../models/user";

export class UserService {
    
    static async getPagedUsers(page: number, pageSize: number, search?: string, role?: string, status?: string) : Promise<PageResponse<User>>{
        let url = `/users?page=${page - 1}&limit=${pageSize}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (role) url += `&role=${encodeURIComponent(role)}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;

        const response = await api.get(url);
        return response.data;
    }
}