"use client"

import { Button, DatePicker, Input, InputNumber, Switch , Form, Select } from "antd";
import GoogleMap from "@/components/map/GoogleMap";
import { JobPostCreate } from "@/types/jobPost/jobPost";
import { useState } from "react";
import { JobSchedule } from "@/types/jobPost/jobSchedule";
import EmployerShiftCalendar from "@/components/EmployerShiftCalendar";

const initialValues = {
  accountId: 1,
  jobTitle: "Senior Software Engineer",
  jobDescription: "Develop and maintain backend services.",
  jobRequirement: "Proficient in C#, .NET, and SQL.",
  experienceRequirement: "5+ years in software development.",
  salary: 80000,
  salaryUnit: "Shift",
  jobLocation: "Remote",
  expireTime: "2025-01-01",
  benefit: "Health insurance, 401k, remote work",
  vacancyCount: 2,
  isOutstandingPost: true,
  jobSchedule: {
    shiftCount: 0,
    minimumShift: 0,
    jobShifts: []
  }
}

export default function CreateForm({API_KEY, MAP_ID}: Readonly<{API_KEY: string, MAP_ID: string}>) {

  const [form] = Form.useForm();
  const [location, setLocation] = useState<string | null | undefined>(null);
  const [schedule, setSchedule] = useState<JobSchedule>({
    shiftCount: 0,
    minimumShift: 0,
    jobShifts: []
  });
  const onFinish = (values: JobPostCreate) => {
    console.log("Job Post Data:", values);
  };
    return (
        <div>
          <h1>Create Job Post</h1>
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item name="JobTitle" label="Job Title" rules={[{ required: true }]}> 
                <Input /> 
            </Form.Item>
            <Form.Item name="JobDescription" label="Job Description" rules={[{ required: true }]}> 
                <Input /> 
            </Form.Item>
            <Form.Item name="JobRequirement" label="Job Requirement" rules={[{ required: true }]}> 
                <Input /> 
            </Form.Item>
            <Form.Item 
              name="ExperienceRequirement" 
              label="Experience Requirement" 
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              name="Salary" 
              label="Salary" 
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item 
              name="SalaryUnit" 
              label="Salary Unit" 
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Shift">Shift</Select.Option>
                <Select.Option value="Hour">Hour</Select.Option>
                <Select.Option value="Day">Day</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="JobLocation" 
              label="Job Location" 
              rules={[{ required: true }]}
            >
              <GoogleMap value={location} onChange={setLocation} API_KEY={API_KEY} MAP_ID={MAP_ID}></GoogleMap>
            </Form.Item>

            <Form.Item 
              name="ExpireTime" 
              label="Expire Time" 
              rules={[{ required: true }]}
            >
              <DatePicker showTime />
            </Form.Item>

            <Form.Item 
              name="Benefit" 
              label="Benefit" 
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              name="VacancyCount" 
              label="Vacancy Count" 
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item 
              name="IsOutstandingPost" 
              label="Is Outstanding Post" 
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="JobSchedule"
              label="Job Schedule"
              rules={[{ required: true }]}
            >
              <EmployerShiftCalendar value={schedule} onChange={setSchedule}></EmployerShiftCalendar>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </div>
    )
}