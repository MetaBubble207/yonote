export interface PostSearchParams {
    columnId: string;
    title?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
    currentPage?: number;
    pageSize?: number;
    isTop?: boolean;
    isFree?: boolean;
}