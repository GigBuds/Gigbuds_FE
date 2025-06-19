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
import { Button as BtnAntd} from "antd";
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
  StopCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleMapResponse } from "@/types/folder/googleMapResponse";
import GoogleMap from "../map/GoogleMap";

const JobPostDialog: React.FC<JobPostDialogProps> = ({
  API_KEY,
  MAP_ID,
  job,
  children,
  onJobStatusChanged,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  const [loadingFinishJobPost, setLoadingFinishJobPost] = useState(false);
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

  const handleToggleJobPostStatus = async () => {
    if (isEditing) {
      const confirmed = window.confirm("Bạn có chắc chắn muốn đóng? Mọi thay đổi chưa lưu sẽ bị mất.");
      if (!confirmed) {
        return;
      }
    }
    setLoadingToggleStatus(true);
    await jobPostApi.updateJobPostStatus(job.id.toString(), job.status === "Open" ? "Closed" : "Open");
    resetFormData();
    setIsEditing(false);
    setIsOpen(false);
    setLoadingToggleStatus(false);
    
    if (onJobStatusChanged) {
      onJobStatusChanged();
    }
  };

  const handleFinishJobPost = async () => {
    setLoadingFinishJobPost(true);
    await jobPostApi.updateJobPostStatus(job.id.toString(), "Finished");
    resetFormData();
    setIsEditing(false);
    setIsOpen(false);
    setLoadingFinishJobPost(false);
    
    if (onJobStatusChanged) {
      onJobStatusChanged();
    }
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
      <DialogContent className="max-w-10xl max-h-[90vh] ">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-between items-start gap-2">
              <BtnAntd 
                color={job.status === "Open" ? "red" : "green"}
                variant="solid"
                disabled={job.status === 'Expired' || job.status === 'Finished'}
                onClick={handleToggleJobPostStatus} 
                loading={loadingToggleStatus}
              >
                {job.status === "Open" ? (
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Đóng tin tuyển dụng
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mở tin tuyển dụng
                  </div>
                )}

              </BtnAntd>

              <BtnAntd
                color="blue"
                variant="solid"
                disabled={job.status === 'Expired' || job.status === 'Finished'}
                onClick={handleFinishJobPost}
                loading={loadingFinishJobPost}
              >
                <StopCircle className="w-4 h-4" />
                Kết thúc tin tuyển dụng
              </BtnAntd>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {isEditing ? "Chỉnh sửa tin tuyển dụng" : job.jobTitle}
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                <div className="items-center flex gap-2">
                  <Badge
                    variant={job.status === 'Open' ? 'default' : job.status === 'Closed' ? 'destructive' : job.status === 'Expired' ? 'destructive' : 'secondary'}
                  >
                    {job.status === 'Open' ? 'Đang tuyển' : job.status === 'Closed' ? 'Đã đóng' : job.status === 'Expired' ? 'Đã hết hạn' : 'Đã kết thúc' }
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

            <div className="items-center gap-3">
              <Label htmlFor="jobPositionId" className="text-sm font-medium">
                Địa điểm làm việc *
              </Label>
              <span className="text-gray-600 text-sm mb-4">
                {job.jobLocation || "Chưa xác định"}
              </span>

              <GoogleMap
                onChange={handleMapChange}
                API_KEY={API_KEY}
                MAP_ID={MAP_ID}
                initialLocation={job.jobLocation || ""}
                hideAutocomplete={!isEditing}
              />
            </div>

            <Separator />

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
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

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-start gap-3 flex-1">
                  <CalendarDays className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      Hạn nộp hồ sơ
                    </h4>
                    {renderEditableField("Hạn nộp", "expireTime", "date")}
                  </div>
                </div>

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

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quyền lợi
              </h3>
              {renderEditableField("Quyền lợi", "benefit", "textarea")}
            </div>

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
                                {shift.dayOfWeek === 0 ? "Chủ nhật" : `Thứ ${shift.dayOfWeek}`}
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