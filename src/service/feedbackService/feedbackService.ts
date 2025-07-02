import fetchApi from "@/api/api";

export interface CreateFeedbackDto {
    jobSeekerId: number;
    employerId: number;
    jobHistoryId: number;
    rating: number;
    comment: string;
    feedbackType: FeedbackType;
}

export interface FeedbackDto {
    id: number;
    employerId: number;
    employerName: string;
    companyName: string;
    companyLogo: string;
    accountName: string;
    accountAvatar: string;
    feedbackType: FeedbackType;
    rating: number;
    comment: string;
    createdAt: string;
    jobTitle: string;
}

export enum FeedbackType {
    EmployerToJobSeeker = 0,
    JobSeekerToEmployer = 1
}

export interface FeedbackResponse {
    success: boolean;
    data?: FeedbackDto;
    message?: string;
}

export interface FeedbacksResponse {
    success: boolean;
    data?: FeedbackDto[];
    message?: string;
}

class FeedbackApi {
    async createFeedback(feedback: CreateFeedbackDto): Promise<FeedbackResponse> {
        try {
            const response = await fetchApi.post('feedbacks', feedback);
            console.log('Create feedback API response:', response);
            
            return {
                success: true,
                data: response.data,
                message: response.message
            };
        } catch (error) {
            console.error('Create feedback API error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred while creating feedback'
            };
        }
    }

    async getFeedbacksByJobSeekerId(jobSeekerId: string): Promise<FeedbacksResponse> {
        try {
            const response = await fetchApi.get(`feedbacks/job-seeker/${jobSeekerId}`);
            console.log('Get feedbacks by job seeker ID API response:', response);
            
            return {
                success: true,
                data: response,
                message: 'Feedbacks retrieved successfully'
            };
        } catch (error) {
            console.error('Get feedbacks by job seeker ID API error:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : 'An error occurred while fetching feedbacks'
            };
        }
    }

    async getFeedbacksByEmployerId(employerId: string): Promise<FeedbacksResponse> {
        try {
            const response = await fetchApi.get(`feedbacks/employer/${employerId}`);
            console.log('Get feedbacks by employer ID API response:', response);
            
            return {
                success: true,
                data: response,
                message: 'Feedbacks retrieved successfully'
            };
        } catch (error) {
            console.error('Get feedbacks by employer ID API error:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : 'An error occurred while fetching feedbacks'
            };
        }
    }

    async getFeedbacksByAccountId(accountId: string, feedbackType: FeedbackType): Promise<FeedbacksResponse> {
        try {
            const feedbackTypeString = FeedbackType[feedbackType];
            const response = await fetchApi.get(`feedbacks/account/${accountId}?feedbackType=${feedbackTypeString}`);
            console.log('Get feedbacks by account ID API response:', response);
            
            return {
                success: true,
                data: response.data || response,
                message: 'Feedbacks retrieved successfully'
            };
        } catch (error) {
            console.error('Get feedbacks by account ID API error:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : 'An error occurred while fetching feedbacks'
            };
        }
    }

    async getAllFeedbacks(feedbackType: FeedbackType): Promise<FeedbacksResponse> {
        try {
            const feedbackTypeString = FeedbackType[feedbackType];
            const response = await fetchApi.get(`feedbacks?feedbackType=${feedbackTypeString}`);
            console.log('Get all feedbacks API response:', response);
            
            return {
                success: true,
                data: response.data || response,
                message: 'Feedbacks retrieved successfully'
            };
        } catch (error) {
            console.error('Get all feedbacks API error:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : 'An error occurred while fetching feedbacks'
            };
        }
    }

    async getFeedbackById(feedbackId: string): Promise<FeedbackResponse> {
        try {
            const response = await fetchApi.get(`feedbacks/${feedbackId}`);
            console.log('Get feedback by ID API response:', response);
            
            return {
                success: true,
                data: response.data || response,
                message: 'Feedback retrieved successfully'
            };
        } catch (error) {
            console.error('Get feedback by ID API error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred while fetching feedback'
            };
        }
    }
}

export const feedbackApi = new FeedbackApi(); 