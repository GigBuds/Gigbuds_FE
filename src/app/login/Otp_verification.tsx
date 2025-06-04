"use client";
import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../../ui/input-otp";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import otpService, { OtpVerificationRequest } from "@/service/otpService/otpService";
import { useRouter } from "next/navigation";
import { OtpVerificationProps } from "@/types/login.types";


const Otp_verification = ({ 
  phoneNumber = "", 
  onVerificationSuccess,
  onBack 
}: OtpVerificationProps) => {
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60); // Start with 60 seconds countdown
  const router = useRouter();

  // Initialize countdown on component mount
  useEffect(() => {
    setCountdown(60); // Start countdown when component loads
  }, []);

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpSubmit = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP 6 số");
      return;
    }

    setLoading(true);
    
    try {
      const otpData: OtpVerificationRequest = {
        phoneNumber: otpService.formatPhoneNumber(phoneNumber),
        verificationCode: otpValue,
      };

      // Validate data using the service
      const validationErrors = otpService.validateOtpData(otpData);
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        setLoading(false);
        return;
      }

      // Call the verify OTP API
      const response = await otpService.verifyOtp(otpData);
      
      if (response.success) {
        toast.success(response.message || 'Xác thực OTP thành công!');
        setIsVerified(true);
        setTimeout(() => {
        router.push('/');
          setIsVerified(false);
        }
        , 2000);
        
        // Store token if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        // Delay before calling success callback to show success message
        setTimeout(() => {
          if (onVerificationSuccess) {
            onVerificationSuccess();
          }
        }, 2000);
        
        console.log('OTP verification successful:', response);
      } else {
        toast.error(response.message || 'Xác thực OTP thất bại!');
      }
      
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error('Đã xảy ra lỗi trong quá trình xác thực OTP. Vui lòng thử lại!');
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

  const handleResendOtp = async () => {
    if (!phoneNumber) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    setResendLoading(true);
    setCountdown(60); // Reset countdown to 60 seconds
    
    
    try {
      const response = await otpService.resendOtp({
        phoneNumber: otpService.formatPhoneNumber(phoneNumber)
      });
      
      if (response.success) {
        toast.success(response.message || 'Mã OTP đã được gửi lại!');
        setOtpValue(""); // Clear current OTP
        setCountdown(60); // Start 60-second countdown
      } else {
        toast.error(response.message || 'Không thể gửi lại mã OTP!');
      }
      
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      toast.error('Đã xảy ra lỗi khi gửi lại mã OTP. Vui lòng thử lại!');
    } finally {
      setResendLoading(false);
    }
  };

  // Success screen
  if (isVerified) {
    return (
      <div className="flex items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-8 w-full justify-center items-center flex flex-col text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Success message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold text-orange-500 mb-3"
          >
            Xác thực thành công!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6 text-sm"
          >
            Tài khoản của bạn đã được xác thực thành công.
            <br />
            Bạn sẽ được chuyển hướng trong giây lát...
          </motion.p>

          {/* Loading animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex space-x-1"
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // OTP input screen
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 justify-center items-center flex flex-col mb-4"
      >
        <p className="text-2xl font-semibold">Xác thực OTP</p>
        <p className="text-sm mb-[5%] text-center">
          Mã xác thực đã được gửi qua SMS đến số {phoneNumber}
        </p>
        
        <div className="w-full flex justify-center items-center mb-6">
          <InputOTP 
            maxLength={6} 
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Resend OTP button */}
        <div className="mb-4 text-center flex flex-col items-center">
          <span className="text-sm text-gray-600">Chưa nhận được mã? </span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading || countdown > 0}
            className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600'} hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {resendLoading 
              ? 'Đang gửi...' 
              : countdown > 0 
                ? `Gửi lại (${countdown}s)` 
                : 'Gửi lại'
            }
          </button>
        </div>

        {/* Submit button */}
        <motion.button
          type="button"
          onClick={handleOtpSubmit}
          disabled={loading || otpValue.length !== 6}
          className={`w-full text-[100%] py-3 rounded-lg mb-3 ${
            loading || otpValue.length !== 6
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-black text-white'
          }`}
          initial={{ scale: 1, background: "black", color: "white" }}
          whileTap={!loading && otpValue.length === 6 ? { scale: 0.95 } : {}}
          whileHover={!loading && otpValue.length === 6 ? {
            scale: 1.05,
            color: "black",
            background: "linear-gradient(90deg, #FF7345 33.76%, #FFDC95 99.87%)",
          } : {}}
        >
          {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
        </motion.button>

        {/* Back button */}
        {onBack && (
          <motion.button
            type="button"
            onClick={onBack}
            className="w-full text-[100%] py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            Quay lại
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Otp_verification;