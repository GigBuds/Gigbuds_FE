import fetchApi from "@/api/api";
import {  ApplicationsResponse, SingleApplicationResponse } from "@/types/applicationService";

class ApplicationApi {
    async getApplicationsByJobPostId(jobPostId: string): Promise<ApplicationsResponse> {
        try {
            const response = await fetchApi.get(`job-applications/job/${jobPostId}`);
            const data = await response;
            console.log('Get applications by job post ID API response:', data);
            
            return data;
        } catch (error) {
            console.error('Get applications by job post ID API error:', error);
            throw error;
        }
    }

    async getApplicationById(applicationId: string): Promise<SingleApplicationResponse> {
        try {
            const response = await fetchApi.get(`job-applications/${applicationId}`);
            const data = await response.json();
            console.log('Get application by ID API response:', data);
            
            return data;
        } catch (error) {
            console.error('Get application by ID API error:', error);
            throw error;
        }
    }

    async updateApplicationStatus(applicationId: string, status: string): Promise<SingleApplicationResponse> {
        try {
            const response = await fetchApi.put(`job-applications/${applicationId}/status`, { status });
            const data = await response.json();
            console.log('Update application status API response:', data);
            
            return data;
        } catch (error) {
            console.error('Update application status API error:', error);
            throw error;
        }
    }
}

export const applicationApi = new ApplicationApi();