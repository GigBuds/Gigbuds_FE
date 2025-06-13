'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, Home, RefreshCw, Phone, Mail } from 'lucide-react';

export default function PaymentErrorPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/membership');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Error Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Error</h1>
          <p className="text-red-100 text-lg">Something unexpected happened during payment processing</p>
        </div>

        {/* Error Details */}
        <div className="p-8">
          {/* Error Information */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-2">What happened?</h4>
                <div className="text-red-700 space-y-2">
                  <p>An unexpected error occurred while processing your payment. This could be due to:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li>Temporary system maintenance</li>
                    <li>Network connectivity issues</li>
                    <li>Payment gateway temporary unavailability</li>
                    <li>Browser or app compatibility issues</li>
                  </ul>
                  <p className="text-sm font-medium">Dont worry - no charges were made to your account.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">What you can do:</h4>
            <div className="text-blue-700 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <p>Try refreshing the page and attempting the payment again</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <p>Check your internet connection and try again</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <p>Clear your browser cache and cookies, then try again</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <p>Try using a different browser or device</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

          {/* Contact Support */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Still having trouble?</h4>
              <p className="text-gray-600">Our support team is ready to help you resolve this issue.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="font-medium text-gray-900 mb-1">Call Us</h5>
                <p className="text-sm text-gray-600 mb-3">Available 24/7 for payment issues</p>
                <button
                  onClick={() => window.open('tel:+84-123-456-789')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  +84 123 456 789
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="font-medium text-gray-900 mb-1">Email Support</h5>
                <p className="text-sm text-gray-600 mb-3">We will respond within 1 hour</p>
                <button
                  onClick={() => window.open('mailto:support@gigbuds.com')}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  support@gigbuds.com
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/support')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Visit our Support Center →
              </button>
            </div>
          </div>

          {/* Reference Number */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Error Reference ID:</p>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                ERR_{new Date().getTime()}_{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </code>
              <p className="text-xs text-gray-500 mt-2">
                Please provide this reference ID when contacting support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 