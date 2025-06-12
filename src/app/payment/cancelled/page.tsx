'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, Home, Info } from 'lucide-react';

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderCode = searchParams.get('orderCode');
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

  if (!orderCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-gray-500" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Cancelled Header */}
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-100 text-lg">Your payment has been cancelled</p>
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
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Cancelled
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cancelled Time:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Payment Cancelled</h4>
                <div className="text-blue-700 space-y-2">
                  <p>Your payment was cancelled and no charges were made.</p>
                  <p>This could happen if you:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Closed the payment window</li>
                    <li>Cancelled the payment at the bank page</li>
                    <li>The payment took too long to complete</li>
                  </ul>
                  <p className="text-sm">You can try making the payment again at any time.</p>
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

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>No charges were made to your account. If you have questions, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 