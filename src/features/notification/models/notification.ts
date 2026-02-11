export interface Notification {
    id : number ;
    notificationType : string ;
    title : string ;
    content : string ;
    
    // thông tin người thao tác
    actorId : number ;
    actorUsername : string ;
    actorAvatarUrl : string ;

    // thông tin tham chiếu
    referenceId : number ;
    referenceType : string ;

    // trạng thái đọc 
    isRead : boolean ;
    readAt : string | null ;
    createdAt : string ;

    type : string ;
    postId ?: number ;
}