export interface PageResponse<T> {
    content: T[];
    info: {
        totalPages: number;
        totalElements: number;
        currentPage: number;
        pageSize: number;
    };
}