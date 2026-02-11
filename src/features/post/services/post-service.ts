import { PageResponse } from "@/shared/models/page-response";
import { Post } from "../models/post";
import api from "@/shared/configs/axios.config";

export class PostService {
    static async getPagedPostsOfUser(page: number, limit: number, username: string): Promise<PageResponse<Post>> {
        try {
            const response = await api.get("/posts", {
                params: {
                    page,
                    limit,
                    username,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getPagedPosts(page: number, limit: number, keyword: string): Promise<PageResponse<Post>> {
        try {
            const response = await api.get("/posts", {
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

    static async getNewFeeds(page: number, limit: number): Promise<PageResponse<Post>> {
        try {
            const response = await api.get("/posts/feeds", {
                params: {
                    page,
                    limit,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createPost(post: Post): Promise<Post> {
        try {
            const response = await api.post("/posts", post);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deletePost(postId: number): Promise<void> {
        try {
            await api.delete(`/posts/${postId}`);
        } catch (error) {
            throw error;
        }
    }

    static async updatePost(postId: number, post: Post): Promise<Post> {
        try {
            const response = await api.put(`/posts/${postId}`, post);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getPostById(postId: number | string): Promise<Post> {
        try {
            const response = await api.get(`/posts/${postId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
