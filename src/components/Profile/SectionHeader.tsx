"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border-b border-gray-200">
      {icon && <div className="text-blue-500">{icon}</div>}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

export default SectionHeader;