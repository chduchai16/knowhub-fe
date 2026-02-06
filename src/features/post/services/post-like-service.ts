import api from "@/shared/configs/axios.config";

export class PostLikeService { 

    public static async likePost (postId : number) : Promise<number> { 
        try {
            const response = await api.post(`/posts/${postId}/likes`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async unlikePost (postLikeId : number ) : Promise<void> {
        try {
            await api.delete(`/posts/likes/${postLikeId}`);
        } catch (error) {
            throw error ;
        }
    }

}