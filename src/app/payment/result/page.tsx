'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentResult {
  success: boolean;
  message: string;
  orderCode?: string;
  amount?: number;
}

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract parameters from URL
  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const handlePaymentReturn = async () => {
      if (!orderCode || !status) {
        setError('Missing payment parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}payments/return?orderCode=${orderCode}&status=${status}`;
        console.log('Making API call to:', apiUrl);
        console.log('Environment API URL:', process.env.NEXT_PUBLIC_BASE_URL);
        
        // Call the backend payment return API
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('API Response:', { status: response.status, data });
        
        if (response.ok) {
          setResult({
            success: data.success,
            message: data.message,
            orderCode: orderCode,
            amount: amount ? parseFloat(amount) : undefined,
          });
        } else {
          setResult({
            success: false,
            message: data.message || 'Payment processing failed',
            orderCode: orderCode,
          });
        }
      } catch (err) {
        console.error('Payment return error:', err);
        setError('Failed to process payment result');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentReturn();
  }, [orderCode, status, amount]);

  const getStatusInfo = () => {
    if (error) {
      return {
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        title: 'Error',
        message: error,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
      };
    }

    if (!result) return null;

    if (result.success) {
      return {
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        title: 'Payment Successful!',
        message: result.message,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
      };
    } else {
      const isCancelled = status?.toLowerCase() === 'cancelled';
      return {
        icon: isCancelled ? (
          <AlertCircle className="w-16 h-16 text-yellow-500" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500" />
        ),
        title: isCancelled ? 'Payment Cancelled' : 'Payment Failed',
        message: result.message,
        bgColor: isCancelled ? 'bg-yellow-50' : 'bg-red-50',
        borderColor: isCancelled ? 'border-yellow-200' : 'border-red-200',
        textColor: isCancelled ? 'text-yellow-800' : 'text-red-800',
      };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className={`bg-white rounded-lg shadow-md p-8 text-center border-2 ${statusInfo?.borderColor || 'border-gray-200'}`}>
          {/* Status Icon */}
          <div className="mb-6">
            {statusInfo?.icon}
          </div>

          {/* Title */}
          <h1 className={`text-2xl font-bold mb-4 ${statusInfo?.textColor || 'text-gray-800'}`}>
            {statusInfo?.title}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {statusInfo?.message}
          </p>

          {/* Order Details */}
          {result && (
            <div className={`p-4 rounded-lg mb-6 ${statusInfo?.bgColor || 'bg-gray-50'}`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Code:</span>
                  <span className="font-mono text-sm font-semibold">#{orderCode}</span>
                </div>
                {result.amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-semibold">${result.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-semibold ${statusInfo?.textColor || 'text-gray-800'}`}>
                    {status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {result?.success ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/memberships')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  View Memberships
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/memberships')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/help')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Get Help
                </button>
              </>
            )}
            
            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info for Failed Payments */}
        {result && !result.success && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What happened?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Your payment was not processed successfully</p>
              <p>• No charges were made to your account</p>
              <p>• You can try again or contact support if needed</p>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need help?</strong> Contact our support team with order code #{orderCode}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
