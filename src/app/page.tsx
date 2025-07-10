"use client";
import "@ant-design/v5-patch-for-react-19";
import ChartAreaInteractive from "@/components/Chart/Chart";
import React, { useEffect } from "react";
import AdBanner from "@/components/AdBanner/AdBanner";
import GeneralCard from "@/components/GeneralCard/GeneralCard";
import { useRouter } from "next/navigation";

const Page = () => {
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  const router = useRouter();
  useEffect(() => {
      if (!accessToken) router.push("/login");
  }, [router , accessToken]);


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