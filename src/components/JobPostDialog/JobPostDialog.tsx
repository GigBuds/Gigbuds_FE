/* eslint-disable react-hooks/exhaustive-deps */
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
import { JobPositionOption, JobPostDialogProps } from "@/types/jobPostService";
import { jobPostApi } from "@/service/jobPostService/jobPostService";
import {
  CalendarDays,
  DollarSign,
  Users,
  Clock,
  Edit2,
  Save,
  X,
  User,
  MapPin,
  Star,
  Briefcase,
  GraduationCap,
  Gift,
  CheckCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleMapResponse } from "@/types/folder/googleMapResponse";
import GoogleMap from "../map/GoogleMap";

const JobPostDialog: React.FC<JobPostDialogProps> = ({
  API_KEY,
  MAP_ID,
  job,
  children,
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
    jobSchedule: job.jobSchedule || null,
    isMale: false,
  });

  useEffect(() => {
    if (isOpen && !dataLoaded) {
      fetchData();
    }
  }, [isOpen, dataLoaded, job.jobPositionId]);

  const fetchData = async () => {
    try {
      setLoadingPositions(true);

      const positions = await jobPostApi.getAllJobPositions();
      setJobPositions(positions);

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
      isMale: false,
    });
  };

  const handleMapChange = (response: GoogleMapResponse | null | undefined) => {
    setFormData(prev => ({
      ...prev,
      jobLocation: response?.jobLocation ?? '',
      districtCode: response?.districtCode ?? '',
      provinceCode: response?.provinceCode ?? '',
    }));
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
    
    if (unit === "Hour") {
      return `${salary.toLocaleString()}/ giờ`;
    }
    if (unit === "Shift") {
      return `${salary.toLocaleString()}/ ca`;
    }
    if (unit === "Day") {
      return `${salary.toLocaleString()}/ ngày`;
    }
    
    return `${salary.toLocaleString()} ${unit || "VND"}`;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

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
        jobSchedule: formData.jobSchedule || undefined,
        isMale: formData.isMale,
      };

      const updatedJob = await jobPostApi.updateJobPost(
        job.id.toString(),
        updateData
      );

      if (updatedJob.success) {
        toast.success("Cập nhật tin tuyển dụng thành công!");
        setIsEditing(false);
        window.location.reload();
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
          <p className="text-gray-700 leading-relaxed">
            {selectedOption?.label || (typeof value === 'string' || typeof value === 'number' ? value : "Chưa có thông tin")}
          </p>
        );
      }
      if (type === "date") {
        return (
          <p className="text-gray-700 leading-relaxed">
            {value ? formatDate(value as string) : "Chưa đặt"}
          </p>
        );
      }
      if (field === "jobPositionId") {
        return (
          <p className="text-gray-700 leading-relaxed">
            {currentJobPosition || "Chưa có thông tin"}
          </p>
        );
      }
      return (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {(typeof value === 'string' || typeof value === 'number') ? value : "Chưa có thông tin"}
        </p>
      );
    }

    switch (type) {
      case "textarea":
        return (
          <Textarea
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
            rows={4}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            min="0"
            step="10000"
            value={value as number}
            onChange={(e) => handleInputChange(field, e.target.value === '' ? 0 : Number(e.target.value))}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        );
      case "select":
        return (
          <Select
            value={value as string}
            onValueChange={(val: string) => handleInputChange(field, val)}
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
        return (
          <Input
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        );
    }
  };

  const jobPositionOptions = jobPositions.map((position) => ({
    value: position.id.toString(),
    label: position.jobPositionName,
  }));

  const salaryUnitOptions = [
    { value: "Hour", label: "Giờ" },
    { value: "Shift", label: "Ca" },
    { value: "Day", label: "Ngày" },
  ];

  const InfoCard = ({ icon: Icon, title, children, highlight = false }: {
    icon: any;
    title: string;
    children: React.ReactNode;
    highlight?: boolean;
  }) => (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} transition-colors`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full ${highlight ? 'bg-blue-100' : 'bg-white'}`}>
          <Icon className={`w-5 h-5 ${highlight ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="ml-10">{children}</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent fullScreen={true} className="max-h-[95vh] pt-14 overflow-y-auto bg-white">
        <DialogHeader className="pb-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {isEditing ? "Chỉnh sửa tin tuyển dụng" : job.jobTitle}
              </DialogTitle>
              <DialogDescription className="text-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant={job.status === "active" ? "default" : "secondary"}
                    className="px-3 py-1 text-sm font-medium"
                  >
                    {job.status === "active" ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đang tuyển
                      </>
                    ) : (
                      "Đã đóng"
                    )}
                  </Badge>
                  {(formData.isOutstandingPost || job.isOutstandingPost) && (
                    <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">
                      <Star className="w-4 h-4 mr-1" />
                      Tin nổi bật
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-gray-600 text-base">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.jobLocation || "Chưa xác định địa điểm"}
                </div>
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                  disabled={loadingPositions}
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {loadingPositions && !dataLoaded ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pt-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-700">
                  Tiêu đề công việc *
                </Label>
                {renderEditableField("Tiêu đề công việc", "jobTitle")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobPositionId" className="text-sm font-semibold text-gray-700">
                  Vị trí công việc *
                </Label>
                {isEditing ? (
                  loadingPositions ? (
                    <p className="text-gray-500 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tải...
                    </p>
                  ) : (
                    renderEditableField(
                      "Vị trí công việc",
                      "jobPositionId",
                      "select",
                      jobPositionOptions
                    )
                  )
                ) : (
                  <p className="text-gray-700 font-medium">
                    {currentJobPosition || "Đang tải..."}
                  </p>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gradient-to-r  p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2  rounded-full">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Địa điểm làm việc</h3>
              </div>
              <p className="text-gray-700 mb-4 font-medium">
                {job.jobLocation || "Chưa xác định"}
              </p>
              <div className="rounded-lg   ">
                <GoogleMap
                  onChange={handleMapChange}
                  API_KEY={API_KEY}
                  MAP_ID={MAP_ID}
                  initialLocation={job.jobLocation || ""}
                  hideAutocomplete={!isEditing}
                />
              </div>
            </div>

            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <InfoCard icon={Users} title="Cần tuyển">
                {isEditing ? (
                  renderEditableField("Số lượng", "vacancyCount", "number")
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{job.vacancyCount} người</p>
                )}
              </InfoCard>

              <InfoCard icon={User} title="Độ tuổi">
                {isEditing ? (
                  renderEditableField("Độ tuổi", "ageRequirement", "number")
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {job.ageRequirement ? `${job.ageRequirement} tuổi` : "Không yêu cầu"}
                  </p>
                )}
              </InfoCard>

              <InfoCard icon={DollarSign} title="Mức lương" highlight>
                {isEditing ? (
                  <div className="space-y-2">
                    {renderEditableField("Lương", "salary", "number")}
                    {renderEditableField("Đơn vị", "salaryUnit", "select", salaryUnitOptions)}
                  </div>
                ) : (
                    <p className="text-2xl font-bold text-blue-600">
                    {formatSalary(job.salary, job.salaryUnit)}
                    </p>
                )}
              </InfoCard>

              <InfoCard icon={CalendarDays} title="Hạn nộp hồ sơ">
                {isEditing ? (
                  renderEditableField("Hạn nộp", "expireTime", "date")
                ) : (
                  <p className="text-lg font-semibold text-gray-900">
                    {job.expireTime ? formatDate(job.expireTime) : "Chưa đặt"}
                  </p>
                )}
              </InfoCard>
            </div>

            {/* Applications Count */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Ứng viên quan tâm</h4>
                  <p className="text-green-700 font-medium">
                    {job.applicationsCount || 0} người đã ứng tuyển
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Content Sections */}
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Mô tả công việc</h3>
                </div>
                {renderEditableField("Mô tả công việc", "jobDescription", "textarea")}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Yêu cầu công việc</h3>
                </div>
                {renderEditableField("Yêu cầu công việc", "jobRequirement", "textarea")}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Yêu cầu kinh nghiệm</h3>
                </div>
                {renderEditableField("Yêu cầu kinh nghiệm", "experienceRequirement", "textarea")}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Quyền lợi</h3>
                </div>
                {renderEditableField("Quyền lợi", "benefit", "textarea")}
              </div>
            </div>

            {/* Job Schedule */}
            {job.jobSchedule && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Lịch làm việc</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Số ca làm việc</p>
                    <p className="text-2xl font-bold text-purple-600">{job.jobSchedule.shiftCount}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Ca tối thiểu</p>
                    <p className="text-2xl font-bold text-purple-600">{job.jobSchedule.minimumShift}</p>
                  </div>
                </div>

                {job.jobSchedule.jobShifts && job.jobSchedule.jobShifts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Chi tiết ca làm việc:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.jobSchedule.jobShifts.map((shift, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-purple-100 shadow-sm"
                        >
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {shift.dayOfWeek === 0 ? "Chủ nhật" : `Thứ ${shift.dayOfWeek}`}
                            </p>
                            <p className="text-gray-600">
                              {shift.startTime} - {shift.endTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobPostDialog;