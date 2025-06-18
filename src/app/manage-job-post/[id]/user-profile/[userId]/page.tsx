/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ErrorComponent from "@/components/Common/ErrorComponent";
import ProfileButtons from "@/components/Profile/ProfileButtons";
import SkillsSection from "@/components/Profile/SkillsSection";
import ExperienceSection from "@/components/Profile/ExperienceSection";
import EducationSection from "@/components/Profile/EducationSection";
import PersonalInfoSection from "@/components/Profile/PersonalInfoSection";
import { useLoading } from "@/contexts/LoadingContext";
import jobSeekerService from "@/service/jobSeekerService/JobSeekerService";
import { Experience } from "@/components/Profile/ExperienceSection";
import { Education } from "@/components/Profile/EducationSection";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: string;
  skillTags: Array<{
    id: string;
    skillName: string;
    level?: string;
  }>;
  accountExperienceTags: Experience[];
  educationalLevels: Education[];
}

const UserProfilePage = () => {
  const params = useParams();
  const userId = params.userId as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const {setIsLoading} = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const response = await jobSeekerService.getJobSeekerById(userId);

      if (response.success) {
        setUserProfile(response.data as unknown as UserProfile);
      } else {
        setError(response.error ?? "Không thể tải thông tin profile");
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      setError(err.message ?? "Đã xảy ra lỗi khi tải thông tin profile");
    } finally {
      console.log("User Profile:", userProfile);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [userId, setIsLoading, userProfile]);

  const handleRetry = () => {
    fetchUserProfile();
  };

  const handleEditProfile = () => {
    console.log("Edit Profile Pressed");
  };

  const handleUpdateSchedule = () => {
    console.log("Update Schedule Pressed");
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorComponent error={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Không tìm thấy thông tin profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        <ProfileHeader userProfile={userProfile} />

        <div className="pt-2.5 pb-5 px-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <ProfileButtons 
            onEditProfile={handleEditProfile}
            onUpdateSchedule={handleUpdateSchedule}
          />
          
          <SkillsSection skills={userProfile.skillTags} />
          
          <ExperienceSection experiences={userProfile.accountExperienceTags.map(exp => ({
            ...exp,
            jobPosition: exp.title
          }))} />
          
          <EducationSection educations={userProfile.educationalLevels.map(edu => ({
            ...edu,
            major: edu.fieldOfStudy,
            schoolName: edu.institutionName
          }))} />
          
          <PersonalInfoSection userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;