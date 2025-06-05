"use client";
import ChartAreaInteractive from "@/components/Chart/Chart";
import Image from "next/image";
import React from "react";
import banner from "../../public/BannerAd.png";
const page = () => {
  const cardData = [
    {
      title:"tin tuyển dụng ",
      value:"10",
    }
  ]
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

export default page;