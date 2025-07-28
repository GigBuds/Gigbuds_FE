import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Input, Button, Checkbox } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import { FormValues } from "@/types/login.types";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/lib/redux/features/userSlice";

const LoginInput = () => {
  const router = useRouter();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const {setIsLoading, isLoading} = useLoading();
  const {login} = useAuth();
  const user = useAppSelector(selectUser);
  if (user.id !== null) router.push("/");

  const onFinish = async (values: FormValues) => {

    setIsLoading(true);
    try {
      const response = await login(values.identifier, values.password);
      
      if (response?.id_token) {
        // Handle successful login
        toast.success("Login successful!");
        setTimeout(() => {
        setIsLoading(false); 
      }, 2000);
      } else {
        toast.error("Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user.roles?.includes("Admin")) {
      router.push("/admin/dashboard");
    } else if (user.roles?.includes("Employer") || user.roles?.includes("JobSeeker")) {
      router.push("/manage-job-post");
    }
  }, [user, router]);

  
  // Custom validation function for identifier
  const validateIdentifier = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Please input your email or phone number!'));
    }
    
    // Check if it's a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if it's a valid phone number format (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    
    return Promise.reject(new Error('Please enter a valid email or phone number!'));
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
          label="Email or Phone Number"
          name="identifier"
          style={{ marginBottom: "2%" }}
          rules={[
            { validator: validateIdentifier }
          ]}
        >
          <Input
            placeholder="Enter email or phone number"
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
              disabled={isLoading}
              className="w-full text-[100%] bg-black text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ scale: 1, background: "black", color: "white" }}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: isLoading ? 1 : 1.05,
                color: "black",
                background: isLoading ? "black" :
                  "linear-gradient(90deg, #FF7345 33.76%, #FFDC95 99.87%)",
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
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
