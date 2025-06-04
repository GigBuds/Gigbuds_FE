import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface User {
  sub: string;
  email: string;
  name?: string;
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