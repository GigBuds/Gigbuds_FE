"use client"

import { Button, DatePicker, Input, InputNumber, Form, Select, Card, Typography, Divider, Tooltip } from "antd";
import { InfoCircleOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import GoogleMap from "@/components/map/GoogleMap";
import { CreateJobPostRequest, JobPosition, JobSchedule } from "@/types/jobPostService";
import EmployerShiftCalendar from "@/components/EmployerShiftCalendar";
import { GoogleMapResponse } from "@/types/folder/googleMapResponse";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/lib/redux/features/userSlice";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

export default function CreateForm({API_KEY, MAP_ID, jobPositions}: Readonly<{API_KEY: string, MAP_ID: string, jobPositions: Record<string, JobPosition[]>}>) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAppSelector(selectUser);

  console.log('user', user);
  const onFinish = async (values: CreateJobPostRequest) => {
    setIsLoading(true);
    console.log('values', values);
  
    values.accountId = user.id?.toString() ?? '';
    try {
      const response = await fetch('/api/job-posts', {
        method: 'POST',
        body: JSON.stringify(values),
        credentials: 'include',
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
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

  const disabledEndDate = (current: Dayjs) => {
    const startDate = form.getFieldValue('StartDate');
    return current && (current < dayjs().startOf('day') || (startDate && current < dayjs(startDate).startOf('day')));
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="text-center mb-8">
          <Title level={2} className="mb-2 text-blue-700">Tạo Bài Đăng Tuyển Dụng Mới</Title>
          <Text type="secondary" className="text-base">
            Điền thông tin chi tiết bên dưới để tạo bài đăng tuyển dụng mới
          </Text>
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
          <Card className="mb-8 shadow border-l-4 border-l-blue-500 bg-blue-50/40">
            <div className="text-center">
              <Form.Item 
                name="JobTitle" 
                label={<span className="text-lg font-semibold">Tiêu Đề Công Việc <Tooltip title="Tên công việc sẽ hiển thị nổi bật"><InfoCircleOutlined className="ml-1 text-blue-400" /></Tooltip></span>}
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề công việc' }]}
                className="mb-0"
              > 
                <Input 
                  variant="outlined" 
                  size="large" 
                  placeholder="VD: Kỹ Sư Phần Mềm Senior"
                  className="rounded-lg"
                /> 
              </Form.Item>
            </div>
          </Card>

          <Divider orientation="left" plain><CheckCircleOutlined className="mr-2 text-blue-500" />Chi Tiết Công Việc</Divider>
          <Card className="mb-8 shadow-sm bg-white/80">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Form.Item 
                name="JobDescription" 
                label={<span>Mô Tả Công Việc <Tooltip title="Các nhiệm vụ, trách nhiệm chính"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
              > 
                <Input.TextArea 
                  variant="outlined" 
                  rows={4}
                  placeholder="Mô tả các trách nhiệm và nhiệm vụ chính..."
                  className="rounded-lg"
                /> 
              </Form.Item>
              
              <Form.Item 
                name="JobRequirement" 
                label={<span>Yêu Cầu Công Việc <Tooltip title="Trình độ, kỹ năng, kinh nghiệm"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc' }]}
              > 
                <Input.TextArea 
                  variant="outlined" 
                  rows={4}
                  placeholder="Liệt kê các yêu cầu và trình độ cần thiết..."
                  className="rounded-lg"
                /> 
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              <Form.Item 
                name="JobPositionId" 
                label={<span>Danh Mục Công Việc <Tooltip title="Giúp phân loại công việc"><InfoCircleOutlined /></Tooltip></span>} 
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
                  className="rounded-lg"
                /> 
              </Form.Item>

              <Form.Item 
                name="VacancyCount" 
                label={<span>Số Lượng Vị Trí <Tooltip title="Số lượng vị trí cần tuyển"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập số lượng vị trí tuyển dụng' }]}
              >
                <InputNumber 
                  variant="outlined" 
                  size="large"
                  min={1}
                  placeholder="VD: 10"
                  className="w-full rounded-lg"
                />
              </Form.Item>
            </div>
          </Card>

          <Divider orientation="left" plain><CheckCircleOutlined className="mr-2 text-blue-500" />Lương & Phúc Lợi</Divider>
          <Card className="mb-8 shadow-sm bg-white/80">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Form.Item 
                name="Salary" 
                label={<span>Mức Lương <Tooltip title="Mức lương cơ bản"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập mức lương' }]}
              >
                <InputNumber 
                  style={{ width: "100%" }} 
                  variant="outlined" 
                  size="large"
                  min={0}
                  placeholder="Nhập số tiền"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item 
                name="SalaryUnit" 
                label={<span>Tần Suất Trả Lương <Tooltip title="Theo giờ, ngày hoặc ca"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng chọn đơn vị lương' }]}
              >
                <Select variant="outlined" size="large" placeholder="Chọn tần suất" className="rounded-lg">
                  <Select.Option value="Hour">Theo Giờ</Select.Option>
                  <Select.Option value="Day">Theo Ngày</Select.Option>
                  <Select.Option value="Shift">Theo Ca</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item 
                name="Benefit" 
                label={<span>Phúc Lợi & Quyền Lợi <Tooltip title="Các phúc lợi, quyền lợi"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập thông tin phúc lợi' }]}
              >
                <Input 
                  variant="outlined" 
                  size="large"
                  placeholder="VD: Bảo hiểm y tế, giờ làm linh hoạt"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>
          </Card>

          <Divider orientation="left" plain><CheckCircleOutlined className="mr-2 text-blue-500" />Yêu Cầu & Ưu Tiên</Divider>
          <Card className="mb-8 shadow-sm bg-white/80">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Form.Item 
                name="AgeRequirement" 
                label={<span>Tuổi Tối Thiểu <Tooltip title="Yêu cầu tuổi tối thiểu"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập yêu cầu về tuổi' }]}
              >
                <InputNumber 
                  variant="outlined" 
                  size="large"
                  min={16}
                  max={65}
                  placeholder="VD: 18"
                  className="w-full rounded-lg"
                />
              </Form.Item>

              <Form.Item 
                name="ExperienceRequirement" 
                label={<span>Kinh Nghiệm Yêu Cầu <Tooltip title="Số năm kinh nghiệm"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng nhập yêu cầu kinh nghiệm' }]}
              >
                <Input 
                  variant="outlined" 
                  size="large"
                  placeholder="VD: 2+ năm kinh nghiệm tương tự"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>
          </Card>

          <Divider orientation="left" plain><CheckCircleOutlined className="mr-2 text-blue-500" />Địa Điểm Làm Việc</Divider>
          <Card className="mb-8 shadow-sm bg-white/80">
            <Form.Item 
              name="JobLocation" 
              label={<span>Địa Điểm Làm Việc <Tooltip title="Chọn vị trí trên bản đồ"><InfoCircleOutlined /></Tooltip></span>} 
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

          <Divider orientation="left" plain><CheckCircleOutlined className="mr-2 text-blue-500" />Lịch Làm Việc</Divider>
          <Card className="mb-8 shadow-sm bg-white/80">
            <Form.Item
              name="JobSchedule"
              label={<span>Thiết Lập Lịch Làm Việc & Ca Làm <Tooltip title="Số ca tối thiểu, lịch làm việc"><InfoCircleOutlined /></Tooltip></span>}
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

          <Divider orientation="left" plain><CheckCircleOutlined className="mr-2 text-blue-500" />Cài Đặt Quản Trị</Divider>
          <Card className="mb-8 shadow-sm bg-white/80">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Form.Item 
                name="ExpireTime" 
                label={<span>Hạn Chót Ứng Tuyển <Tooltip title="Ngày hết hạn ứng tuyển"><InfoCircleOutlined /></Tooltip></span>} 
                rules={[{ required: true, message: 'Vui lòng thiết lập thời hạn' }]}
              >
                <DatePicker 
                  showTime 
                  variant="outlined" 
                  size="large"
                  minDate={dayjs()}
                  placeholder="Chọn hạn chót"
                  className="w-full rounded-lg"
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>

              <Form.Item 
                name="StartDate" 
                label={<span>Ngày Bắt Đầu Công Việc <Tooltip title="Ngày bắt đầu"><InfoCircleOutlined /></Tooltip></span>}
              >
                <DatePicker 
                  showTime 
                  variant="outlined" 
                  size="large"
                  minDate={dayjs()}
                  placeholder="Chọn ngày bắt đầu công việc"
                  className="w-full rounded-lg"
                  format="YYYY-MM-DD HH:mm"
                  onChange={() => {
                    const startDate = form.getFieldValue('StartDate');
                    const endDate = form.getFieldValue('EndDate');
                    if (endDate && startDate && dayjs(endDate).isBefore(dayjs(startDate))) {
                      form.setFieldsValue({ EndDate: null });
                    }
                  }}
                />
              </Form.Item>
              <Form.Item 
                name="EndDate" 
                label={<span>Ngày Kết Thúc Công Việc <Tooltip title="Ngày kết thúc"><InfoCircleOutlined /></Tooltip></span>}
              >
                <DatePicker 
                  showTime 
                  variant="outlined" 
                  size="large"
                  minDate={dayjs()}
                  placeholder="Chọn ngày kết thúc công việc"
                  className="w-full rounded-lg"
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={disabledEndDate}
                />
              </Form.Item>

              <div className="flex items-end">
                <div className="text-sm text-gray-500">
                  <p>📋 Xem lại tất cả các trường trước khi gửi</p>
                  <p>✨ Bài đăng nổi bật có độ hiển thị cao gấp 3 lần</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center mt-10">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              className="px-16 py-3 h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 border-0 shadow-lg rounded-xl flex items-center gap-2"
              loading={isLoading}
              icon={<PlusOutlined />}
            >
              {isLoading ? 'Đang tạo bài đăng...' : 'Tạo Bài Đăng'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}