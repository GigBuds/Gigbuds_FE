import fetchApi from "@/api/api";
import { CreateJobPostRequest, GetJobPostsParams, JobPost, JobPostsResponse, UpdateJobPostRequest } from "@/types/jobPostService";

class JobPostApi {
  
  async getJobPosts(params: GetJobPostsParams = {}): Promise<JobPostsResponse> {


    try {
      const { pageSize = 10, pageIndex = 1, employerId } = params;      
      const queryParams = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageIndex: pageIndex.toString(),
        employerId: employerId || '',
        
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

  async updateJobPost(id: string, data: UpdateJobPostRequest): Promise<JobPost> {
    try {
      const response = await fetchApi.put(`job-posts/${id}`, data);
      console.log('Update job post API response:', response);
      
      return response;
    } catch (error) {
      console.error('Update job post API error:', error);
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
  
}

export const jobPostApi = new JobPostApi();
