"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorComponentProps {
  error: string;
  onRetry: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle size={64} className="text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Đã xảy ra lỗi</h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
        
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2 w-full"
        >
          <RefreshCw size={20} />
          <span>Thử lại</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;