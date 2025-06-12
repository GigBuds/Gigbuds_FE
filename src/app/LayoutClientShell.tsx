"use client";

import React from 'react';
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Toaster } from "react-hot-toast";
import LoadingComponent from '@/components/LoadingComponent/LoadingComponent';
import { useLoading } from '@/contexts/LoadingContext';

export default function LayoutClientShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isLoading } = useLoading();

  return (
    <div className="flex w-screen h-screen overflow-hidden">
     
        {isLoading && (
           <div className='absolute top-0 left-0 w-full h-full bg-black/45 z-[100] flex items-center justify-center'>
          <LoadingComponent
            animationType="outline"
            size={180}
            speed={2000}
          />
          </div>
        )}
      

      <div>
        <Toaster
          position="top-right"
          reverseOrder={true}
        />
      </div>
      {!isLoginPage && (
        <div className="lg:w-[25%] md:w-[45%] sm:w-[45%] w-[45%] overflow-hidden">
          <Sidebar />
        </div>
      )}
      <main
        className={
          isLoginPage
            ? "w-screen h-screen bg-black overflow-x-scroll" // Full width for login page
            : "lg:w-[75%] md:w-[55%] sm:w-[55%] w-[55%] overflow-x-scroll" // Adjusted md:w[60%]
        }
      >
        {children}
      </main>
    </div>
  );
}