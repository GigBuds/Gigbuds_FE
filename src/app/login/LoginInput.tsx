import React, { useState } from "react";
import { motion } from "framer-motion";
import { Form, Input, Button, Checkbox } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import { loginApi } from "@/service/loginService/loginService";


const LoginInput = () => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  // Only need loading state since Ant Design Form handles form values
  const [loading, setLoading] = useState(false);

  interface FormValues {
    email: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      console.log('Calling API with:', values.email, values.password);
      const response = await loginApi.login(values.email, values.password);
      
      // Handle successful login
      toast.success("Login successful!");
      console.log("Login response:", response);
      
      
      if(response.access_token)
      {
        document.cookie = `accessToken=${response.access_token}; path=/; max-age=604800`; 
        }
        if (response.id_token) {
          document.cookie = `authToken=${response.id_token}; path=/; max-age=604800`;
        }
        if (response.refresh_token) {
          document.cookie = `refreshToken=${response.refresh_token}; path=/; max-age=604800`;
        }

      
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginTop: "2%",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          style={{ marginBottom: "2%" }}
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
          style={{ marginBottom: "2%" }}
        >
          <Input.Password
            type="password"
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <FaRegEye /> : <FaRegEyeSlash />
            }
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </Form.Item>
        <motion.div className="flex flex-row justify-between items-center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>
          <Form.Item noStyle>
            <Button
              type="link"
              htmlType="button"
              className="text-blue-500 hover:text-blue-700"
            >
              Quên mật khẩu?
            </Button>
          </Form.Item>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Form.Item style={{ marginTop: "5%" }}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full text-[100%] bg-black text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ scale: 1, background: "black", color: "white" }}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: loading ? 1 : 1.05,
                color: "black",
                background: loading ? "black" :
                  "linear-gradient(90deg, #FF7345 33.76%, #FFDC95 99.87%)",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
            <div className="w-full flex items-center justify-center mt-[5%]">
              <GoogleLoginButton clientId={googleClientId} />
            </div>
          </Form.Item>
        </motion.div>
      </Form>
    </div>
  );
};

export default LoginInput;
