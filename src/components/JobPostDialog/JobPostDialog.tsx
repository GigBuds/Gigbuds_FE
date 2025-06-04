/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
import { JobPost } from "@/types/jobPostService";
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
import { Button } from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

interface JobPostDialogProps {
  job: JobPost;
  children: React.ReactNode;
  onJobUpdated?: (updatedJob: JobPost) => void;
}

const JobPostDialog: React.FC<JobPostDialogProps> = ({
  job,
  children,
  onJobUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
  });

  // Sample job positions data (you can fetch this from API)
  const jobPositions = [
    { value: "1", label: "Nhân viên bán hàng" },
    { value: "2", label: "Nhân viên phục vụ" },
    { value: "3", label: "Tài xế" },
    { value: "4", label: "Bảo vệ" },
    { value: "5", label: "Nhân viên kho" },
    { value: "6", label: "Công nhân sản xuất" },
    { value: "7", label: "Nhân viên giao hàng" },
    { value: "8", label: "Nhân viên làm sạch" },
    { value: "9", label: "Nhân viên thu ngân" },
    { value: "10", label: "Nhân viên marketing" },
    { value: "11", label: "Nhân viên IT" },
    { value: "12", label: "Công nhân đóng gói" },
  ];

  // Province and District data
  const provinces = [
    { value: "HCM", label: "Thành phố Hồ Chí Minh" },
    { value: "HN", label: "Hà Nội" },
    { value: "DN", label: "Đà Nẵng" },
    { value: "CT", label: "Cần Thơ" },
    { value: "HP", label: "Hải Phòng" },
  ];

  const districts = [
    // Ho Chi Minh City districts
    { value: "D001", label: "Quận 1", provinceCode: "HCM" },
    { value: "D002", label: "Quận 2", provinceCode: "HCM" },
    { value: "D003", label: "Quận 3", provinceCode: "HCM" },
    { value: "D004", label: "Quận 4", provinceCode: "HCM" },
    { value: "D005", label: "Quận 5", provinceCode: "HCM" },
    { value: "D006", label: "Quận 6", provinceCode: "HCM" },
    { value: "D007", label: "Quận 7", provinceCode: "HCM" },
    { value: "D008", label: "Quận 8", provinceCode: "HCM" },
    { value: "D009", label: "Quận 9", provinceCode: "HCM" },
    { value: "D010", label: "Quận 10", provinceCode: "HCM" },
    { value: "D011", label: "Quận 11", provinceCode: "HCM" },
    { value: "D012", label: "Quận 12", provinceCode: "HCM" },
    { value: "DTD", label: "Quận Thủ Đức", provinceCode: "HCM" },
    { value: "DGV", label: "Quận Gò Vấp", provinceCode: "HCM" },
    { value: "DBT", label: "Quận Bình Thạnh", provinceCode: "HCM" },
    { value: "DTB", label: "Quận Tân Bình", provinceCode: "HCM" },
    { value: "DTP", label: "Quận Tân Phú", provinceCode: "HCM" },
    { value: "DPN", label: "Quận Phú Nhuận", provinceCode: "HCM" },
    // Hanoi districts
    { value: "HBD", label: "Quận Ba Đình", provinceCode: "HN" },
    { value: "HHK", label: "Quận Hoàn Kiếm", provinceCode: "HN" },
    { value: "HTH", label: "Quận Tây Hồ", provinceCode: "HN" },
    { value: "HLB", label: "Quận Long Biên", provinceCode: "HN" },
    { value: "HCG", label: "Quận Cầu Giấy", provinceCode: "HN" },
    { value: "HDD", label: "Quận Đống Đa", provinceCode: "HN" },
  ];

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

  const getProvinceName = (code: string) => {
    const province = provinces.find((p) => p.value === code);
    return province ? province.label : code;
  };

  const getDistrictName = (code: string) => {
    const district = districts.find((d) => d.value === code);
    return district ? district.label : code;
  };

  const getJobPositionName = (id: string) => {
    const position = jobPositions.find((p) => p.value === id);
    return position ? position.label : id;
  };

  const getFilteredDistricts = () => {
    return districts.filter((d) => d.provinceCode === formData.provinceCode);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

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

      // Prepare update data
      const updateData = {
        jobTitle: formData.jobTitle,
        ageRequirement: formData.ageRequirement
          ? Number(formData.ageRequirement)
          : null,
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
          ? Number(formData.jobPositionId)
          : null,
      };

      const updatedJob = await jobPostApi.updateJobPost(
        job.id.toString(),
        updateData
      );

      toast.success("Cập nhật tin tuyển dụng thành công!");
      setIsEditing(false);

      // Call the callback if provided
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
    // Reset form data to original values
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
      benefit: job.benefit || "",
      vacancyCount: job.vacancyCount || 1,
      isOutstandingPost: job.isOutstandingPost || false,
      districtCode: job.districtCode || "",
      provinceCode: job.provinceCode || "",
      jobPositionId: job.jobPositionId || "",
    });
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
            {selectedOption?.label || value || "Chưa có thông tin"}
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
      return (
        <p className="text-gray-600 whitespace-pre-wrap">
          {value || "Chưa có thông tin"}
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

  return (
    <Dialog>
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

        <div className="space-y-6">
          {/* Job Title and Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle" className="text-sm font-medium">
                Tiêu đề công việc *
              </Label>
              {renderEditableField("Tiêu đề công việc", "jobTitle")}
            </div>
            <div>
              <Label htmlFor="jobPositionId" className="text-sm font-medium">
                Vị trí công việc *
              </Label>
              {isEditing ? (
                renderEditableField(
                  "Vị trí công việc",
                  "jobPositionId",
                  "select",
                  jobPositions
                )
              ) : (
                <p className="text-gray-600">
                  {getJobPositionName(job.jobPositionId?.toString() || "")}
                </p>
              )}
            </div>
          </div>

          {/* Job Status and Basic Info */}
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 flex-row text-sm font-medium">
                <Users className="w-4 h-4" />
                <span>Cần tuyển </span>
              </div>
              {isEditing ? (
                <div className="w-20">
                  {renderEditableField("Số lượng", "vacancyCount", "number")}
                </div>
              ) : (
                <span>{job.vacancyCount} người</span>
              )}
            </div>
            <div className="flex items-start gap-3 flex-col">
              <div className="flex items-start gap-2 flex-row text-sm font-medium">
                <User className="w-4 h-4 text-gray-500 " />
                <h4 className="">Yêu cầu độ tuổi</h4>
              </div>
              <div className="f">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    {renderEditableField("Độ tuổi", "ageRequirement", "number")}
                    <span className="text-sm text-gray-500">tuổi</span>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {job.ageRequirement
                      ? `${job.ageRequirement} tuổi`
                      : "Không yêu cầu"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Requirement */}

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



            {/* Salary */}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Mức lương</h4>
                {isEditing ? (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      {renderEditableField("Lương", "salary", "number")}
                    </div>
                    <div className="w-24">
                      {renderEditableField("Đơn vị", "salaryUnit", "select", [
                        { value: "VND", label: "VND" },
                        { value: "USD", label: "USD" },
                        { value: "Hour", label: "Giờ" },
                        { value: "Day", label: "Ngày" },
                        { value: "Month", label: "Tháng" },
                      ])}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {formatSalary(job.salary, job.salaryUnit)}
                  </p>
                )}
              </div>
            </div>

            {/* Expire Date */}
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Hạn nộp hồ sơ</h4>
                {renderEditableField("Hạn nộp", "expireTime", "date")}
              </div>
            </div>

            {/* Application Count */}
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Số lượng ứng viên
                </h4>
                <p className="text-gray-600">
                  {job.applicationsCount || 0} người đã ứng tuyển
                </p>
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

          {/* Job Schedule - Read only for now */}
          {job.jobSchedule && (
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
                      {job.jobSchedule.shiftCount}
                    </div>
                    <div>
                      <span className="font-medium">Ca tối thiểu:</span>{" "}
                      {job.jobSchedule.minimumShift}
                    </div>
                  </div>

                  {job.jobSchedule.jobShifts &&
                    job.jobSchedule.jobShifts.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">
                          Chi tiết ca làm việc:
                        </h4>
                        <div className="space-y-2">
                          {job.jobSchedule.jobShifts.map((shift, index) => (
                            <div
                              key={shift.id || index}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {formatDate(shift.date)}
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobPostDialog;
