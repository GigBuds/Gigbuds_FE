"use client"

import { Button, DatePicker, Input, InputNumber, Switch , Form, Select, Card, Typography } from "antd";
import GoogleMap from "@/components/map/GoogleMap";
import { CreateJobPostRequest, JobPosition, JobSchedule } from "@/types/jobPostService";
import EmployerShiftCalendar from "@/components/EmployerShiftCalendar";
import { GoogleMapResponse } from "@/types/folder/googleMapResponse";
import toast from "react-hot-toast";
import { useState } from "react";
import fetchApi from "@/api/api";

const { Title } = Typography;

export default function CreateForm({API_KEY, MAP_ID, jobPositions}: Readonly<{API_KEY: string, MAP_ID: string, jobPositions: Record<string, JobPosition[]>}>) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: CreateJobPostRequest) => {
    setIsLoading(true);
    console.log('values', values);
    values.accountId = '3'; // TODO: get accountId from user
    try {
      await fetchApi.post('job-posts', values);
      toast.success('Bài đăng đã được tạo thành công');
      form.resetFields();
    } catch (error) {
      console.error('error', error);
      toast.error('Lỗi khi tạo bài đăng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleChange = (schedule: JobSchedule) => {
    form.setFieldsValue({
      JobSchedule: {
        shiftCount: schedule.shiftCount,
        minimumShift: schedule.minimumShift,
        jobShifts: schedule.jobShifts.map(shift => ({
          dayOfWeek: shift.dayOfWeek,
          startTime: new Date(shift.startTime).toLocaleTimeString(
            'vi-VN', 
            { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }
          ),
          endTime: new Date(shift.endTime).toLocaleTimeString(
            'vi-VN',
            { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }
          ),
        })),
      },
    });
    console.log('schedule', schedule);
  };

  const handleMapChange = (response: GoogleMapResponse | null | undefined) => {
    form.setFieldsValue({
      JobLocation: response?.jobLocation ?? '',
      DistrictCode: response?.districtCode ?? '',
      ProvinceCode: response?.provinceCode ?? '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <Title level={2} className="mb-2">Tạo Bài Đăng Tuyển Dụng Mới</Title>
        <p className="text-gray-600">
          Điền thông tin chi tiết bên dưới để tạo bài đăng tuyển dụng mới
        </p>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        className="w-full"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        {/* Job Title - Most Important Field */}
        <Card className="mb-6 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-center">
            <Form.Item 
              name="JobTitle" 
              label={<span className="text-lg font-semibold">Tiêu Đề Công Việc</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề công việc' }]}
              className="mb-0"
            > 
              <Input 
                variant="outlined" 
                size="large" 
                placeholder="VD: Kỹ Sư Phần Mềm Senior"
              /> 
            </Form.Item>
          </div>
        </Card>

        {/* Basic Job Information */}
        <Card title="Chi Tiết Công Việc" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Form.Item 
              name="JobDescription" 
              label="Mô Tả Công Việc" 
              rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
            > 
              <Input.TextArea 
                variant="outlined" 
                rows={4}
                placeholder="Mô tả các trách nhiệm và nhiệm vụ chính..."
              /> 
            </Form.Item>
            
            <Form.Item 
              name="JobRequirement" 
              label="Yêu Cầu Công Việc" 
              rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc' }]}
            > 
              <Input.TextArea 
                variant="outlined" 
                rows={4}
                placeholder="Liệt kê các yêu cầu và trình độ cần thiết..."
              /> 
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <Form.Item 
              name="JobPositionId" 
              label="Danh Mục Công Việc" 
              tooltip="Tùy chọn - Giúp phân loại công việc tốt hơn"
            > 
              <Select 
                size="large"
                showSearch
                optionFilterProp="label"
                placeholder="Chọn danh mục công việc"
                options={
                  Object.entries(jobPositions).map(([key, positions]) => ({
                    label: key,
                    options: positions.map(position => ({
                      value: position.id,
                      label: position.jobPositionName
                    }))
                  }))
                } 
              /> 
            </Form.Item>

            <Form.Item 
              name="VacancyCount" 
              label="Số Lượng Vị Trí" 
              tooltip="Số lượng vị trí cần tuyển dụng"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng vị trí tuyển dụng' }]}
            >
              <InputNumber 
                variant="outlined" 
                size="large"
                min={1}
                placeholder="VD: 10"
                className="w-full"
              />
            </Form.Item>
          </div>
        </Card>

        {/* Compensation & Benefits */}
        <Card title="Lương & Phúc Lợi" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Form.Item 
              name="Salary" 
              label="Mức Lương" 
              rules={[{ required: true, message: 'Vui lòng nhập mức lương' }]}
            >
              <InputNumber 
                style={{ width: "100%" }} 
                variant="outlined" 
                size="large"
                min={0}
                placeholder="Nhập số tiền"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0}
              />
            </Form.Item>

            <Form.Item 
              name="SalaryUnit" 
              label="Tần Suất Trả Lương" 
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị lương' }]}
            >
              <Select variant="outlined" size="large" placeholder="Chọn tần suất">
                <Select.Option value="Hour">Theo Giờ</Select.Option>
                <Select.Option value="Day">Theo Ngày</Select.Option>
                <Select.Option value="Shift">Theo Ca</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="Benefit" 
              label="Phúc Lợi & Quyền Lợi" 
              rules={[{ required: true, message: 'Vui lòng nhập thông tin phúc lợi' }]}
            >
              <Input 
                variant="outlined" 
                size="large"
                placeholder="VD: Bảo hiểm y tế, giờ làm linh hoạt"
              />
            </Form.Item>
          </div>
        </Card>

        {/* Requirements */}
        <Card title="Yêu Cầu & Ưu Tiên" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Form.Item 
              name="AgeRequirement" 
              label="Tuổi Tối Thiểu" 
              rules={[{ required: true, message: 'Vui lòng nhập yêu cầu về tuổi' }]}
            >
              <InputNumber 
                variant="outlined" 
                size="large"
                min={16}
                max={65}
                placeholder="VD: 18"
                className="w-full"
              />
            </Form.Item>

            <Form.Item 
              name="ExperienceRequirement" 
              label="Kinh Nghiệm Yêu Cầu" 
              rules={[{ required: true, message: 'Vui lòng nhập yêu cầu kinh nghiệm' }]}
            >
              <Input 
                variant="outlined" 
                size="large"
                placeholder="VD: 2+ năm kinh nghiệm tương tự"
              />
            </Form.Item>

            <Form.Item 
              name="IsMale" 
              label="Cần ứng viên nam" 
              tooltip="Tùy chọn - Bật nếu vị trí này yêu cầu ứng viên nam"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch/>
            </Form.Item>
          </div>
        </Card>

        {/* Location */}
        <Card title="Địa Điểm Làm Việc" className="mb-6 shadow-sm">
          <Form.Item 
            name="JobLocation" 
            label="Địa Điểm Làm Việc" 
            rules={[{ required: true, message: 'Vui lòng chọn địa điểm làm việc' }]}
            className="mb-0"
          >
            <GoogleMap 
              onChange={handleMapChange} 
              API_KEY={API_KEY} 
              MAP_ID={MAP_ID}
            />
          </Form.Item>
          
          <Form.Item hidden name="DistrictCode" rules={[{ required: false }]}> 
            <Input />
          </Form.Item>
          <Form.Item hidden name="ProvinceCode" rules={[{ required: false }]}> 
            <Input /> 
          </Form.Item>
        </Card>

        {/* Schedule */}
        <Card title="Lịch Làm Việc" className="mb-6 shadow-sm">
          <Form.Item
            name="JobSchedule"
            label="Thiết Lập Lịch Làm Việc & Ca Làm"
            rules={[{ required: true, message: 'Vui lòng thiết lập lịch làm việc' }]}
            className="mb-0"
            tooltip={    
            <div>
              - Số ca tối thiểu: Số ca làm việc tối thiểu mà ứng viên phải đăng ký<br />
              - Lịch làm việc: Thời gian và ca làm việc cụ thể cho vị trí này
            </div>}
          >
            <EmployerShiftCalendar onChange={handleScheduleChange} />
          </Form.Item>
        </Card>

        {/* Administrative Settings */}
        <Card title="Cài Đặt Quản Trị" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Form.Item 
              name="ExpireTime" 
              label="Hạn Chót Ứng Tuyển" 
              rules={[{ required: true, message: 'Vui lòng thiết lập thời hạn' }]}
            >
              <DatePicker 
                showTime 
                variant="outlined" 
                size="large"
                placeholder="Chọn hạn chót"
                className="w-full"
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>

            <Form.Item 
              name="IsOutstandingPost" 
              label="Bài Đăng Nổi Bật" 
              valuePropName="checked"
              initialValue={false}
              tooltip="Tùy chọn - Bài đăng nổi bật có độ hiển thị cao hơn"
            >
              <Switch/>
            </Form.Item>

            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                <p>📋 Xem lại tất cả các trường trước khi gửi</p>
                <p>✨ Bài đăng nổi bật có độ hiển thị cao gấp 3 lần</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center mt-8">
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            className="px-12 py-2 h-12"
            loading={isLoading}
          >
            {isLoading ? 'Đang tạo bài đăng...' : 'Tạo Bài Đăng'}
          </Button>
        </div>
      </Form>
    </div>
  )
}