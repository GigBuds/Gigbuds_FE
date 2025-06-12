export interface Application {
    accountId: string;
    id: string;
    jobPostId: string;
    firstName: string;
    lastName: string;
    cvUrl?: string;
    appliedAt: string;
    skillTags: string[];
    jobPosition: string;
    applicationStatus: string;
}

export interface ApplicationsResponse {
    data: Application[];
    items: Application[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    success: boolean;
    message?: string;
}