"use client";

import React from "react";
import { Wrench } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface Skill {
  id: string;
  skillName: string;
  level?: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <SectionHeader title="Kỹ năng" icon={<Wrench size={24} />} />
        <div className="p-4 text-gray-500 text-center">
          Chưa có thông tin kỹ năng
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <SectionHeader title="Kỹ năng" icon={<Wrench size={24} />} />
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2"
            >
              <span>{skill.skillName}</span>
              {skill.level && (
                <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs">
                  {skill.level}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;