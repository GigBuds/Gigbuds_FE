/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Badge } from "../../../ui/badge";
import { Separator } from "../../../ui/separator";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { JobPositionOption, JobPost, JobPostDialogProps } from "@/types/jobPostService";
import { jobPostApi } from "@/service/jobPostService/jobPostService";
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Edit2,
  Save,
  X,
  User,
} from "lucide-react";
import toast from "react-hot-toast";



const JobPostDialog: React.FC<JobPostDialogProps> = ({
  job,
  children,
  onJobUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobPositions, setJobPositions] = useState<JobPositionOption[]>([]);
  const [currentJobPosition, setCurrentJobPosition] = useState<string>("");
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: job.jobTitle || "",
    ageRequirement: job.ageRequirement || "",
    jobDescription: job.jobDescription || "",
    jobRequirement: job.jobRequirement || "",
    experienceRequirement: job.experienceRequirement || "",
    salary: job.salary || 0,
    salaryUnit: job.salaryUnit || "Hour",
    jobLocation: job.jobLocation || "",
    expireTime: job.expireTime ? job.expireTime.split("T")[0] : "",
    districtCode: job.districtCode || "",
    provinceCode: job.provinceCode || "",
    benefit: job.benefit || "",
    vacancyCount: job.vacancyCount || 1,
    isOutstandingPost: job.isOutstandingPost || false,
    jobPositionId: job.jobPositionId || "",
    // Add job schedule to form data
    jobSchedule: job.jobSchedule || null,
  });

  // Fetch data when dialog opens
  useEffect(() => {
    if (isOpen && !dataLoaded) {
      fetchData();
    }
  }, [isOpen, dataLoaded, job.jobPositionId]);

  const fetchData = async () => {
    try {
      setLoadingPositions(true);

      // Fetch job positions first
      const positions = await jobPostApi.getAllJobPositions();
      setJobPositions(positions);

      // Find current position from the fetched positions instead of separate API call
      if (job.jobPositionId) {
        const currentPosition = positions.find(
          (pos) => pos.id.toString() === job.jobPositionId?.toString()
        );
        setCurrentJobPosition(
          currentPosition?.jobPositionName || "Không xác định"
        );
      } else {
        setCurrentJobPosition("Không xác định");
      }

      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu");
      setCurrentJobPosition("Không xác định");
    } finally {
      setLoadingPositions(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      jobTitle: job.jobTitle || "",
      ageRequirement: job.ageRequirement || "",
      jobDescription: job.jobDescription || "",
      jobRequirement: job.jobRequirement || "",
      experienceRequirement: job.experienceRequirement || "",
      salary: job.salary || 0,
      salaryUnit: job.salaryUnit || "Hour",
      jobLocation: job.jobLocation || "",
      expireTime: job.expireTime ? job.expireTime.split("T")[0] : "",
      districtCode: job.districtCode || "",
      provinceCode: job.provinceCode || "",
      benefit: job.benefit || "",
      vacancyCount: job.vacancyCount || 1,
      isOutstandingPost: job.isOutstandingPost || false,
      jobPositionId: job.jobPositionId || "",
      jobSchedule: job.jobSchedule || null,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsEditing(false);
      resetFormData();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (salary?: number, unit?: string) => {
    if (!salary) return "Thỏa thuận";
    return `${salary.toLocaleString()} ${unit || "VND"}`;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset district when province changes
      if (field === "provinceCode") {
        newData.districtCode = "";
      }

      return newData;
    });
  };


  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData = {
        jobTitle: formData.jobTitle,
        ageRequirement: formData.ageRequirement
          ? formData.ageRequirement.toString()
          : undefined,
        jobDescription: formData.jobDescription,
        jobLocation: formData.jobLocation,
        salary: Number(formData.salary),
        salaryUnit: formData.salaryUnit,
        jobRequirement: formData.jobRequirement,
        experienceRequirement: formData.experienceRequirement,
        benefit: formData.benefit,
        vacancyCount: Number(formData.vacancyCount),
        expireTime: formData.expireTime
          ? new Date(formData.expireTime).toISOString()
          : job.expireTime,
        isOutstandingPost: formData.isOutstandingPost,
        districtCode: formData.districtCode,
        provinceCode: formData.provinceCode,
        jobPositionId: formData.jobPositionId
          ? formData.jobPositionId.toString()
          : undefined,
        // Add job schedule to update data
        jobSchedule: formData.jobSchedule || undefined,
      };

      const updatedJob = await jobPostApi.updateJobPost(
        job.id.toString(),
        updateData
      );

      toast.success("Cập nhật tin tuyển dụng thành công!");
      setIsEditing(false);

      if (onJobUpdated) {
        onJobUpdated(updatedJob);
      }
    } catch (error) {
      console.error("Error updating job post:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tin tuyển dụng!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetFormData();
    setIsEditing(false);
  };

  const renderEditableField = (
    label: string,
    field: string,
    type: "input" | "textarea" | "number" | "date" | "select" = "input",
    options?: { value: string; label: string }[]
  ) => {
    const value = formData[field as keyof typeof formData];

    if (!isEditing) {
      if (type === "select" && options) {
        const selectedOption = options.find((opt) => opt.value === value);
        return (
          <p className="text-gray-600">
            {selectedOption?.label || (typeof value === 'string' || typeof value === 'number' ? value : "Chưa có thông tin")}
          </p>
        );
      }
      if (type === "date") {
        return (
          <p className="text-gray-600">
            {value ? formatDate(value as string) : "Chưa đặt"}
          </p>
        );
      }
      // Special handling for jobPositionId
      if (field === "jobPositionId") {
        return (
          <p className="text-gray-600">
            {currentJobPosition || "Chưa có thông tin"}
          </p>
        );
      }
      return (
        <p className="text-gray-600 whitespace-pre-wrap">
          {(typeof value === 'string' || typeof value === 'number') ? value : "Chưa có thông tin"}
        </p>
      );
    }

    const commonProps = {
      value: value as string,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field, e.target.value),
      className: "w-full",
    };

    switch (type) {
      case "textarea":
        return <Textarea {...commonProps} rows={4} />;
      case "number":
        return <Input {...commonProps} type="number" min="0" />;
      case "date":
        return <Input {...commonProps} type="date" />;
      case "select":
        return (
          <Select
            value={value as string}
            onValueChange={(val: string) => handleInputChange(field, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  // Convert jobPositions to options format for the select
  const jobPositionOptions = jobPositions.map((position) => ({
    value: position.id.toString(),
    label: position.jobPositionName,
  }));

  const salaryUnitOptions = [
    { value: "Hour", label: "Giờ" },
    { value: "Shift", label: "Ca" },
    { value: "Day", label: "Ngày" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {isEditing ? "Chỉnh sửa tin tuyển dụng" : job.jobTitle}
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                <div className="items-center flex gap-2">
                  <Badge
                    variant={job.status === "active" ? "default" : "secondary"}
                  >
                    {job.status === "active" ? "Đang tuyển" : "Đã đóng"}
                  </Badge>
                  {(formData.isOutstandingPost || job.isOutstandingPost) && (
                    <Badge variant="destructive">Tin nổi bật</Badge>
                  )}
                </div>
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                  disabled={loadingPositions}
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {loadingPositions && !dataLoaded ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Job Title and Position */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="jobTitle" className="text-sm font-medium">
                  Tiêu đề công việc *
                </Label>
                {renderEditableField("Tiêu đề công việc", "jobTitle")}
              </div>
              <div className="flex-1">
                <Label htmlFor="jobPositionId" className="text-sm font-medium">
                  Vị trí công việc *
                </Label>
                {isEditing ? (
                  loadingPositions ? (
                    <p className="text-gray-500">Đang tải...</p>
                  ) : (
                    renderEditableField(
                      "Vị trí công việc",
                      "jobPositionId",
                      "select",
                      jobPositionOptions
                    )
                  )
                ) : (
                  <p className="text-gray-600">
                    {currentJobPosition || "Đang tải..."}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  Địa điểm làm việc
                </h4>
                {renderEditableField("Địa điểm", "jobLocation")}
              </div>
            </div>

            <Separator />

            {/* Job Details */}
            <div className="flex flex-col space-y-6">
              {/* Main Job Info Row */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
                {/* Vacancy Count */}
                <div className="flex flex-col items-center gap-2 text-sm text-gray-600 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Cần tuyển</span>
                  </div>
                  {isEditing ? (
                    <div className="w-20">
                      {renderEditableField("Số lượng", "vacancyCount", "number")}
                    </div>
                  ) : (
                    <span className="text-center">{job.vacancyCount} người</span>
                  )}
                </div>

                {/* Age Requirement */}
                <div className="flex flex-col items-center gap-2 text-sm text-gray-600 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <h4 className="whitespace-nowrap">Độ tuổi</h4>
                  </div>
                  <div className="w-full max-w-[80px]">
                    {isEditing ? (
                      renderEditableField("Độ tuổi", "ageRequirement", "number")
                    ) : (
                      <p className="text-gray-600 text-center">
                        {job.ageRequirement
                          ? `${job.ageRequirement} tuổi`
                          : "Không yêu cầu"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Salary */}
                <div className="flex flex-col items-center gap-2 text-sm text-gray-600 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="w-5 h-5" />
                    <h4 className="font-semibold text-gray-900 whitespace-nowrap">Mức lương</h4>
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-2 items-center w-full max-w-[200px]">
                      <div className="flex-1 min-w-[100px]">
                        {renderEditableField("Lương", "salary", "number")}
                      </div>
                      <div className="flex-shrink-0 min-w-[80px]">
                        {renderEditableField(
                          "Đơn vị",
                          "salaryUnit",
                          "select",
                          salaryUnitOptions
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center">
                      {formatSalary(job.salary, job.salaryUnit)}
                    </p>
                  )}
                </div>
              </div>

              {/* Secondary Info Row */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Expire Date */}
                <div className="flex items-start gap-3 flex-1">
                  <CalendarDays className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      Hạn nộp hồ sơ
                    </h4>
                    {renderEditableField("Hạn nộp", "expireTime", "date")}
                  </div>
                </div>

                {/* Application Count */}
                <div className="flex items-start gap-3 flex-1">
                  <Users className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      Số lượng ứng viên
                    </h4>
                    <p className="text-gray-600">
                      {job.applicationsCount || 0} người đã ứng tuyển
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả công việc *
              </h3>
              {renderEditableField(
                "Mô tả công việc",
                "jobDescription",
                "textarea"
              )}
            </div>

            {/* Job Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Yêu cầu công việc *
              </h3>
              {renderEditableField(
                "Yêu cầu công việc",
                "jobRequirement",
                "textarea"
              )}
            </div>

            {/* Experience Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Yêu cầu kinh nghiệm
              </h3>
              {renderEditableField(
                "Yêu cầu kinh nghiệm",
                "experienceRequirement",
                "textarea"
              )}
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quyền lợi
              </h3>
              {renderEditableField("Quyền lợi", "benefit", "textarea")}
            </div>

            {/* Job Schedule */}
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Lịch làm việc
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Số ca làm việc:</span>{" "}
                      {job.jobSchedule?.shiftCount}
                    </div>
                    <div>
                      <span className="font-medium">Ca tối thiểu:</span>{" "}
                      {job.jobSchedule?.minimumShift}
                    </div>
                  </div>

                  {job.jobSchedule?.jobShifts &&
                    job.jobSchedule?.jobShifts.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">
                          Chi tiết ca làm việc:
                        </h4>
                        <div className="space-y-2">
                          {job.jobSchedule.jobShifts.map((shift, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {shift.dayOfWeek}
                              </span>
                              <span className="text-gray-600">
                                {shift.startTime} - {shift.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobPostDialog;