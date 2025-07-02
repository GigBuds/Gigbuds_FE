"use client";

import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Calendar, Building2 } from 'lucide-react';
import { feedbackApi, FeedbackDto, FeedbackType } from '@/service/feedbackService/feedbackService';
import { useLoading } from '@/contexts/LoadingContext';
import ErrorComponent from '@/components/Common/ErrorComponent';

interface FeedbackSectionProps {
  jobSeekerId: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ jobSeekerId }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch feedback that job seeker received from employers
        const response = await feedbackApi.getFeedbacksByAccountId(jobSeekerId, FeedbackType.EmployerToJobSeeker);
        
        if (response.success && response.data) {
          setFeedbacks(response.data);
        } else {
          setError(response.message || 'Không thể tải đánh giá');
        }
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Đã xảy ra lỗi khi tải đánh giá');
      } finally {
        setIsLoading(false);
      }
    };

    if (jobSeekerId) {
      fetchFeedbacks();
    }
  }, [jobSeekerId, setIsLoading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const getRatingCount = (rating: number) => {
    return feedbacks.filter(feedback => feedback.rating === rating).length;
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <ErrorComponent error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Đánh giá từ nhà tuyển dụng
          </h3>
        </div>
      </div>

      <div className="p-6">
        {feedbacks.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có đánh giá nào</p>
          </div>
        ) : (
          <>
            {/* Rating Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {getAverageRating()}
                  </div>
                  <div>
                                         {renderStars(Math.round(parseFloat(getAverageRating().toString())))}
                     <p className="text-sm text-gray-600 mt-1">
                       {feedbacks.length} đánh giá
                     </p>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-2">{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <div className="w-16 h-1 bg-gray-200 rounded-full">
                        <div
                          className="h-1 bg-yellow-400 rounded-full"
                          style={{
                            width: feedbacks.length > 0 
                              ? `${(getRatingCount(rating) / feedbacks.length) * 100}%`
                              : '0%'
                          }}
                        />
                      </div>
                      <span className="text-gray-500 w-4">
                        {getRatingCount(rating)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Feedbacks */}
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {feedback.companyLogo ? (
                          <img 
                            src={feedback.companyLogo} 
                            alt={feedback.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {feedback.employerName || feedback.companyName}
                        </h4>
                        <p className="text-sm text-gray-600">{feedback.companyName}</p>
                        <p className="text-xs text-gray-500">{feedback.jobTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(feedback.createdAt)}
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderStars(feedback.rating)}
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {feedback.comment}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection; 