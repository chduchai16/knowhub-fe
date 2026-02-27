export interface Media {
    id : number ;
    url : string ;
    type : "IMAGE" | "VIDEO" | "FILE" ;
    ownerType : "POSST" | "USER" | "COMMENT" | "MESSAGE" ;
}