import { PageResponse } from "@/shared/models/page-response";
import { Post } from "../models/post";
import api from "@/shared/configs/axios.config";

export class PostService {
    
    public static async getPagedPostsOfUser(page : number , limit : number , username : string) : Promise<PageResponse<Post>> {
        try {
            const response = await api.get('/posts' , {
                params : {
                    page : page,
                    limit : limit,
                    username : username
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}