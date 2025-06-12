'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, Clock, RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');
  const amount = searchParams.get('amount');
  const description = searchParams.get('description');

  const formatCurrency = (amount: string | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(amount));
  };

  const handleRetry = () => {
    router.push('/membership');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const getStatusIcon = () => {
    switch (status?.toUpperCase()) {
      case 'EXPIRED':
        return <Clock className="w-12 h-12 text-orange-500" />;
      case 'CANCELLED':
        return <XCircle className="w-12 h-12 text-gray-500" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status?.toUpperCase()) {
      case 'EXPIRED':
        return 'from-orange-500 to-orange-600';
      case 'CANCELLED':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-red-500 to-red-600';
    }
  };

  const getStatusBgColor = () => {
    switch (status?.toUpperCase()) {
      case 'EXPIRED':
        return 'from-orange-50 to-yellow-50';
      case 'CANCELLED':
        return 'from-gray-50 to-slate-50';
      default:
        return 'from-red-50 to-pink-50';
    }
  };

  const getFailureMessage = (status: string | null) => {
    switch (status?.toUpperCase()) {
      case 'EXPIRED':
        return 'Payment link has expired. Please try again.';
      case 'CANCELLED':
        return 'Payment was cancelled.';
      case 'FAILED':
        return 'Payment processing failed. Please try again.';
      default:
        return 'Payment was not completed. Please try again.';
    }
  };

  if (!orderCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Payment Link</h2>
            <p className="text-gray-600 mb-6">Order code not found in the URL.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getStatusBgColor()} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Failed Header */}
        <div className={`bg-gradient-to-r ${getStatusColor()} p-8 text-center text-white`}>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            {getStatusIcon()}
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment {status || 'Failed'}</h1>
          <p className="text-opacity-90 text-lg">{getFailureMessage(status)}</p>
        </div>

        {/* Payment Details */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Code:</span>
                <span className="font-medium text-gray-900">#{orderCode}</span>
              </div>
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900 text-lg">
                    {formatCurrency(amount)}
                  </span>
                </div>
              )}
              {description && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-gray-900 text-right max-w-64">
                    {description}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status?.toUpperCase() === 'EXPIRED' 
                    ? 'bg-orange-100 text-orange-800'
                    : status?.toUpperCase() === 'CANCELLED'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status || 'Failed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attempt Time:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {/* Helpful Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">What happened?</h4>
                <div className="text-blue-700 space-y-2">
                  {status?.toUpperCase() === 'EXPIRED' && (
                    <p>Your payment link has expired. Payment links are valid for a limited time for security reasons.</p>
                  )}
                  {status?.toUpperCase() === 'CANCELLED' && (
                    <p>The payment was cancelled. This could be due to user cancellation or bank decline.</p>
                  )}
                  {(!status || status?.toUpperCase() === 'FAILED') && (
                    <p>The payment could not be processed. This might be due to insufficient funds, network issues, or bank restrictions.</p>
                  )}
                  <p className="text-sm">Don't worry - no charges were made to your account.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGoHome}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Homepage
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need help? Our support team is here to assist you.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <button 
                onClick={() => router.push('/support')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => router.push('/faq')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 