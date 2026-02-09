export interface Comment {
    id?: number ;
    userId?: number ;
    username?: string ;
    userAvatarUrl?: string ;
    postId: number ;
    parentId?: number | null ;
    content: string ;
    createdAt?: string ;
    updatedAt?: string ;
    rootId : number | null ;
    replyQuantity?: number ;
}