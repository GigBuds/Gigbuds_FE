"use client";
import "@ant-design/v5-patch-for-react-19";
import ChartAreaInteractive from "@/components/Chart/Chart";
import React from "react";
import AdBanner from "@/components/AdBanner/AdBanner";
import GeneralCard from "@/components/GeneralCard/GeneralCard";
const Page = () => {
  return (
    <div className="  px-2  items-center w-full h-full flex flex-col gap-4">
      <AdBanner/>
      <GeneralCard />
    <div className="w-[80%] items-center justify-center m-auto">
      <ChartAreaInteractive />
    </div>
      
    </div>
  );
};

export default Page;