"use client";

import React from 'react';
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Toaster } from "react-hot-toast";

export default function LayoutClientShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="flex w-screen h-screen">
      <div>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      </div>
      {!isLoginPage && (
        <div className="lg:w-[20%] md:w-[40%] sm:w-[40%] w-[40%]">
          <Sidebar />
        </div>
      )}
      <main
        className={
          isLoginPage
            ? "w-screen bg-black" // Full width for login page
            : "lg:w-[80%] md:w-[60%] sm:w-[60%] w-[60%]" // Adjusted md:w[60%]
        }
      >
        {children}
      </main>
    </div>
  );
}