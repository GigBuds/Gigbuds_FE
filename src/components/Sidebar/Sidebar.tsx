"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';
import { IoHomeOutline, IoLogOutOutline, IoDocumentTextOutline, IoSettingsOutline, IoNotificationsOutline  } from "react-icons/io5";
import { LuUserSearch } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import * as Texts from './text'; // Import texts

// Define an interface for menu items for better structure
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode; // You can use actual icon components here
}

// Placeholder menu items
const menuItems: MenuItem[] = [
  { id: 'Trang Chu', label: Texts.HOME, icon: <IoHomeOutline/> },
  { id: 'Thong Bao', label: Texts.NOTIFICATIONS, icon: <IoNotificationsOutline/> },
  { id: 'Tin tuyen dung', label: Texts.JOB_POSTINGS, icon: <LuUserSearch/> },
  { id: 'Ho so ung vien', label: Texts.CANDIDATE_PROFILES, icon: <MdOutlineSupervisorAccount/> },
  { id: 'Tin nhan', label: Texts.MESSAGES, icon: <TiMessages/> },
  { id: 'Cài đặt tài tài khoản', label: Texts.ACCOUNT_SETTINGS, icon: <IoSettingsOutline/> },
  { id: 'Hỗ trợ', label: Texts.SUPPORT, icon: <BiSupport /> },
  { id: 'Điều khoản/chính sách', label: Texts.TERMS_POLICY, icon: <IoDocumentTextOutline /> },
  { id: 'Đăng xuất', label: Texts.LOGOUT, icon: <IoLogOutOutline /> },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null); // New state for selected item

    const sidebarVariants = {
        open: { width: '250px' },
        closed: { width: '80px' },
    };

    const textVariants = {
        open: { opacity: 1, width: 'auto', marginLeft: '12px', display: 'block' },
        closed: { opacity: 0, width: 0, marginLeft: '0px', transitionEnd: { display: 'none' } },
    };

    const profileTextTransition = {
        duration: 0.2,
        delay: isOpen ? 0.2 : 0,
    };
    
    const menuItemTextTransition = {
        duration: 0.2,
        delay: isOpen ? 0.25 : 0, // Slightly delay menu item text after profile
    };


  return (
    <div className='h-full w-full flex flex-row bg-gray'> 
        <motion.div 
            className={`h-full ${isOpen ? 'bg-[#F3F7FF]' : 'bg-white'} pt-[2%] shadow-lg z-40 absolute w-full flex flex-col p-4`} 
            variants={sidebarVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >  
            {/* Profile Section */}
                <motion.div 
                    className='flex flex-row items-center mb-3 ' 
                >
                    <Image 
                        src='/logo.png' 
                        alt='logo'
                        width={48}
                        height={48} 
                        className='bg-black rounded-full flex-shrink-0' 
                    />            
                    <motion.div 
                        className='overflow-hidden' // To hide text smoothly
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        variants={textVariants}
                        transition={profileTextTransition}
                    >
                        <p className='text-sm whitespace-nowrap'>{Texts.GREETING}</p>
                        <p className='text-sm font-bold whitespace-nowrap'>{Texts.USER_NAME}</p>
                        <p className='text-xs text-gray-600 whitespace-nowrap hover:underline cursor-pointer'>{Texts.VIEW_PROFILE}</p>
                    </motion.div>
                </motion.div>

            <motion.div 
                    className='flex flex-row rounded-xl bg-[linear-gradient(90deg,_#FF7345_33.76%,_#FFDC95_99.87%)] items-center  mb-2 shadow-md' 
                    initial={{scale: 1}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <motion.div className='flex items-center py-2 transition-colors duration-150'>
                        <TbEdit className='text-xl w-12 h-7 text-white  flex items-center justify-center flex-shrink-0' />
                        <motion.div 
                            className='overflow-hidden text-sm font-medium  whitespace-nowrap' // To hide text smoothly
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={textVariants}
                            transition={profileTextTransition}
                        >
                            <p className='text-sm text-white whitespace-nowrap'>{Texts.WRITE_POST}</p>
                        </motion.div>
                    </motion.div>
                    
                </motion.div>

            {/* Navigation Items */}
            <nav className=' rounded-2xl py-1 bg-white'>
                <ul className='justify-between flex flex-col'>
                    {menuItems.map((item) => (
                        <React.Fragment key={item.id}>
                            <li className='my-1'>
                                <motion.div className='flex py-2 items-center rounded-lg '
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    onClick={() => {
                                        setSelectedItem(item.id); // Set selected item
                                        console.log(item.label); 
                                    }} 
                                >
                                    <span className={`text-2xl w-12 h-7 flex items-center justify-center flex-shrink-0 ${selectedItem === item.id ? 'text-orange-500' : ''}`}> {/* Icon container */}
                                        {item.icon}
                                    </span>
                                    <motion.span
                                        className={`text-sm font-medium overflow-hidden whitespace-nowrap ${selectedItem === item.id ? 'text-orange-500' : ''}`}
                                        initial="closed"
                                        animate={isOpen ? "open" : "closed"}
                                        variants={textVariants}
                                        transition={menuItemTextTransition}
                                    >
                                        {item.label}
                                    </motion.span>
                                </motion.div>
                            </li>
                            {item.id === 'Tin nhan' && (
                                <motion.hr 
                                    className="border-gray-300 mx-4 "
                                    initial="closed"
                                    animate={isOpen ? "open" : "closed"}
                                    variants={{ open: { opacity: 1, display: 'block' }, closed: { opacity: 0, transitionEnd: { display: 'none' } } }}
                                    transition={menuItemTextTransition}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </ul>
                
            </nav>

        </motion.div>
        
        {/* Main Content Area */}
        <div className=' bg-[#F3F7FF] lg:pl-[6vw] md:pl-[10vw] sm:pl-[12vw]  pl-[15vw] z-10 grow  p-4'> 
            <h1 className="text-2xl font-semibold">{Texts.MAIN_CONTENT_TITLE}</h1>
            <p>{Texts.MAIN_CONTENT_SUBTITLE}</p>
            {/* Replace "Noti" with your actual page content */}
        </div>
    </div>
  )
}

export default Sidebar