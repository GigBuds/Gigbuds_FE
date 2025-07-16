"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Star, MessageSquare, Send, X } from 'lucide-react';
import { Application } from '@/types/applicationService';
import { feedbackApi, CreateFeedbackDto, FeedbackType } from '@/service/feedbackService/feedbackService';
import { useLoading } from '@/contexts/LoadingContext';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectUser } from '@/lib/redux/features/userSlice';
import toast from 'react-hot-toast';

interface FeedbackDialogProps {
  application: Application;
  onFeedbackSubmitted: () => void;
  children: React.ReactNode;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ 
  application, 
  onFeedbackSubmitted, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoading } = useLoading();
  const user = useAppSelector(selectUser);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Vui lòng nhập ít nhất 10 ký tự cho nhận xét');
      return;
    }

    if (!application.jobHistoryId || application.jobHistoryId === 0) {
      toast.error('Không tìm thấy thông tin lịch sử công việc');
      return;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      const feedbackData: CreateFeedbackDto = {
        jobSeekerId: parseInt(application.accountId),
        employerId: user.id!,
        jobHistoryId: application.jobHistoryId || 0, // Use actual jobHistoryId from application
        rating: rating,
        comment: comment.trim(),
        feedbackType: FeedbackType.EmployerToJobSeeker
      };

      console.log('Submitting feedback with data:', feedbackData);

      const response = await feedbackApi.createFeedback(feedbackData);

      if (response.success) {
        toast.success('Đánh giá đã được gửi thành công!');
        setIsOpen(false);
        setRating(0);
        setComment('');
        onFeedbackSubmitted();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 rounded transition-colors hover:bg-gray-100"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Rất không hài lòng';
      case 2: return 'Không hài lòng';
      case 3: return 'Bình thường';
      case 4: return 'Hài lòng';
      case 5: return 'Rất hài lòng';
      default: return 'Chọn số sao để đánh giá';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Đánh giá ứng viên
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Candidate Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {application.firstName?.[0]}{application.lastName?.[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {application.firstName} {application.lastName}
                </h3>
                <p className="text-sm text-gray-600">{application.jobPosition}</p>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Đánh giá tổng thể *
            </label>
            <div className="flex flex-col items-center gap-2">
              {renderStars()}
              <p className="text-sm text-gray-600">
                {getRatingText(hoveredRating || rating)}
              </p>
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Nhận xét chi tiết *
            </label>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Chia sẻ kinh nghiệm làm việc với ứng viên này. Điều gì bạn đánh giá cao? Có điểm nào cần cải thiện không?"
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tối thiểu 10 ký tự</span>
              <span>{comment.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog; 