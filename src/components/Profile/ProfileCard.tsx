"use client";

import React from "react";

interface ProfileCardProps {
  title: string;
  subTitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  children?: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  subTitle,
  startDate,
  endDate,
  description,
  children,
}) => {
  // Function to format date to dd/mm/yyyy
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex items-start gap-4 px-4 py-5 bg-white shadow-sm border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        
        {subTitle && (
          <p className="text-gray-600 mb-2">{subTitle}</p>
        )}
        
        {(startDate || endDate) && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{formatDate(startDate)}</span>
            {startDate && endDate && <span>-</span>}
            <span>{endDate ? formatDate(endDate) : "Hiện tại"}</span>
          </div>
        )}
        
        {description && (
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default ProfileCard;