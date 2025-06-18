"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProfileCard from "./ProfileCard";

export interface Education {
  id: string;
  major: string;
  schoolName: string;
  startDate: string;
  endDate?: string;
}

interface EducationSectionProps {
  educations: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  if (!educations || educations.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <SectionHeader title="Học vấn" icon={<GraduationCap size={24} />} />
        <div className="p-4 text-gray-500 text-center">
          Chưa có thông tin học vấn
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <SectionHeader title="Học vấn" icon={<GraduationCap size={24} />} />
      <div className="divide-y divide-gray-100">
        {educations.map((education) => (
          <ProfileCard
            key={education.id}
            title={education.major }
            subTitle={education.schoolName}
            startDate={education.startDate}
            endDate={education.endDate}
          >
           
          </ProfileCard>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;