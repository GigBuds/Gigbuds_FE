"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProfileCard from "./ProfileCard";

interface Education {
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
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
            title={`${education.degree} - ${education.fieldOfStudy}`}
            subTitle={education.institutionName}
            startDate={education.startDate}
            endDate={education.endDate}
          >
            {education.gpa && (
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                  GPA: {education.gpa}
                </span>
              </div>
            )}
          </ProfileCard>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;