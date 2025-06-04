"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { jobPostApi } from "@/service/jobPostService/jobPostService";
import { JobPost } from "@/types/jobPostService";
import { useRouter } from 'next/navigation';
import JobPostDialog from "@/components/JobPostDialog/JobPostDialog";

const ManageJobPost = () => {
  const [jobPostings, setJobPostings] = useState<JobPost[]>([]);
  const router = useRouter();
  
  const fetchJobPosts = async () => {
    try {
      const response = await jobPostApi.getJobPosts({
        pageSize: 6,
        pageIndex: 1
      });
      if (response) {
        console.log('Raw API response:', JSON.stringify(response.items, null, 2));
        setJobPostings(response.items || []);
        console.log('Job posts fetched successfully:', response.items);
      } else {
        console.error('No job posts found in the response');
      }
    } catch (error) {
      console.error('Failed to fetch job posts:', error);
    }
  };

  React.useEffect(() => {
    fetchJobPosts();
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
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
                  className="w-[45%] text-sm rounded-md bg-orange-500 text-white text-center py-1 cursor-pointer"
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
                
                <JobPostDialog job={job}>
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
