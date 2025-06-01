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
  };

  return (
    <div className=" h-full w-full p-[2%]"> 
      <h1 className="text-2xl font-bold mb-4">
        {selectedTab}     
      </h1>
     
      {getComponent()}
    </div>
  );
}
