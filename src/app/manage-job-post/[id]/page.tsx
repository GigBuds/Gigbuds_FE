"use client";

import React, { useEffect, useState } from 'react'
import ManageApplication from './ManageApplication'
import { jobPostApi } from '@/service/jobPostService/jobPostService';
import { JobPost } from '@/types/jobPostService';
import { useParams } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        setIsLoading(true);
        const jobPost = await jobPostApi.getJobPostById(id);
        console.log('Fetched job post with status:', jobPost.status); // Debug log
        setSelectedJob(jobPost);
      } catch (error) {
        console.error('Error fetching job post:', error);
        // Fallback to basic job object if fetch fails
        setSelectedJob({
          id: parseInt(id),
          jobTitle: '',
          jobDescription: '',
          expireTime: '',
          isOutstandingPost: false,
          vacancyCount: 0,
          status: 'Open'
        } as JobPost);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJobPost();
    }
  }, [id, setIsLoading]);

  return (
    <div className='flex w-full p-5'>
      <ManageApplication selectedJob={selectedJob} />
    </div>
  )
}

export default Page