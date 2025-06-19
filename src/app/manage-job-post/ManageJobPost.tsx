"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { jobPostApi } from "@/service/jobPostService/jobPostService";
import { JobPost } from "@/types/jobPostService";
import { useRouter } from 'next/navigation';
import JobPostDialog from "@/components/JobPostDialog/JobPostDialog";
import { useLoading } from '@/contexts/LoadingContext';
import Pagination from "@/components/Pagination/Pagination";
import { selectUser } from "@/lib/redux/features/userSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { Input } from "../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ManageJobPostProps {
  API_KEY: string;
  MAP_ID: string;
}

const ManageJobPost: React.FC<ManageJobPostProps> = ({ API_KEY, MAP_ID }) => {
  const [jobPostings, setJobPostings] = useState<JobPost[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const { setIsLoading } = useLoading();
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const pageSize = 6;

  interface FetchJobPostsParams {
    pageSize: number;
    pageIndex: number;
    employerId: string;
    search?: string;
    status?: 'Open' | 'Closed' | 'Finished' | 'Expired';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }

  interface JobPostApiResponse {
    items?: JobPost[];
  }

  const fetchJobPosts = useCallback(async (page: number = 1): Promise<void> => {
    try {
      setIsLoading(true);
      const params: FetchJobPostsParams = {
        pageSize: pageSize,
        pageIndex: page,
        employerId: user.id?.toString() ?? '',
      };

              if (debouncedSearchTerm.trim()) {
          params.search = debouncedSearchTerm.trim();
        }

      if (activeTab !== "all") {
          params.status = activeTab as 'Open' | 'Closed' | 'Finished' | 'Expired';
      }

      if (sortBy) {
        params.sortBy = sortBy;
      }

      if (sortOrder) {
        params.sortOrder = sortOrder;
      }


      const response: JobPostApiResponse = await jobPostApi.getJobPosts(params);
      if (response) {
        setJobPostings(response.items || []);
        console.log('Job posts fetched successfully:', response.items);
      } else {
        console.error('No job posts found in the response');
      }
    } catch (error: unknown) {
      console.error('Failed to fetch job posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, pageSize, user.id, activeTab, sortBy, sortOrder, debouncedSearchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      setPageIndex(newPage);
      fetchJobPosts(newPage);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPageIndex(1); 
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPageIndex(1); 
  };

  const handleSortBy = (value: string) => {
    setSortBy(value);
    setPageIndex(1); 
  };

  const handleSortOrder = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    setPageIndex(1); 
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveTab("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPageIndex(1);
  };

  // Debounce search term effect
  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 1000); 

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
      return;
    }
    fetchJobPosts(pageIndex);
  }, [fetchJobPosts, router, pageIndex, user.id]);

  // Trigger search when debounced search term or filters change
  useEffect(() => {
    if (user.id) {
      fetchJobPosts(pageIndex);
    }
  }, [debouncedSearchTerm, activeTab, sortBy, sortOrder, pageIndex, fetchJobPosts, user.id]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý tin tuyển dụng</h1>
        <div className="text-sm text-gray-600 mt-1">
          Trang {pageIndex} - Hiển thị {jobPostings.length} tin tuyển dụng
        </div>
      </div>

            {/* Search and Sort Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề công việc..."
              value={searchTerm}
              onChange={handleSearch}
              className={`pl-10 pr-4 py-2 w-full ${isSearching ? 'border-blue-300' : ''}`}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-gray-400 w-4 h-4" />
            <Select value={sortBy} onValueChange={handleSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Ngày tạo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSortOrder('asc')}
              className={`p-2 rounded-md transition-colors ${
                sortOrder === 'asc' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Tăng dần"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSortOrder('desc')}
              className={`p-2 rounded-md transition-colors ${
                sortOrder === 'desc' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Giảm dần"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || sortBy !== "createdAt" || sortOrder !== "desc") && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(debouncedSearchTerm || sortBy !== "createdAt" || sortOrder !== "desc") && (
          <div className="flex flex-wrap gap-2">
            {debouncedSearchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tìm kiếm: &ldquo;{debouncedSearchTerm}&rdquo;
              </span>
            )}
            {(sortBy !== "createdAt" || sortOrder !== "desc") && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Sắp xếp: {sortBy === "createdAt" ? "Ngày tạo" : sortBy === "jobTitle" ? "Tên công việc" : sortBy === "salary" ? "Mức lương" : sortBy === "expireTime" ? "Hạn nộp" : "Số ứng viên"} ({sortOrder === "asc" ? "Tăng dần" : "Giảm dần"})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Job Status Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="Open">Đang tuyển</TabsTrigger>
          <TabsTrigger value="Closed">Đã đóng</TabsTrigger>
          <TabsTrigger value="Expired">Đã hết hạn</TabsTrigger>
          <TabsTrigger value="Finished">Đã kết thúc</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
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
              <div className="flex flex-col items-center w-[40%]">
                <p className={`text-gray-600 text-xs justify-center items-center py-[4%] px-[8%] rounded-2xl ${job.status === 'Open' ? 'bg-green-500' : job.status === 'Closed' ? 'bg-red-500' : job.status === 'Expired' ? 'bg-amber-500' : 'bg-gray-500'}`}>
                  {job.status === 'Open' ? 'Đang tuyển' : job.status === 'Closed' ? 'Đã đóng' : job.status === 'Expired' ? 'Đã hết hạn' : 'Đã kết thúc' }
                </p>
              </div>
            </div>
            <div className="flex pt-[6%] pb-[2%] flex-col">
              <div className="flex flex-row justify-start gap-[3%] items-center">
                <div className="text-gray-600 flex flex-row gap-1 text-center items-center">
                  <p className="text-sm font-bold text-blue-700">
                    {job.applicationsCount ?? 0}
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
                  API_KEY={API_KEY}
                  MAP_ID={MAP_ID}
                  onJobStatusChanged={() => fetchJobPosts(pageIndex)}
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
              <div className="text-gray-400 text-lg mb-2">
                {debouncedSearchTerm || sortBy !== "createdAt" || sortOrder !== "desc"
                  ? "Không tìm thấy tin tuyển dụng nào phù hợp" 
                  : "Không có tin tuyển dụng nào"
                }
              </div>
              <div className="text-gray-500 text-sm">
                {debouncedSearchTerm || sortBy !== "createdAt" || sortOrder !== "desc"
                  ? "Thử thay đổi bộ lọc, sắp xếp hoặc từ khóa tìm kiếm"
                  : "Hãy tạo tin tuyển dụng đầu tiên của bạn"
                }
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
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
