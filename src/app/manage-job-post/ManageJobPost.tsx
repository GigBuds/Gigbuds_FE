"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ManageApplication from "../manage-application/ManageApplication";

// Define the Job type
interface Job {
  id: number;
  title: string;
  status: string;
  numberOfApplicants: number;
  numberOfViews: number;
  numberOfFeedbacks: number;
  expireTime: string;
}

const ManageJobPost = () => {
  const [viewNumberOfApplicants, setViewNumberOfApplicants] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Fixed: added proper typing

  const jobPostings: Job[] = [
    {
      id: 1,
      title: "Software Engineersadsaddddddddddddddddddddddddddddddddddddddddd",
      status: "Đang tuyển",
      numberOfApplicants: 5,
      numberOfViews: 100,
      numberOfFeedbacks: 2,
      expireTime: "2025-12-29T23:59:59Z",
    },
    {
      id: 2,
      title: "Product Manager",
      status: "Đã đóng",
      numberOfApplicants: 3,
      numberOfViews: 80,
      numberOfFeedbacks: 1,
      expireTime: "2024-11-15T23:59:59Z",
    },
    {
      id: 3,
      title: "UX Designer",
      status: "Đang tuyển",
      numberOfApplicants: 10,
      numberOfViews: 150,
      numberOfFeedbacks: 5,
      expireTime: "2025-10-01T23:59:59Z",
    },
    {
      id: 4,
      title: "Data Scientist",
      status: "Đã đóng",
      numberOfApplicants: 2,
      numberOfViews: 60,
      numberOfFeedbacks: 0,
      expireTime: "2025-09-30T23:59:59Z",
    },
    // Add more job postings as needed
  ];

  if (viewNumberOfApplicants) {
    return (
      <ManageApplication
        setViewNumberOfApplicants={setViewNumberOfApplicants}
        selectedJob={selectedJob}
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col ">
      <div className=" w-full flex flex-wrap gap-6 ">
        {jobPostings.map((job) => (
          <div
            key={job.id}
            className="bg-white border-l-2 border-blue-500 col-span-1 w-[30%] px-[2%] rounded-lg shadow-xl mb-4"
          >
            <div className="flex flex-row border-b-1 justify-between w-full items-center py-[3%]">
              <h2 className="text-md font-semibold truncate w-[70%]">
                {job.title}
              </h2>
              <div className="flex flex-col items-center w-[25%]">
                <p className="text-gray-600 text-xs justify-center items-center flex py-[4%] px-[8%] rounded-2xl bg-amber-500">
                  {job.status}
                </p>
              </div>
            </div>
            <div className="flex pt-[6%] pb-[2%] flex-col">
              <div className="flex flex-row justify-start gap-[3%] items-center">
                <div className="text-gray-600 flex flex-row gap-1 text-center items-center">
                  <p className="text-sm font-bold text-blue-700">
                    {job.numberOfApplicants} 
                  </p>
                  <p className="text-xs"> ứng viên</p>
                </div>
                <div className="text-gray-600 flex flex-row gap-1  text-center items-center ">
                  <p className="text-sm font-bold text-blue-700">
                    {job.numberOfViews}{" "}
                  </p>
                  <p className="text-xs">lượt xem</p>
                </div>
                <div className="text-gray-600 flex flex-row gap-1  text-center items-center">
                  <p className="text-xs font-bold text-blue-700">
                    {job.numberOfFeedbacks}{" "}
                  </p>
                  <p className="text-xs">đánh giá</p>
                </div>
              </div>
              <div className="flex flex-row justify-between pt-[3%] items-end w-full">
                <motion.div
                  className="w-[45%] text-sm rounded-md bg-orange-500 text-white text-center py-1 cursor-pointer "
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => {
                    setViewNumberOfApplicants(true);
                    setSelectedJob(job);
                  }}
                >
                  Xem hồ sơ ứng viên
                </motion.div>
                  <motion.div
                    className="w-[45%] text-sm rounded-md bg-blue-600 text-white text-center py-1 cursor-pointer "
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
              </div>
            </div>

            <div className="flex flex-row items-center border-t-1 py-[1%]">
              <div className="w-[66%]">
                <CountdownTimer expireTime={job.expireTime} />
              </div>
              <div className="w-[33%] justify-end flex">
                {" "}
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

      setTimeLeft(`${days} ngày ${hours}:${minutes}:${seconds} `);
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTime]);

  return (
    <div className="text-xs items-center justify-center flex text-gray-500 ">
      {timeLeft}
    </div>
  );
};

export default ManageJobPost;
