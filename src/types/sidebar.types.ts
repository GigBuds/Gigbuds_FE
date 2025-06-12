import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  link: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: Date;
  isMale: boolean;
  name: string;
  email: string;
  roles?: string[];
}

export interface SidebarVariants {
  open: { width: string };
  closed: { width: string };
}

export interface TextVariants {
  open: { 
    opacity: number; 
    width: string; 
    marginLeft: string; 
    display: string 
  };
  closed: { 
    opacity: number; 
    width: number; 
    marginLeft: string; 
    transitionEnd: { display: string } 
  };
}