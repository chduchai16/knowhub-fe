import api from "@/shared/configs/axios.config";

export class PostLikeService { 

    public static async likePost (postId : number) : Promise<number> { 
        const response = await api.post(`/posts/${postId}/likes`);
        return response.data;
    }

    public static async unlikePost (postLikeId : number ) : Promise<void> {
        await api.delete(`/posts/likes/${postLikeId}`);
    }

}