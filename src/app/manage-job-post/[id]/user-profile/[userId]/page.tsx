/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ErrorComponent from "@/components/Common/ErrorComponent";
import SkillsSection from "@/components/Profile/SkillsSection";
import ExperienceSection from "@/components/Profile/ExperienceSection";
import EducationSection from "@/components/Profile/EducationSection";
import PersonalInfoSection from "@/components/Profile/PersonalInfoSection";
import FeedbackSection from "@/components/Profile/FeedbackSection";
import { useLoading } from "@/contexts/LoadingContext";
import jobSeekerService from "@/service/jobSeekerService/JobSeekerService";

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
  accountExperienceTags: any[]; // Changed to any[] to handle API data flexibility
  educationalLevels: any[]; // Changed to any[] to handle API data flexibility
}

const UserProfilePage = () => {
  const params = useParams();
  const userId = params.userId as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { setIsLoading } = useLoading();
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
        const profileData = response.data as unknown as UserProfile;
        setUserProfile(profileData);
        console.log("User Profile loaded:", profileData);
      } else {
        setError(response.error ?? "Không thể tải thông tin profile");
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      setError(err.message ?? "Đã xảy ra lỗi khi tải thông tin profile");
    } finally {
      setIsLoading(false);
    }
  }, [userId, setIsLoading]); // Removed userProfile from dependencies

  const handleRetry = useCallback(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);


  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);

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
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Đang tải thông tin profile...</p>
        </div>
      </div>
    );
  }

  // Helper function to safely map experience data
  const mapExperienceData = (experiences: any[]) => {
    return experiences?.map(exp => ({
      id: exp.id || String(Math.random()),
      jobPosition: exp.title || exp.jobPosition || 'Chưa cập nhật',
      company: exp.company || exp.companyName || 'Chưa cập nhật',
      startDate: exp.startDate || exp.fromDate || '',
      endDate: exp.endDate || exp.toDate || undefined,
      description: exp.description || exp.jobDescription || undefined
    })) || [];
  };

  // Helper function to safely map education data
  const mapEducationData = (educations: any[]) => {
    return educations?.map(edu => ({
      id: edu.id || String(Math.random()),
      major: edu.fieldOfStudy || edu.major || 'Chưa cập nhật',
      schoolName: edu.institutionName || edu.schoolName || 'Chưa cập nhật',
      startDate: edu.startDate || edu.fromDate || '',
      endDate: edu.endDate || edu.toDate || undefined,
      degree: edu.degree || edu.level || 'Chưa cập nhật'
    })) || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        <ProfileHeader userProfile={userProfile} />

        <div className="pt-2.5 pb-5 px-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          
          <SkillsSection skills={userProfile.skillTags || []} />
          
          <ExperienceSection 
            experiences={mapExperienceData(userProfile.accountExperienceTags)} 
          />
          
          <EducationSection 
            educations={mapEducationData(userProfile.educationalLevels)} 
          />
          
          <PersonalInfoSection userProfile={userProfile} />
          
          <FeedbackSection jobSeekerId={userId} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;