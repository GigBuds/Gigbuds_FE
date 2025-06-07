"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { jobPostApi } from "@/service/jobPostService/jobPostService";
import { JobPost } from "@/types/jobPostService";
import { useRouter } from 'next/navigation';
import JobPostDialog from "@/components/JobPostDialog/JobPostDialog";
import { useLoading } from '@/contexts/LoadingContext';
import Pagination from "@/components/Pagination/Pagination";

const ManageJobPost = () => {
  const [jobPostings, setJobPostings] = useState<JobPost[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const pageSize = 6;

  interface FetchJobPostsParams {
    pageSize: number;
    pageIndex: number;
    employerId: string;
  }

  interface JobPostApiResponse {
    items?: JobPost[];
  }

  const fetchJobPosts = useCallback(async (employerId: string, page: number = 1): Promise<void> => {
    try {
      setIsLoading(true);
      const response: JobPostApiResponse = await jobPostApi.getJobPosts({
        pageSize: pageSize,
        pageIndex: page,
        employerId: employerId,
      } as FetchJobPostsParams);
      if (response) {
        console.log('Raw API response:', JSON.stringify(response.items, null, 2));
        setJobPostings(response.items || []);
        console.log('Job posts fetched successfully:', response.items);
      } else {
        console.error('No job posts found in the response');
      }
    } catch (error: unknown) {
      console.error('Failed to fetch job posts:', error);
    } finally {
      setTimeout((): void => {
        setIsLoading(false);
      }, 1500);
    }
  }, [setIsLoading, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      setPageIndex(newPage);
      const accountId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accountId="))
        ?.split("=")[1];
      if (accountId) {
        fetchJobPosts(accountId, newPage);
      }
    }
  };

  React.useEffect(() => {
    const accountId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accountId="))
      ?.split("=")[1];
    if (!accountId) {
      router.push("/login");
      return;
    }

    fetchJobPosts(accountId, pageIndex);
  }, [fetchJobPosts, router, pageIndex]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý tin tuyển dụng</h1>
        <div className="text-sm text-gray-600 mt-1">
          Trang {pageIndex} - Hiển thị {jobPostings.length} tin tuyển dụng
        </div>
      </div>

      {/* Job posts grid */}
      <div className="w-full flex flex-wrap gap-6">
        {jobPostings.map((job) => (
          <div
            key={job.id}
            className="bg-white border-l-2 border-blue-500 col-span-1 w-[30%] px-[2%] rounded-lg shadow-xl mb-4"
          >
            <div className="flex flex-row border-b-1 justify-between w-full items-center py-[3%]">
              <h2 className="text-md font-semibold truncate w-[70%]">
                {job.jobTitle || 'Không có tiêu đề'}
              </h2>
              <div className="flex flex-col items-center w-[25%]">
                <p className="text-gray-600 text-xs justify-center items-center flex py-[4%] px-[8%] rounded-2xl bg-amber-500">
                  {job.status === 'active' ? 'Đang tuyển' : 'Đã đóng'}
                </p>
              </div>
            </div>
            <div className="flex pt-[6%] pb-[2%] flex-col">
              <div className="flex flex-row justify-start gap-[3%] items-center">
                <div className="text-gray-600 flex flex-row gap-1 text-center items-center">
                  <p className="text-sm font-bold text-blue-700">
                    {job.applicationsCount || 0}
                  </p>
                  <p className="text-xs">ứng viên</p>
                </div>
                <div className="text-gray-600 flex flex-row gap-1 text-center items-center">
                  <p className="text-sm font-bold text-blue-700">0</p>
                  <p className="text-xs">lượt xem</p>
                </div>
                <div className="text-gray-600 flex flex-row gap-1 text-center items-center">
                  <p className="text-xs font-bold text-blue-700">0</p>
                  <p className="text-xs">đánh giá</p>
                </div>
              </div>
              
              {/* Debug section - remove this after fixing */}
              <div className="text-xs text-gray-400 py-2">
                Location: {job.jobLocation}
                <br />
                Salary: {(job.salary)?.toLocaleString() } / {job.salaryUnit}
              </div>
              
              <div className="flex flex-row justify-between pt-[3%] items-end w-full">
                <motion.div
                  className="w-[45%] text-sm rounded-md bg-orange-500 text-white text-center py-1  cursor-pointer"
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => {
                    router.push(`/manage-job-post/${job.id}`);
                  }}
                >
                  Xem hồ sơ ứng viên
                </motion.div>
                
                <JobPostDialog 
                  job={job}
                  API_KEY={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                  MAP_ID={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || ""}
                >
                  <motion.div
                    className="w-[45%] text-sm rounded-md bg-blue-600 text-white text-center py-1 cursor-pointer"
                    initial={{ scale: 1 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    Xem tin tuyển dụng
                  </motion.div>
                </JobPostDialog>
              </div>
            </div>

            <div className="flex flex-row items-center border-t-1 py-[1%]">
              <div className="w-[66%]">
                <CountdownTimer expireTime={job.expireTime} />
              </div>
              <div className="w-[33%] justify-end flex">
                <p className="text-gray-600 text-xs">
                  {job.expireTime
                    ? new Date(job.expireTime).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {jobPostings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 text-lg mb-2">Không có tin tuyển dụng nào</div>
          <div className="text-gray-500 text-sm">Hãy tạo tin tuyển dụng đầu tiên của bạn</div>
        </div>
      )}

      {/* Pagination */}
      <div className="bottom-0 right-20 fixed items-center justify-center  py-4 ">
<Pagination
        currentPage={pageIndex}
        hasItems={jobPostings.length > 0}
        itemsCount={jobPostings.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      </div>

      
    </div>
  );
};

type CountdownTimerProps = {
  expireTime: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expireTime }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expire = new Date(expireTime);
      const diff = expire.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Đã hết hạn");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days} ngày ${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTime]);

  return (
    <div className="text-xs items-center justify-center flex text-gray-500">
      {timeLeft}
    </div>
  );
};

export default ManageJobPost;
