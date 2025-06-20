'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Smartphone, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import paymentService, { ProcessMobilePaymentRequest, ApiResponse, ProcessMobilePaymentResponse } from '@/service/paymentService';

export default function MobileIntermediatePage() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState('');

  // Extract PayOS parameters from URL
  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');

  // Call backend API to register membership and update transaction
  const processPaymentResult = useCallback(async () => {
    if (!orderCode || !status) {
      setApiStatus('error');
      setApiMessage('Missing payment parameters');
      return false;
    }

    try {
      setApiStatus('loading');
      setApiMessage('Processing payment result...');

      // Call payment service
      const request: ProcessMobilePaymentRequest = {
        orderCode: orderCode,
        status: status,
      };

      const result: ApiResponse<ProcessMobilePaymentResponse> = await paymentService.processMobilePayment(request);

      if (result.success) {
        setApiStatus('success');
        setApiMessage((result.message ?? result.data?.message) ?? 'Payment processed successfully');
        return true;
      } else {
        setApiStatus('error');
        setApiMessage((result.error ?? result.message) ?? 'Failed to process payment');
        return false;
      }
    } catch (error) {
      console.error('API call failed:', error);
      setApiStatus('error');
      setApiMessage('Network error occurred');
      return false;
    }
  }, [orderCode, status, setApiStatus, setApiMessage]);

  // Redirect to mobile app
  const redirectToMobileApp = useCallback(() => {
    if (!orderCode || !status) {
      console.error('Missing PayOS parameters');
      return;
    }
    
    setIsRedirecting(true);
    
    // Use development deep link for now - change to gigbuds:// for production APK
    const deepLinkUrl = `exp://172.20.10.8:8081/--/payment-result?status=${status}&orderCode=${orderCode}`;
    // For production APK: const deepLinkUrl = `gigbuds://payment-result?status=${status}&orderCode=${orderCode}`;
    
    console.log('Redirecting to mobile app:', deepLinkUrl);
    
    try {
      // Attempt to open mobile app
      window.location.href = deepLinkUrl;
    } catch (error) {
      console.error('Failed to redirect to mobile app:', error);
    }
  }, [orderCode, status]);

  // Process payment and then redirect
  useEffect(() => {
    if (orderCode && status) {
      const handlePaymentFlow = async () => {
        setIsProcessing(true);
        
        // First, process the payment via API
        const success = await processPaymentResult();
        
        setIsProcessing(false);
        
        if (success) {
          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            redirectToMobileApp();
          }, 2000);
        }
        // If failed, don't redirect - let user see error and try manual redirect
      };
      
      handlePaymentFlow();
    }
  }, [orderCode, status, processPaymentResult, redirectToMobileApp]);

  // Prevent page navigation and back button
  useEffect(() => {
    const preventNavigation = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const preventBackButton = () => {
      window.history.pushState(null, '', window.location.href);
    };

    // Add event listeners
    window.addEventListener('beforeunload', preventNavigation);
    window.addEventListener('popstate', preventBackButton);
    
    // Push initial state to prevent back navigation
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', preventNavigation);
      window.removeEventListener('popstate', preventBackButton);
    };
  }, []);

  if (!orderCode || !status) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center select-none">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Invalid Payment Link
              </h1>
              <p className="text-gray-600">
                Missing payment parameters. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (isRedirecting) {
      return <div className="animate-bounce"><Smartphone className="w-16 h-16 text-blue-500 mx-auto" /></div>;
    }
    
    switch (apiStatus) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto" />;
      default:
        return <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />;
    }
  };

  const getTitle = () => {
    if (isRedirecting) return 'Opening GigBuds App';
    if (isProcessing) return 'Processing Payment';
    
    switch (apiStatus) {
      case 'success':
        return 'Payment Processed Successfully';
      case 'error':
        return 'Processing Failed';
      default:
        return 'Processing Payment';
    }
  };

  const getMessage = () => {
    if (isRedirecting) return 'Redirecting you to the mobile app...';
    if (isProcessing) return 'Please wait while we process your payment...';
    return apiMessage;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center select-none">
      {/* Full screen overlay to prevent any interaction with background */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Icon */}
            <div className="mb-8">
              {getStatusIcon()}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {getTitle()}
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-8 text-lg">
              {getMessage()}
            </p>

            {/* Manual Redirect Button - only show after processing is complete */}
            {!isProcessing && (
              <button
                onClick={redirectToMobileApp}
                disabled={apiStatus === 'error'}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  apiStatus === 'error' 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                {apiStatus === 'error' ? 'Processing Failed' : 'Open GigBuds App'}
              </button>
            )}

            {/* Payment Info - Minimal */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Order:</span> #{orderCode}</p>
                <p><span className="font-medium">Status:</span> {status?.toUpperCase()}</p>
              </div>
            </div>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Please wait...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 