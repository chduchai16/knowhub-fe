import { Media } from "@/shared/models/media";

export interface Message {
    id? : number ;
    senderId : number ;
    senderName? : string ;
    senderAvatarUrl? : string ;
    receiverId : number ;
    receiverName? : string ;
    receiverAvatarUrl? : string ;
    content : string ;
    conversationId? : number ;
    medias? : Media[] ;
    isDeleted? : boolean ;
    createdAt? : string ;
    updatedAt? : string ;
}