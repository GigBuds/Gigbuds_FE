"use server";
import { JobPostCreate } from "@/types/jobPost/jobPost";
import jobPostApi from "@/service/jobPostService/jobPostService";

export async function createJobPost(jobPost: JobPostCreate) {
    await jobPostApi.createJobPost(jobPost);
}