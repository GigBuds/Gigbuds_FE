/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useLoading } from "@/contexts/LoadingContext";
import { applicationApi } from "@/service/applicationService/applicationService";
import { Application } from "@/types/applicationService";
import { Job } from "@/types/jobPost.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Trash2,
  Eye,
  FileText,
  Calendar,
  Tag,
  ArrowLeft,
  MoreVertical,
  Check,
  X,
  RotateCcw,
  Download
} from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../../ui/dropdown-menu";
import { Checkbox } from "../../../../ui/checkbox";
import toast from "react-hot-toast";

interface ManageApplicationProps {
  selectedJob: Job | null;
}

type ApplicationStatus = 'all' | 'approved' | 'pending' | 'rejected' | 'removed';
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

const ManageApplication = ({ selectedJob }: ManageApplicationProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { setIsLoading } = useLoading();
  const router = useRouter();

  // Status configuration
  const statusConfig = {
    all: { label: 'Tất cả', icon: Users, color: 'bg-gray-100 text-gray-800', count: 0 },
    approved: { label: 'Đã duyệt', icon: CheckCircle, color: 'bg-green-100 text-green-800', count: 0 },
    pending: { label: 'Chờ duyệt', icon: Clock, color: 'bg-yellow-100 text-yellow-800', count: 0 },
    rejected: { label: 'Từ chối', icon: XCircle, color: 'bg-red-100 text-red-800', count: 0 },
    removed: { label: 'Đã xóa', icon: Trash2, color: 'bg-gray-100 text-gray-600', count: 0 }
  };

  // Helper function to safely render skill tags
  const renderSkillTag = (tag: unknown): string => {
    if (typeof tag === 'string') return tag;
    if (typeof tag === 'object' && tag && 'skillName' in tag) return (tag as any).skillName;
    if (typeof tag === 'object' && tag && 'name' in tag) return (tag as any).name;
    return 'Skill';
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJob?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await applicationApi.getApplicationsByJobPostId(
          selectedJob.id.toString()
        );
        
        let applicationsData: Application[] = [];
        if (Array.isArray(response)) {
          applicationsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          applicationsData = response.data;
        } else {
          console.warn("Unexpected response format:", response);
          applicationsData = [];
        }

        setApplications(applicationsData);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setApplications([]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchApplications();
  }, [selectedJob?.id, setIsLoading]);

  // Filter and sort applications
  const processedApplications = useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => {
        const status = app.applicationStatus?.toLowerCase() || 'pending';
        return status === selectedStatus;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => {
        // Create multiple name combinations to search
        const fullName1 = `${app.firstName || ''} ${app.lastName || ''}`.toLowerCase();
        const fullName2 = `${app.lastName || ''} ${app.firstName || ''}`.toLowerCase();
        const firstName = (app.firstName || '').toLowerCase();
        const lastName = (app.lastName || '').toLowerCase();
        
        return fullName1.includes(term) ||
               fullName2.includes(term) ||
               firstName.includes(term) ||
               lastName.includes(term) ||
               app.accountId?.toString().includes(term) ||
               app.jobPosition?.toLowerCase().includes(term) ||
               app.skillTags?.some(tag => renderSkillTag(tag).toLowerCase().includes(term));
      });
    }

    // Sort applications
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'oldest':
          return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'name-desc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, selectedStatus, searchTerm, sortBy]);

  // Update status counts
  const statusCounts = useMemo(() => {
    const counts = { ...statusConfig };
    counts.all.count = applications.length;
    
    applications.forEach(app => {
      const status = (app.applicationStatus?.toLowerCase() || 'pending') as ApplicationStatus;
      if (counts[status]) {
        counts[status].count++;
      }
    });

    return counts;
  }, [applications]);

  // Handle individual status update
  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      console.log(`Updating status for application ${applicationId} to ${newStatus}`);
      setIsUpdatingStatus(true);
      await applicationApi.updateStatusForApplications(applicationId, newStatus);

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId // Changed from app.accountId to app.id
            ? { ...app, applicationStatus: newStatus }
            : app
        )
      );

      toast.success(`Cập nhật trạng thái thành công`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedApplications.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ứng viên");
      return;
    }

    try {
      setIsUpdatingStatus(true);
      
      // Update each application individually
      const updatePromises = selectedApplications.map(applicationId => 
        applicationApi.updateStatusForApplications(applicationId, newStatus)
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Update local state after all API calls succeed
      setApplications(prev =>
        prev.map(app =>
          selectedApplications.includes(app.id)
            ? { ...app, applicationStatus: newStatus }
            : app
        )
      );

      setSelectedApplications([]);
      toast.success(`Cập nhật trạng thái cho ${selectedApplications.length} ứng viên thành công`);
    } catch (error) {
      console.error("Error updating bulk status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(processedApplications.map(app => app.id)); // Changed from app.accountId to app.id
    } else {
      setSelectedApplications([]);
    }
  };

  // Handle individual selection
  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, applicationId]);
    } else {
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    const config = statusConfig[normalizedStatus as ApplicationStatus] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} border-0 font-medium`}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa rõ thời gian";
    const appliedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="w-full flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý ứng viên
              </h1>
              <p className="text-gray-600">
                Job ID: {selectedJob?.id} • {applications.length} ứng viên
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {Object.entries(statusCounts).map(([status, config]) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as ApplicationStatus)}
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

      {/* Filters and Actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, ID, vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedApplications.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
              <span className="text-sm text-blue-700">
                Đã chọn {selectedApplications.length} ứng viên
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('approved')}
                  disabled={isUpdatingStatus}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  disabled={isUpdatingStatus}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  <X className="w-3 h-3 mr-1" />
                  Từ chối
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('pending')}
                  disabled={isUpdatingStatus}
                  className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Chờ duyệt
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Lỗi: {error}
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="flex-1 p-6 overflow-auto">
        {processedApplications.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Không tìm thấy ứng viên phù hợp' 
                : 'Chưa có ứng viên nào ứng tuyển'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Hãy chia sẻ tin tuyển dụng để thu hút ứng viên'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All Header */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                checked={selectedApplications.length === processedApplications.length && processedApplications.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium text-gray-700">
                Chọn tất cả ({processedApplications.length})
              </span>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {processedApplications.map((applicant) => (
                <div
                  key={applicant.id} // Changed from applicant.accountId to applicant.id
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Header with checkbox and avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    <Checkbox
                      checked={selectedApplications.includes(applicant.id)} // Changed from applicant.accountId to applicant.id
                      onCheckedChange={(checked) => 
                        handleSelectApplication(applicant.id, checked as boolean) // Changed from applicant.accountId to applicant.id
                      }
                      className="mt-1"
                    />
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {(applicant.firstName?.charAt(0) || applicant.lastName?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {applicant.lastName} {applicant.firstName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>ID: {applicant.accountId}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(applicant.appliedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/manage-job-post/${selectedJob?.id}/user-profile/${applicant.accountId}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Xem hồ sơ
                            </DropdownMenuItem>
                            {applicant.cvUrl && (
                              <DropdownMenuItem
                                onClick={() => window.open(applicant.cvUrl, "_blank")}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Tải CV
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(applicant.id, 'Approved')} // Changed from applicant.accountId to applicant.id
                              disabled={isUpdatingStatus}
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Duyệt
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(applicant.id, 'Rejected')} // Changed from applicant.accountId to applicant.id
                              disabled={isUpdatingStatus}
                            >
                              <XCircle className="w-4 h-4 mr-2 text-red-600" />
                              Từ chối
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Status and Job Position */}
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(applicant.applicationStatus || 'Pending')}
                    <span className="text-sm text-gray-600">
                      {applicant.jobPosition || 'N/A'}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Kỹ năng:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skillTags && applicant.skillTags.length > 0 ? (
                        <>
                          {applicant.skillTags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700"
                            >
                              {renderSkillTag(tag)}
                            </Badge>
                          ))}
                          {applicant.skillTags.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700"
                            >
                              +{applicant.skillTags.length - 3}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="secondary" className="text-xs text-gray-500">
                          Chưa có kỹ năng
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* CV and Actions */}
                  <div className="space-y-3">
                    <Button
                      variant={applicant.cvUrl ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => applicant.cvUrl && window.open(applicant.cvUrl, "_blank")}
                      disabled={!applicant.cvUrl}
                      className="w-full justify-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {applicant.cvUrl ? "Xem CV đính kèm" : "Không có CV đính kèm"}
                    </Button>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(applicant.id, 'Approved')} // Changed from applicant.accountId to applicant.id
                        disabled={isUpdatingStatus || applicant.applicationStatus === 'Approved'}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(applicant.id, 'Rejected')} // Changed from applicant.accountId to applicant.id
                        disabled={isUpdatingStatus || applicant.applicationStatus === 'Rejected'}
                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Từ chối
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(applicant.id, 'Pending')} // Changed from applicant.accountId to applicant.id
                        disabled={isUpdatingStatus || applicant.applicationStatus === 'Pending'}
                        className="flex-1 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Chờ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplication;
