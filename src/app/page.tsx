"use client";
import ChartAreaInteractive from "@/components/Chart/Chart";
import React from "react";
import { useRouter } from "next/navigation";
import AdBanner from "@/components/AdBanner/AdBanner";
import GeneralCard from "@/components/GeneralCard/GeneralCard";
const Page = () => {
  const router = useRouter();

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  if (!accessToken) {
    router.push("/login");
    return null; // Prevent rendering the rest of the component
  }

  
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