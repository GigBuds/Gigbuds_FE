"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';
import { IoHomeOutline, IoLogOutOutline, IoDocumentTextOutline, IoSettingsOutline, IoNotificationsOutline  } from "react-icons/io5";
import { LuUserSearch } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import * as Texts from './text';
import { jwtDecode } from 'jwt-decode';
import { loginApi } from '@/service/loginService/loginService';
import { MenuItem, User } from '@/types/sidebar.types';
import { usePathname, useRouter } from 'next/navigation';
import NotificationSection from '../Notification/NotificationSection';



// Placeholder menu items
const menuItems: MenuItem[] = [
  { id: 'homepage', label: Texts.HOME, icon: <IoHomeOutline/>, link: '/' },
  { id: 'Thong Bao', label: Texts.NOTIFICATIONS, icon: <IoNotificationsOutline/>, link: '/notifications' },
  { id: 'manage-job-post', label: Texts.JOB_POSTINGS, icon: <LuUserSearch/>, link: '/manage-job-post' },
  { id: 'Ho so ung vien', label: Texts.CANDIDATE_PROFILES, icon: <MdOutlineSupervisorAccount/>, link: '/candidate-profiles' },
  { id: 'Tin nhan', label: Texts.MESSAGES, icon: <TiMessages/>, link: '/messages' },
  { id: 'Cài đặt tài tài khoản', label: Texts.ACCOUNT_SETTINGS, icon: <IoSettingsOutline/>, link: '/account-settings' },
  { id: 'Hỗ trợ', label: Texts.SUPPORT, icon: <BiSupport />,    link: '/support' },
  { id: 'Điều khoản/chính sách', label: Texts.TERMS_POLICY, icon: <IoDocumentTextOutline />, link: '/terms-policy' },
  { id: 'Đăng xuất', label: Texts.LOGOUT, icon: <IoLogOutOutline />, link: '/login' },
];


const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('homepage');
    const [user, setUser] = useState<User | null>(null);
    const id_token = typeof document !== 'undefined'
        ? document.cookie.split('; ').find(row => row.startsWith('authToken='))
        : null;
   
   const getSelectedItemFromPath = (currentPath: string): string => {
        // Direct match first
        const directMatch = menuItems.find(item => item.link === currentPath);
        if (directMatch) {
            return directMatch.id;
        }

        // Handle dynamic routes by checking if the path starts with the menu item link
        for (const item of menuItems) {
            if (currentPath.startsWith(item.link) && item.link !== '/') {

             if (currentPath.startsWith(item.link + '/')) {
                    return item.id;
                }
            }
        }

        // Handle root path separately
        if (currentPath === '/') {
            return 'homepage';
        }

    };

   useEffect(() => {
        const selectedId = getSelectedItemFromPath(pathname);
        setSelectedItem(selectedId);
        console.log('Current pathname:', pathname);
        console.log('Selected item:', selectedId);
    }, [pathname]);
    
    useEffect(() => {
        switch (selectedItem) {
            case 'Đăng xuất':
                (async () => {
                    try {
                        await loginApi.logout();
                        setSelectedItem('Trang Chu');
                        setUser(null);
                    } catch (error: unknown) {
                        console.error('Logout error:', error);
                    }
                })();
                break;
            case 'Write Post':
                router.push('/employer/job-posts/create');
                break;
        }
    }, [selectedItem, setSelectedItem, router]);

    useEffect(() => {
        if (id_token) {
            const token = id_token.split('=')[1];
            const decodedUser = decodeJWT(token);
            console.log('Decoded user:', decodedUser);
            if (decodedUser) {
                setUser(decodedUser);
            } else {
                console.error('Failed to decode JWT token');
            }
        }
    }, [id_token]);

    const decodeJWT = (token: string): User | null => {
        try {
            const decoded = jwtDecode(token) as User;
            return {
                sub: decoded.sub,
                email: decoded.email,
                name: decoded.name,
                roles: decoded.roles || [],
            };
        } catch (error) {
            console.error('JWT decode error:', error);
            return null;
        }
    }

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
                        src='/Gigbuds Logo.png' 
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
                        <p className='text-sm font-bold whitespace-nowrap'>{user?.name}</p>
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
                            onClick={() => {setSelectedItem('Write Post')}}
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
                                        router.push(item.link); // Navigate to the corresponding page

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
        <div className=' bg-[#F3F7FF] lg:pl-[5vw] md:pl-[9vw] sm:pl-[11vw]  pl-[14vw] z-10 grow'> 
                    <NotificationSection />
        </div>
    </div>
  )
}

export default Sidebar