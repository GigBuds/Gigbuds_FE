import { JobPostCreate } from "@/types/jobPost/jobPost";

import fetchApi from "@/api/api";

class JobPostService {
    async createJobPost(jobPost: JobPostCreate) {
      const url = "https://localhost:7290/api/v1/job-posts";
      const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobPost),
    });
        return response.json();
    }
}

const jobPostApi = new JobPostService();
export default jobPostApi;
