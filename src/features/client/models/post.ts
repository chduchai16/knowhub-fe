import { Media } from "./media";
import { Tag } from "./tag";

export interface Post {
    id? : number ; 
    userId ?: number ;
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