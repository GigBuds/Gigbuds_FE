import React, { useState } from "react";
import { motion } from "framer-motion";
import { Form, Input, Button, Checkbox } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton"; // Import the new component

const LoginInput = () => {
  // Hardcoded credentials
  const hardcodedEmail = "user@example.com";
  const hardcodedPassword = "password123";
  const googleClientId = "241960034452-v8jacgqpanfnkjv6ds11d7su18nkvspi.apps.googleusercontent.com";

  // State for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface FormValues {
    email: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = (values: FormValues) => {
    if (
      values.email === hardcodedEmail &&
      values.password === hardcodedPassword
    ) {
      toast.success("Login success!");
      toast.success(
        values.email + " " + values.password + " " + values.remember
      );
      console.log("Login successful:", values);
    } else {
      toast.error("Invalid email or password.");
      console.log("Login failed:", values);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
            value={email}
            onChange={handleEmailChange}
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
            value={password}
            onChange={handlePasswordChange}
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
              Sign In
            </motion.button>
            {/* Replace the old GoogleLogin with the new component */}
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
