export interface User {
    id? : number ;
    username : string ;
    email : string ;
    fullName : string ;
    bio? : string ;
    avatarUrl ? : string ;
    backgroundUrl ? : string ;
    status : string ;
    roleId : number ;
    roleName : string ;
    followerQuantity?: number ;
    followingQuantity?: number ;
    postQuantity?: number ;
    gender : string  ;
    dateOfBirth : string ;
    createdAt? : string ;
    updatedAt ?: string ;
}