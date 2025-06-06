"use client";
import "@ant-design/v5-patch-for-react-19";
import ChartAreaInteractive from "@/components/Chart/Chart";
import Image from "next/image";
import React from "react";
import banner from "../../public/BannerAd.png";
import { useRouter } from "next/navigation";
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
    <div className=" py-4 px-8 justify-center items-center w-full h-full flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center w-full gap-[2%]">
        <Image
          src={banner}
          alt="Banner Ad"
          className="w-[40%] h-[80%] object-contain"
          style={{ objectFit: "cover" }}
        
        />
        <Image
          src={banner}
          alt="Banner Ad"
          className="w-[40%] h-[80%] object-contain"
          style={{ objectFit: "cover" }}

        />
      </div>
      <div>

      </div>
    <div className="w-full items-center justify-center m-auto">
      <ChartAreaInteractive />
    </div>
      
    </div>
  );
};

export default Page;