import api from "@/shared/configs/axios.config";
import { Comment } from "../models/comment";
import { PageResponse } from "@/shared/models/page-response";

export class CommentService {
    public static async createComment(comment : Comment) : Promise<Comment>{
        try {
            const response = await api.post('/comments', comment);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async deleteComment (commentId : number) : Promise<void> {
        try {
            await api.delete(`/comments/${commentId}`);
        } catch (error) {
            throw error;
        }
    }

    public static async getCommentsByPostId (postId : number) : Promise<PageResponse<Comment>> {
        try {
            const response = await api.get('/comments/post/' + postId);
            return response.data ;
        } catch (error) {
            throw error ;
        }
    }
}