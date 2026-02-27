export interface Inbox {
    id : number ;
    senderId : number ;
    senderName : string ;
    senderAvatarUrl : string ;
    receiverId : number ;
    receiverName : string ;
    partnerId : number ;
    partnerName : string ;
    partnerAvatarUrl : string ;
    receiverAvatarUrl : string ;
    content : string ;
    medias : string[] ;
    createdAt : string ;
    updatedAt : string ;
}