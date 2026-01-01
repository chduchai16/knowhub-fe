export interface GetUsersParams {
    page?: number;
    limit?: number;
    keyword?: string;
    roleId?: number;
    userStatus?: string;
    [key: string]: string | number | undefined;
}