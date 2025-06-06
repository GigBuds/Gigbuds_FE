"use client";

import React from "react";
import { User, Calendar, MapPin, Mail, Phone } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface PersonalInfoSectionProps {
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob?: string;
    currentLocation?: string;
  };
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ userProfile }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const personalInfo = [
    {
      icon: <User size={20} />,
      label: "Họ và tên",
      value: `${userProfile.firstName} ${userProfile.lastName}`,
    },
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: userProfile.email,
    },
    {
      icon: <Phone size={20} />,
      label: "Số điện thoại",
      value: userProfile.phoneNumber,
    },
    {
      icon: <Calendar size={20} />,
      label: "Ngày sinh",
      value: userProfile.dob ? formatDate(userProfile.dob) : "Chưa cập nhật",
    },
    {
      icon: <MapPin size={20} />,
      label: "Địa chỉ",
      value: userProfile.currentLocation || "Chưa cập nhật",
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <SectionHeader title="Thông tin cá nhân" icon={<User size={24} />} />
      <div className="divide-y divide-gray-100">
        {personalInfo.map((info, index) => (
          <div key={index} className="flex items-center gap-4 px-4 py-4">
            <div className="text-gray-500">{info.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{info.label}</p>
              <p className="text-gray-800 font-medium">{info.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfoSection;