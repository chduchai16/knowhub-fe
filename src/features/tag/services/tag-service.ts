import api from "@/shared/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { Tag } from "../models/tag";

export class TagService {
    static async getPagedTags(page: number = 0, limit: number = 10, keyword: string = ""): Promise<PageResponse<Tag>> {
        try {
            const response = await api.get("/tags", {
                params: {
                    page,
                    limit,
                    keyword
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAllTags(): Promise<Tag[]> {
        const response = await api.get("/tags/all");
        return response.data;
    }

    static async createTag(name: string): Promise<Tag> {
        const response = await api.post("/tags", { name });
        return response.data;
    }

    static async updateTag(id: number, name: string): Promise<Tag> {
        const response = await api.put(`/tags/${id}`, { name });
        return response.data;
    }

    static async deleteTag(id: number): Promise<void> {
        await api.delete(`/tags/${id}`);
    }
}
