"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProfileCard from "./ProfileCard";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <SectionHeader title="Kinh nghiệm làm việc" icon={<Briefcase size={24} />} />
        <div className="p-4 text-gray-500 text-center">
          Chưa có thông tin kinh nghiệm làm việc
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <SectionHeader title="Kinh nghiệm làm việc" icon={<Briefcase size={24} />} />
      <div className="divide-y divide-gray-100">
        {experiences.map((experience) => (
          <ProfileCard
            key={experience.id}
            title={experience.title}
            subTitle={experience.company}
            startDate={experience.startDate}
            endDate={experience.endDate}
            description={experience.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;