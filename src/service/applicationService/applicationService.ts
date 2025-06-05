import fetchApi from "@/api/api";
import { Application, ApplicationsResponse } from "@/types/applicationService";

class ApplicationApi {
    async getApplicationsByJobPostId(jobPostId: string): Promise<ApplicationsResponse> {
        try {
            const response = await fetchApi.get(`job-applications/job/${jobPostId}`);
            console.log('Get applications by job post ID API response:', response);
            
            return response;
        } catch (error) {
            console.error('Get applications by job post ID API error:', error);
            throw error;
        }
    }

    async getApplicationById(applicationId: string): Promise<Application> {
        try {
            const response = await fetchApi.get(`job-applications/${applicationId}`);
            console.log('Get application by ID API response:', response);
            
            return response;
        } catch (error) {
            console.error('Get application by ID API error:', error);
            throw error;
        }
    }

    async updateApplicationStatus(applicationId: string, status: string): Promise<Application> {
        try {
            const response = await fetchApi.put(`job-applications/${applicationId}/status`, { status });
            console.log('Update application status API response:', response);
            
            return response;
        } catch (error) {
            console.error('Update application status API error:', error);
            throw error;
        }
    }
}

export const applicationApi = new ApplicationApi();