"use client";

import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Image } from "antd";

interface ProfileHeaderProps {
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatarUrl?: string;
    address?: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile }) => {
  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
  
  return (
    <div className="bg-white shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          {userProfile.avatarUrl ? (
            <Image
              src={userProfile.avatarUrl}
              alt={fullName}
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-30 h-30 bg-gray-300 rounded-full flex items-center justify-center border-4 border-blue-500">
              <User size={60} className="text-gray-600" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{fullName}</h1>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <Mail size={18} />
              <span>{userProfile.email}</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <Phone size={18} />
              <span>{userProfile.phoneNumber}</span>
            </div>
            
            {userProfile.address && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{userProfile.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;