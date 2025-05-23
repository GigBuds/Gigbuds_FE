import React from "react";
import { motion } from "framer-motion";
import { Form, Input } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast'; // Import toast and Toaster

// Define an interface for the form values
interface RegisterFormValues {
  email?: string;
  password?: string;
  confirm?: string;
}

const RegisterInput = () => {
  const [form] = Form.useForm<RegisterFormValues>();

  // Define the onFinish handler for registration
  const onFinish = (values: RegisterFormValues) => {
    toast.success(`Received values of form: ${JSON.stringify(values)}`);
    toast.success("Registration successful!");
    form.resetFields();
  };

  return (
    <div>
      <Form
        form={form}
        name="register"
        layout="vertical" // Added for consistent label placement
        onFinish={onFinish} // Use the onFinish handler
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginTop: "2%",
        }}
      >
        <div className="flex flex-row justify-between items-start">
          <Form.Item
            label="Tên doanh nghiệp" 
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên doanh nghiệp!" },
            ]}
            style={{ marginBottom: "5%", width: "55%" }} // Adjusted width for better layout
          >
            <Input
              placeholder="GigBuds Company"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </Form.Item>
          <Form.Item
              label="Số điện thoại" // Use the label prop
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập Số điện thoại" },
                    {
                    pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                    message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                  style={{ marginBottom: "5%", width: "40%" }} // Adjusted width for better layout

          >
            <Input
              prefix="+84"
              type="tel"
              placeholder="0908xxxxxx"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </Form.Item>
        </div>
        
        <Form.Item
          label="Email doanh nghiệp" // Use the label prop
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
          label="Mật khẩu" // Use the label prop
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}
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
          label="Xác nhận Mật khẩu" // Use the label prop
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu của bạn!" },
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
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" // Corrected ring color
          />
        </Form.Item>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Form.Item >
            <motion.button
              type="submit"
              className="w-full text-[100%] bg-black text-white py-3 rounded-lg "
              initial={{ scale: 1, background: "black", color: "white" }}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                color: "black",
                background:
                  "linear-gradient(90deg, #FF7345 33.76%, #FFDC95 99.87%)",
              }}
            >
              Đăng kí
            </motion.button>
          </Form.Item>
        </motion.div>
      </Form>
    </div>
  );
};

export default RegisterInput;
