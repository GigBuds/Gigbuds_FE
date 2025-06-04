"use client"

import { Button, DatePicker, Input, InputNumber, Switch , Form, Select } from "antd";
import GoogleMap from "@/components/map/GoogleMap";
import { JobPostCreate } from "@/types/jobPost/jobPost";
import { useState } from "react";
import { JobSchedule } from "@/types/jobPost/jobSchedule";
import EmployerShiftCalendar from "@/components/EmployerShiftCalendar";
import { useFormStatus } from "react-dom";
import { createJobPost } from "./action";
import { googleMapResponse } from "@/types/folder/GoogleMapResponse";

function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <Form.Item style={{ marginTop: 24 }}>
      <Button type="primary" htmlType="submit" loading={pending}>Submit</Button>
    </Form.Item>
  )
}

export default function CreateForm({API_KEY, MAP_ID}: Readonly<{API_KEY: string, MAP_ID: string}>) {

  const [form] = Form.useForm();
  const [googleMapResponse, setGoogleMapResponse] = useState<googleMapResponse | null | undefined>(null);
  const [schedule, setSchedule] = useState<JobSchedule>({
    shiftCount: 0,
    minimumShift: 0,
    jobShifts: []
  });
  const onFinish = async (values: JobPostCreate) => {
    console.log("Job Post Data:", values);
    const data = JSON.parse(JSON.stringify(values));
    await createJobPost(data);
  };
    return (
        <div className="max-w-5xl mx-auto p-8">
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
          <div className="w-full flex justify-center mb-8">
            <div className="w-1/2 border rounded py-3 px-6 flex items-center justify-center">
              <Form.Item name="JobTitle" label="Job Title" rules={[{ required: true }]} style={{ marginBottom: 0, width: '100%' }}> 
                  <Input variant="outlined" /> 
              </Form.Item>
            </div>
          </div>
            <div className="flex gap-6 mb-6">
              <div className="w-1/2 border rounded p-4">
                <Form.Item name="JobDescription" label="Job Description" rules={[{ required: true }]}> 
                    <Input variant="outlined" /> 
                </Form.Item>
              </div>
              <div className="w-1/2 border rounded p-4">
                <Form.Item name="JobRequirement" label="Job Requirement" rules={[{ required: true }]}> 
                    <Input variant="outlined" /> 
                </Form.Item>
              </div>
            </div>

            <div className="flex gap-6 mb-6">
              <div className="w-1/2 border rounded p-4">
                <Form.Item 
                  name="Benefit" 
                  label="Benefit" 
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
              >
                  <Input variant="outlined" />
                </Form.Item>
              </div>

              <div className="w-1/2 border rounded p-4">
                <Form.Item 
                  name="ExperienceRequirement" 
                  label="Experience Requirement" 
                  rules={[{ required: true }]}
                >
                  <Input variant="outlined" />
                </Form.Item>
              </div>
            </div>

            <div className="flex gap-6 mb-6">
              <div className="w-1/2 border rounded p-4">
                <Form.Item 
                  name="Salary" 
                  label="Salary" 
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber style={{ width: "100%" }} variant="outlined" />
                </Form.Item>
              </div>
              <div className="w-1/2 border rounded p-4">
                <Form.Item 
                  name="SalaryUnit" 
                  label="Salary Unit" 
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select variant="outlined">
                    <Select.Option value="Shift">Shift</Select.Option>
                    <Select.Option value="Hour">Hour</Select.Option>
                    <Select.Option value="Day">Day</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="w-full border rounded p-6 mb-6 min-h-[120px]">
              <Form.Item 
                name="JobLocation" 
                label="Job Location" 
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <GoogleMap value={googleMapResponse?.location} onChange={setGoogleMapResponse} API_KEY={API_KEY} MAP_ID={MAP_ID}></GoogleMap>
              </Form.Item>
            </div>

            <div className="w-full border rounded p-6 mb-6 min-h-[120px]">
              <Form.Item
                name="JobSchedule"
                label="Job Schedule"
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <EmployerShiftCalendar value={schedule} onChange={setSchedule}></EmployerShiftCalendar>
              </Form.Item>
            </div>

            <div className="flex gap-6 mt-6 mb-6">
              <div className="flex-1 border rounded p-4 flex items-center justify-center">
                <Form.Item 
                  name="ExpireTime" 
                  label="Expire Time" 
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0, width: '100%' }}
                >
                  <DatePicker showTime variant="outlined" style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <div className="flex-1 border rounded p-4 flex items-center justify-center">
                <Form.Item 
                  name="IsOutstandingPost" 
                  label="Outstanding post?" 
                  valuePropName="checked"
                  style={{ marginBottom: 0, width: '100%' }}
                >
                  <Switch />
                </Form.Item>
              </div>
            </div>

            <SubmitButton />
          </Form>
        </div>
    )
}