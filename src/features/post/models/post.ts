import { Media } from "./media";
import { Tag } from "@/features/tag/models/tag";

export interface Post {
    id? : number ; 
    userId ?: number ;
    userAvatarUrl ?: string ;
    username ?: string ;
    content ? : string ;
    privacy ?: string ;
    status? : string ;
    tags ?: Tag[] ;
    medias ?: Media[] ;
    mediaIds? : number[] ;
    createdAt ?: string ;
    updatedAt ?: string ;
}