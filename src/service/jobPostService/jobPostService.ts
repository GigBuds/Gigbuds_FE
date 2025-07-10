import fetchApi from "@/api/api";
import { CreateJobPostRequest, GetJobPostsParams, JobPost, JobPostsResponse, UpdateJobPostRequest } from "@/types/jobPostService";

interface JobPositionResponse {
  id: number;
  jobPositionName: string;
  jobTypeId: number;
  jobTypeName: string;
}

class JobPostApi {
  
  async getJobPosts(params: GetJobPostsParams = {}): Promise<JobPostsResponse> {
    try {
      const { pageSize = 10, pageIndex = 1, employerId, status, search, sortBy, sortOrder  } = params;      
      const queryParams = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageIndex: pageIndex.toString(),
        employerId: employerId ?? '',
        status: status ?? '',
        search: search ?? '',
        sortBy: sortBy ?? 'createdAt',
        sortOrder: sortOrder ?? 'desc',
      });

      const response = await fetchApi.get(`job-posts?${queryParams.toString()}`);
      console.log('Get job posts API response:', response);
      
      return response;
    } catch (error) {
      console.error('Get job posts API error:', error);
      throw error;
    }
  }

  async getJobPostById(id: string): Promise<JobPost> {
    try {
      const response = await fetchApi.get(`job-posts/${id}`);
      console.log('Get job post by ID API response:', response);
      
      return response;
    } catch (error) {
      console.error('Get job post by ID API error:', error);
      throw error;
    }
  }

  async createJobPost(data: CreateJobPostRequest): Promise<JobPost> {
    try {
      console.log('Create job post API request:', data);
      const response = await fetchApi.post('job-posts', data);
      
      return response;
    } catch (error) {
      console.error('Create job post API error:', error);
      throw error;
    }
  }

  async updateJobPost(id: string, data: UpdateJobPostRequest): Promise<{ success: boolean }> {
    try {
      const response = await fetchApi.put(`job-posts/${id}`, data);
      console.log('Update job post API response:', response);
      
      // Handle 204 No Content response
      if (response.status === 204) {
        return { success: true };
      }
      
      // For other successful responses, parse JSON
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update job post API error:', error);
      throw error;
    }
  }

  async updateJobPostStatus(id: string, status: string): Promise<{ success: boolean }> {
    try {
      const response = await fetchApi.put(`job-posts/${id}/status`, {
        status: status,
      });
      console.log('Toggle job post status API response:', response);
      
      return { success: true };
    } catch (error) {
      console.error('Toggle job post status API error:', error);
      throw error;
    }
  }

  // Helper method to get job posts by user
  async getJobPostsByUser(userId: string, params: GetJobPostsParams = {}): Promise<JobPostsResponse> {
    try {
      const { pageSize = 10, pageIndex = 1 } = params;
      
      const queryParams = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageIndex: pageIndex.toString(),
        userId: userId,
      });

      const response = await fetchApi.get(`job-posts/user?${queryParams.toString()}`);
      console.log('Get job posts by user API response:', response);
      
      return response;
    } catch (error) {
      console.error('Get job posts by user API error:', error);
      throw error;
    }
  }

  // Helper method to search job posts
  async searchJobPosts(searchTerm: string, params: GetJobPostsParams = {}): Promise<JobPostsResponse> {
    try {
      const { pageSize = 10, pageIndex = 1 } = params;
      
      const queryParams = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageIndex: pageIndex.toString(),
        search: searchTerm,
      });

      const response = await fetchApi.get(`job-posts/search?${queryParams.toString()}`);
      console.log('Search job posts API response:', response);
      
      return response;
    } catch (error) {
      console.error('Search job posts API error:', error);
      throw error;
    }
  }
  
  // Get job position by position ID - returns single position
  async getJobPositionsByPositionId(positionId: string): Promise<JobPositionResponse> {
    try {
      const response = await fetchApi.get(`job-positions/${positionId}`);
      console.log('Get job position by position ID API response:', response);
      
      return response;
    } catch (error) {
      console.error('Get job position by position ID API error:', error);
      throw error;
    }
  }

  // Get all job positions for dropdown - returns array of positions
  async getAllJobPositions(): Promise<JobPositionResponse[]> {
    try {
      const response = await fetchApi.get('job-positions');
      console.log('Get all job positions API response:', response);
      
      return response;
    } catch (error) {
      console.error('Get all job positions API error:', error);
      throw error;
    }
  }
}

export const jobPostApi = new JobPostApi();
