import { JobPostCreate } from "@/types/jobPost/jobPost";

export async function createJobPost(jobPost: JobPostCreate) {
    const response = await fetch("/api/job-posts", {
        method: "POST",
        body: JSON.stringify(jobPost),
    });
    return response.json();
}