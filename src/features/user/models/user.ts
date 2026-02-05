export interface User {
    id? : number ;
    username : string ;
    email ?: string | null ;
    fullName ?: string | null ;
    bio? : string | null ;
    avatarUrl ? : string | null ;
    backgroundUrl ? : string | null ;
    status : string ;
    roleId : number ;
    roleName?: string | null ;
    followerQuantity?: number | null ;
    followingQuantity?: number | null ;
    postQuantity?: number | null ;
    gender ?: string | null ;
    dateOfBirth ?: string | null ;
    createdAt? : string | null ;
    updatedAt ?: string | null ;
    password?: string | null ;
    isFollowing?: boolean ;
}