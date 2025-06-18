"use client";
import "@ant-design/v5-patch-for-react-19";
import ChartAreaInteractive from "@/components/Chart/Chart";
import React, { useEffect } from "react";
import AdBanner from "@/components/AdBanner/AdBanner";
import GeneralCard from "@/components/GeneralCard/GeneralCard";
import { useRouter } from "next/navigation";

async function GetAccessToken() {
  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.token;
  } catch {
    return null;
  }
}
const Page = () => {
  const router = useRouter();
  useEffect(() => {
    GetAccessToken().then((accessToken) => {
      if (!accessToken) router.push("/login");
    });
  }, [router]);

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