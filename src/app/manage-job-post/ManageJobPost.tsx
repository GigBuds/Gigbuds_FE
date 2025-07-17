"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { jobPostApi } from "@/service/jobPostService/jobPostService";
import { JobPost } from "@/types/jobPostService";
import { useRouter, useSearchParams } from 'next/navigation';
import JobPostDialog from "@/components/JobPostDialog/JobPostDialog";
import { useLoading } from '@/contexts/LoadingContext';
import Pagination from "@/components/Pagination/Pagination";
import { selectUser } from "@/lib/redux/features/userSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { Input } from "../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Filter,
  Eye,
  Plus
} from "lucide-react";

interface ManageJobPostProps {
  API_KEY: string;
  MAP_ID: string;
}

const ManageJobPost: React.FC<ManageJobPostProps> = ({ API_KEY, MAP_ID }) => {
  const [jobPostings, setJobPostings] = useState<JobPost[]>([]);
  const [allJobPostings, setAllJobPostings] = useState<JobPost[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [openJobId, setOpenJobId] = useState<number | null>(null);
  const { setIsLoading } = useLoading();
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Status configuration similar to ManageApplication
  const statusConfig = useMemo(() => ({
    all: { label: 'Tất cả', icon: Briefcase, color: 'bg-gray-100 text-gray-800', count: 0 },
    Open: { label: 'Đang tuyển', icon: CheckCircle, color: 'bg-green-100 text-green-800', count: 0 },
    Closed: { label: 'Đã đóng', icon: XCircle, color: 'bg-red-100 text-red-800', count: 0 },
    Expired: { label: 'Đã hết hạn', icon: Clock, color: 'bg-amber-100 text-amber-800', count: 0 },
    Finished: { label: 'Đã kết thúc', icon: CheckCircle, color: 'bg-blue-100 text-blue-800', count: 0 }
  }), []);

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

  const fetchAllJobPostsForCounting = useCallback(async (): Promise<void> => {
    try {
      const params: FetchJobPostsParams = {
        pageSize: 1000, // Large number to get all posts
        pageIndex: 1,
        employerId: user.id?.toString() ?? '',
      };

      const response: JobPostApiResponse = await jobPostApi.getJobPosts(params);
      if (response) {
        setAllJobPostings(response.items || []);
      }
    } catch (error: unknown) {
      console.error('Failed to fetch all job posts for counting:', error);
    }
  }, [user.id]);

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

  // Calculate status counts
  const statusCounts = React.useMemo(() => {
    const counts = { ...statusConfig };
    counts.all.count = allJobPostings.length;
    
    allJobPostings.forEach(job => {
      const status = job.status;
      if (counts[status as keyof typeof statusConfig]) {
        counts[status as keyof typeof statusConfig].count++;
      }
    });

    return counts;
  }, [allJobPostings, statusConfig]);

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
    fetchAllJobPostsForCounting();
  }, [fetchJobPosts, fetchAllJobPostsForCounting, router, pageIndex, user.id]);

  // Trigger search when debounced search term or filters change
  useEffect(() => {
    if (user.id) {
      fetchJobPosts(pageIndex);
    }
  }, [debouncedSearchTerm, activeTab, sortBy, sortOrder, pageIndex, fetchJobPosts, user.id]);

  // Handle opening specific job dialog from URL params
  useEffect(() => {
    const jobIdParam = searchParams.get('openJob');
    if (jobIdParam && jobPostings.length > 0) {
      const jobId = parseInt(jobIdParam);
      const jobExists = jobPostings.find(job => job.id === jobId);
      if (jobExists) {
        setOpenJobId(jobId);
        // Remove the parameter from URL to avoid reopening on refresh
        const url = new URL(window.location.href);
        url.searchParams.delete('openJob');
        router.replace(url.pathname + url.search);
      }
    }
  }, [searchParams, jobPostings, router]);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.all;
    
    return (
      <Badge className={`${config.color} border-0 font-medium`}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa rõ thời gian";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="w-full flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý tin tuyển dụng
            </h1>
            <p className="text-gray-600 mt-1">
              Trang {pageIndex} • Hiển thị {jobPostings.length} tin tuyển dụng
            </p>
          </div>
          <Button 
            onClick={() => router.push('/employer/job-posts/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo tin mới
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {Object.entries(statusCounts).map(([status, config]) => {
            const isActive = activeTab === status;
            return (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <config.icon className="w-4 h-4" />
                <span className="font-medium">{config.label}</span>
                <Badge variant="secondary" className="ml-1 bg-gray-200 text-gray-700">
                  {config.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề công việc..."
                value={searchTerm}
                onChange={handleSearch}
                className={`pl-10 pr-4 ${isSearching ? 'border-blue-300' : ''}`}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Ngày tạo</SelectItem>
              </SelectContent>
            </Select>

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
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || sortBy !== "createdAt" || sortOrder !== "desc") && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(debouncedSearchTerm || sortBy !== "createdAt" || sortOrder !== "desc") && (
          <div className="flex flex-wrap gap-2 mt-3">
            {debouncedSearchTerm && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Tìm kiếm: &quot;{debouncedSearchTerm}&quot;
              </Badge>
            )}
            {(sortBy !== "createdAt" || sortOrder !== "desc") && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Sắp xếp: {sortBy === "createdAt" ? "Ngày tạo" : sortBy} ({sortOrder === "asc" ? "Tăng dần" : "Giảm dần"})
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Job Posts Content */}
      <div className="flex-1 p-6 overflow-auto">
        {jobPostings.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {debouncedSearchTerm || activeTab !== "all"
                ? "Không tìm thấy tin tuyển dụng nào phù hợp" 
                : "Không có tin tuyển dụng nào"
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {debouncedSearchTerm || activeTab !== "all"
                ? "Thử thay đổi bộ lọc, sắp xếp hoặc từ khóa tìm kiếm"
                : "Hãy tạo tin tuyển dụng đầu tiên của bạn"
              }
            </p>
            {!debouncedSearchTerm && activeTab === "all" && (
              <Button 
                onClick={() => router.push('/employer/job-posts/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo tin tuyển dụng
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobPostings.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg truncate mb-2">
                      {job.jobTitle || 'Không có tiêu đề'}
                    </h3>
                  </div>
                  {getStatusBadge(job.status || '')}
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{job.jobLocation || 'Chưa có địa điểm'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{job.salary?.toLocaleString()} {job.salaryUnit || 'VND'}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{job.totalApplicants ?? 0}</span>
                      <span className="text-gray-500">ứng viên</span>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hết hạn:</span>
                      <CountdownTimer expireTime={job.expireTime} />
                      <div className="text-xs text-gray-500 mt-1">
                        {job.expireTime ? formatDate(job.expireTime) : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/manage-job-post/${job.id}`)}
                    className="flex-1"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Xem ứng viên
                  </Button>
                  
                  <JobPostDialog 
                    job={job}
                    API_KEY={API_KEY}
                    MAP_ID={MAP_ID}
                    onJobStatusChanged={() => fetchJobPosts(pageIndex)}
                    open={openJobId === job.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setOpenJobId(job.id);
                      } else {
                        setOpenJobId(null);
                      }
                    }}
                  >
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setOpenJobId(job.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </Button>
                  </JobPostDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {jobPostings.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-center">
            <Pagination
              currentPage={pageIndex}
              hasItems={jobPostings.length > 0}
              itemsCount={jobPostings.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
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
