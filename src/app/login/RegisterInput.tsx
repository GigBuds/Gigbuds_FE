import React, { useState } from "react";
import { motion } from "framer-motion";
import { DatePicker, Form, Input, Select } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import registerService, { RegisterRequest } from "@/service/registerService/registerService";
import Otp_verification from "./Otp_verification";
import { RegisterFormValues } from "@/types/login.types";


const RegisterInput = () => {
  const [form] = Form.useForm<RegisterFormValues>();
  const dateFormatList = ['DD/MM/YYYY'];
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    
    try {
      // Format the data to match RegisterRequest interface
      const registerData: RegisterRequest = {
        dob: values.dob ? dayjs(values.dob).toISOString() : new Date().toISOString(),
        firstName: values.firstName!,
        lastName: values.lastName!,
        email: values.email!,
        password: values.password!,
        socialSecurityNumber: values.socialSecurityNumber!,
        phoneNumber: values.phone!,
        isMale: values.gender!,
        businessEmail: values.businessEmail!,
      };

      // Validate data using the service
      const validationErrors = registerService.validateRegistrationData(registerData);
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        setLoading(false);
        return;
      }

      // Call the register API
      const response = await registerService.register(registerData);
      
      if (response.success) {
        toast.success(response.message || 'Đăng ký thành công!');
        setUserPhoneNumber(values.phone!);
        setIsSuccess(true);
        form.resetFields();
        
        console.log('Registration successful:', response);
      } else {
        toast.error(response.message || 'Đăng ký thất bại!');
      }
      
    } catch (error: unknown) {
      console.error('Registration error:', error);
      
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại!');
      }
      
      // Handle specific error cases
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        const errorObj = error as { errors: Record<string, string[]> };
        Object.values(errorObj.errors).flat().forEach((errorMsg: string) => {
          toast.error(errorMsg);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    toast.success('Xác thực thành công! Đăng ký hoàn tất.');
    // Redirect to login or dashboard
    // You can add navigation logic here
  };

  const handleBackToForm = () => {
    setIsSuccess(false);
  };

  return (
    <div className={`w-full h-[25vw] ${isSuccess ? '' : 'overflow-y-auto'}`}>
      {isSuccess ? (
        <Otp_verification
          phoneNumber={userPhoneNumber}
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBackToForm}
        />
      ) : (
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: "2%",
            height: "100%",
          }}
        >
          <div className="flex flex-row justify-between items-end">
            <Form.Item
              label="Họ người đại diện"
              name="firstName"
              rules={[
                { required: true, message: "Vui lòng nhập họ người đại diện!" },
              ]}
              style={{ marginBottom: "5%", width: "40%" }}
            >
              <Input
                placeholder="Nguyễn"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </Form.Item>
            <Form.Item
              label="Tên người đại diện"
              name="lastName"
              rules={[
                { required: true, message: "Vui lòng nhập tên người đại diện!" },
              ]}
              style={{ marginBottom: "5%", width: "50%" }}
            >
              <Input
                placeholder="Văn A"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </Form.Item>
          </div>
          
          <div className="flex flex-row justify-between items-end">
            <Form.Item
              label="Ngày Sinh"
              name="dob"
              rules={[
                { required: true, message: "Vui lòng nhập ngày sinh!" },
              ]}
              style={{ marginBottom: "5%", width: "55%" }}
            >
              <DatePicker defaultValue={dayjs('01/01/2000', dateFormatList[0])} format={dateFormatList} />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập Số điện thoại" },
                {
                  pattern:
                    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
              style={{ marginBottom: "5%", width: "40%" }}
            >
              <Input
                prefix="+84"
                type="tel"
                placeholder="0908xxxxxx"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between items-end">
            <Form.Item
              label="Căn cước công dân"
              name="socialSecurityNumber"
              rules={[
                { required: true, message: "Vui lòng nhập CCCD!" },
              ]}
              style={{ marginBottom: "5%", width: "55%" }}
            >
              <Input
                placeholder="Số CCCD"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[
                { required: true, message: "Vui lòng chọn giới tính" },
              ]}
              style={{ marginBottom: "5%", width: "40%" }}
            >
              <Select
                style={{ width: '100%' }}
                allowClear
                options={[{ value: true, label: "Nam" }, { value: false, label: "Nữ" }]}
                placeholder="Chọn giới tính"
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Email cá nhân"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            style={{ marginBottom: "5%" }}
          >
            <Input
              placeholder="gigbuds30@gmail.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </Form.Item>
          <Form.Item
            label="Email doanh nghiệp"
            name="businessEmail"
            rules={[
              { required: true, message: "Vui lòng nhập email doanh nghiệp!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            style={{ marginBottom: "5%" }}
          >
            <Input
              placeholder="business@gigbuds.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
            ]}
            style={{ marginBottom: "5%" }}
          >
            <Input.Password
              allowClear
              placeholder="Mật khẩu của bạn"
              iconRender={(visible) =>
                visible ? <FaRegEye /> : <FaRegEyeSlash />
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10%" }}
            label="Xác nhận Mật khẩu"
            name="confirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu của bạn!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Hai mật khẩu bạn đã nhập không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              allowClear
              placeholder="Xác nhận mật khẩu của bạn"
              iconRender={(visible) =>
                visible ? <FaRegEye /> : <FaRegEyeSlash />
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </Form.Item>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Form.Item>
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full text-[100%] py-3 rounded-lg ${
                  loading 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-black text-white'
                }`}
                initial={{ scale: 1, background: "black", color: "white" }}
                whileTap={!loading ? { scale: 0.95 } : {}}
                whileHover={!loading ? {
                  scale: 1.05,
                  color: "black",
                  background:
                    "linear-gradient(90deg, #FF7345 33.76%, #FFDC95 99.87%)",
                } : {}}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </motion.button>
            </Form.Item>
          </motion.div>
        </Form>
      )}
    </div>
  );
};

export default RegisterInput;
