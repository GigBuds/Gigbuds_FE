import ChartAreaInteractive from "@/components/Chart/Chart";
import Image from "next/image";
import React from "react";
import banner from "../../public/BannerAd.png";
import { Value } from "@radix-ui/react-select";
const page = () => {
  const cardData = [
    {
      title:"tin tuyển dụng ",
      Value:"10",
      
"use client";
import { useEffect, useState } from "react";
import HomePage from "./homepage/HomePage";
import ManageJobPost from "./manage-job-post/ManageJobPost";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('home');

  useEffect(() => {
    // Initialize from localStorage
    const storedTab = localStorage.getItem('selectedTab') || 'Trang Chu';
    setSelectedTab(storedTab);

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedTab' && e.newValue) {
        setSelectedTab(e.newValue);
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'selectedTab') {
        setSelectedTab(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    console.log('Selected Tab:', selectedTab);
  }, [selectedTab]);

  const getComponent = () => {
    switch(selectedTab.toLowerCase()) {
      case 'trang chu':
      case 'home':
        return <HomePage/>;
      case 'tin tuyen dung':
      case 'manage-job':
        return <ManageJobPost />;
      default:
        return <HomePage/>;
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

export default page;
