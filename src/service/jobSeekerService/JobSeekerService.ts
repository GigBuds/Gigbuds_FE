/* eslint-disable @typescript-eslint/no-explicit-any */
import fetchApi from '@/api/api';

export interface JobSeeker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: string;
  skillTags: Array<{
    id: string;
    skillName: string;
    level?: string;
  }>;
  accountExperienceTags: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  educationalLevels: Array<{
    id: string;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

class JobSeekerService {
  private handleApiResponse<T>(response: any): ApiResponse<T> {
    try {
      if (response.success !== undefined) {
        return response;
      }
      
      // If response doesn't have success field, assume it's successful data
      return {
        success: true,
        data: response,
        message: 'Operation completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get job seeker by ID
   */
  async getJobSeekerById(id: string): Promise<ApiResponse<JobSeeker>> {
    try {
      const response = await fetchApi.get(`job-seekers/${id}`);
      return this.handleApiResponse<JobSeeker>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job seeker',
      };
    }
  }
}

// Export a singleton instance
const jobSeekerService = new JobSeekerService();
export default jobSeekerService;