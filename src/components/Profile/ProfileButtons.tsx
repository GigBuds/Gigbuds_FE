"use client";

import React from "react";
import { Edit, Calendar } from "lucide-react";

interface ProfileButtonsProps {
  onEditProfile: () => void;
  onUpdateSchedule: () => void;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({
  onEditProfile,
  onUpdateSchedule,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 px-4 py-3">
      <button
        onClick={onEditProfile}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Edit size={20} />
        <span>Chỉnh sửa Profile</span>
      </button>
      
      <button
        onClick={onUpdateSchedule}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Calendar size={20} />
        <span>Cập nhật lịch trình</span>
      </button>
    </div>
  );
};

export default ProfileButtons;