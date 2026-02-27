import { PageResponse } from "@/shared/models/page-response";
import { Post } from "../models/post";
import api from "@/shared/configs/axios.config";

export class PostService {
    static async getPagedPostsOfUser(page: number, limit: number, username: string): Promise<PageResponse<Post>> {
        const response = await api.get("/posts", {
            params: {
                page,
                limit,
                username,
            },
        });
        return response.data;
    }

    static async getPagedPosts(page: number, limit: number, keyword: string): Promise<PageResponse<Post>> {
        const response = await api.get("/posts", {
            params: {
                page,
                limit,
                keyword,
            },
        });
        return response.data;
    }

    static async getNewFeeds(page: number, limit: number): Promise<PageResponse<Post>> {
        const response = await api.get("/posts/feeds", {
            params: {
                page,
                limit,
            },
        });
        return response.data;
    }

    static async createPost(post: Post): Promise<Post> {
        const response = await api.post("/posts", post);
        return response.data;
    }

    static async deletePost(postId: number): Promise<void> {
        await api.delete(`/posts/${postId}`);
    }

    static async updatePost(postId: number, post: Post): Promise<Post> {
        const response = await api.put(`/posts/${postId}`, post);
        return response.data;
    }

    static async getPostById(postId: number | string): Promise<Post> {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    }
}
