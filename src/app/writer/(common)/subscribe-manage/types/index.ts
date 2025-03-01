export interface SubscribeSearchParams {
    columnId?: string;
    userId?: string | null;
    status?: number;
    startDate?: string | null;
    endDate?: string | null;
    currentPage?: number;
    pageSize?: number;
}