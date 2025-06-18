"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
  IoHomeOutline, 
  IoLogOutOutline, 
  IoDocumentTextOutline, 
  IoSettingsOutline, 
  IoNotificationsOutline  
} from "react-icons/io5"
import { LuUserSearch } from "react-icons/lu"
import { TiMessages } from "react-icons/ti"
import { MdOutlineSupervisorAccount } from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { BiSupport } from "react-icons/bi"

import * as Texts from './text'
import { MenuItem } from '@/types/sidebar.types'
import NotificationSection from '../Notification/NotificationSection'
import { useAuth } from '@/hooks/useAuth'
import { clearUserState, selectUser } from '@/lib/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { selectNotifications } from '@/lib/redux/features/notificationSlice'
import { BsShieldLock } from "react-icons/bs";


// Menu items configuration
const menuItems: MenuItem[] = [
  { id: 'homepage', label: Texts.HOME, icon: <IoHomeOutline/>, link: '/' },
  { id: 'notifications', label: Texts.NOTIFICATIONS, icon: <IoNotificationsOutline/>, link: '/notifications' },
  { id: 'manage-job-post', label: Texts.JOB_POSTINGS, icon: <LuUserSearch/>, link: '/manage-job-post' },
  { id: 'candidate-profiles', label: Texts.CANDIDATE_PROFILES, icon: <MdOutlineSupervisorAccount/>, link: '/candidate-profiles' },
  { id: 'messages', label: Texts.MESSAGES, icon: <TiMessages/>, link: '/messages' },
  { id: 'memberships', label: "Đăng ký thành viên", icon: <BsShieldLock />, link: '/memberships' },
  { id: 'account-settings', label: Texts.ACCOUNT_SETTINGS, icon: <IoSettingsOutline/>, link: '/account-settings' },
  { id: 'support', label: Texts.SUPPORT, icon: <BiSupport/>, link: '/support' },
  { id: 'terms-policy', label: Texts.TERMS_POLICY, icon: <IoDocumentTextOutline/>, link: '/terms-policy' },
  { id: 'logout', label: Texts.LOGOUT, icon: <IoLogOutOutline/>, link: '/login' },
]

// Animation variants
const sidebarVariants = {
  open: { width: '250px' },
  closed: { width: '80px' },
}

const textVariants = {
  open: { 
    opacity: 1, 
    width: 'auto', 
    marginLeft: '12px', 
    display: 'block' 
  },
  closed: { 
    opacity: 0, 
    width: 0, 
    marginLeft: '0px', 
    transitionEnd: { display: 'none' } 
  },
}

const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const { logout } = useAuth()
  
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('homepage')
  const notifications = useAppSelector(selectNotifications)

  // Helper function to determine selected item from current path
  const getSelectedItemFromPath = (currentPath: string): string => {
    // Direct match first
    const directMatch = menuItems.find(item => item.link === currentPath)
    if (directMatch) return directMatch.id

    // Handle dynamic routes
    for (const item of menuItems) {
      if (currentPath.startsWith(item.link) && item.link !== '/') {
        if (currentPath.startsWith(item.link + '/')) {
          return item.id
        }
      }
    }

    // Handle root path
    if (currentPath === '/') return 'homepage'
    
    return 'homepage' // Default fallback
  }

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logout()
      setSelectedItem('homepage')
      dispatch(clearUserState())
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Handle menu item selection
  const handleMenuItemClick = (item: MenuItem) => {
    setSelectedItem(item.id)
    
    switch (item.id) {
      case 'logout':
        handleLogout()
        break
      default:
        router.push(item.link)
        break
    }
  }

  // Handle write post action
  const handleWritePost = () => {
    setSelectedItem('write-post')
    router.push('/employer/job-posts/create')
  }

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      console.log('User not found, redirecting to login')
      router.push('/login')
    }
  }, [user, router])

  // Update selected item based on current path
  useEffect(() => {
    const selectedId = getSelectedItemFromPath(pathname)
    setSelectedItem(selectedId)
  }, [pathname])

  // Don't render if user is not authenticated
  if (!user?.id) {
    return null
  }

  const profileTextTransition = {
    duration: 0.2,
    delay: isOpen ? 0.2 : 0,
  }
  
  const menuItemTextTransition = {
    duration: 0.2,
    delay: isOpen ? 0.25 : 0,
  }

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
        <motion.div className='flex flex-row items-center mb-3'>
          <Image 
            src='/Gigbuds Logo.png' 
            alt='logo'
            width={48}
            height={48} 
            className='bg-black rounded-full flex-shrink-0' 
          />
          <motion.div 
            className='overflow-hidden'
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={textVariants}
            transition={profileTextTransition}
          >
            <p className='text-sm whitespace-nowrap'>{Texts.GREETING}</p>
            <p className='text-sm font-bold whitespace-nowrap'>{user?.name}</p>
            <p className='text-xs text-gray-600 whitespace-nowrap hover:underline cursor-pointer'>
              {Texts.VIEW_PROFILE}
            </p>
          </motion.div>
        </motion.div>

        {/* Write Post Button */}
        <motion.div 
          className='flex flex-row rounded-xl bg-gradient-to-r from-[#FF7345] to-[#FFDC95] items-center mb-2 shadow-md cursor-pointer'
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleWritePost}
        >
          <div className='flex items-center py-2'>
            <TbEdit className='text-xl w-12 h-7 text-white flex items-center justify-center flex-shrink-0' />
            <motion.div 
              className='overflow-hidden text-sm font-medium whitespace-nowrap'
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              variants={textVariants}
              transition={profileTextTransition}
            >
              <p className='text-sm text-white whitespace-nowrap'>{Texts.WRITE_POST}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <nav className='rounded-2xl py-1 bg-white'>
          <ul className='justify-between flex flex-col'>
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <li className='my-1'>
                  <motion.div 
                    className='flex py-2 items-center rounded-lg cursor-pointer'
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    <span className={`text-2xl w-12 h-7 flex items-center justify-center flex-shrink-0 ${
                      selectedItem === item.id ? 'text-orange-500' : ''
                    }`}>
                      {item.icon}
                    </span>
                    <motion.span
                      className={`text-sm font-medium overflow-hidden whitespace-nowrap ${
                        selectedItem === item.id ? 'text-orange-500' : ''
                      }`}
                      initial="closed"
                      animate={isOpen ? "open" : "closed"}
                      variants={textVariants}
                      transition={menuItemTextTransition}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </li>
                {item.id === 'messages' && (
                  <motion.hr 
                    className="border-gray-300 mx-4"
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    variants={{ 
                      open: { opacity: 1, display: 'block' }, 
                      closed: { opacity: 0, transitionEnd: { display: 'none' } } 
                    }}
                    transition={menuItemTextTransition}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </motion.div>
      
      {/* Main Content Area */}
      <div className='bg-[#F3F7FF] lg:pl-[5vw] md:pl-[9vw] sm:pl-[11vw] pl-[14vw] z-10 grow'> 
        <NotificationSection notifications={notifications.notifications} />
      </div>
    </div>
  )
}

export default Sidebar