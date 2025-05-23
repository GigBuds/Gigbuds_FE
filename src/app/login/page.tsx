"use client"
import React from 'react'
import { motion } from 'framer-motion'
import background from '../../../public/login-bg.png'
import logo from '../../../public/Logo-white text.png'
import gigbudslogo from '../../../public/Gigbuds Logo.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginInput from './LoginInput'
import RegisterInput from './RegisterInput'
const page = () => {
  return (
    <motion.div
        className='h-screen w-screen flex flex-row items-center fixed z-50 justify-center'
        style={{backgroundImage: `url(${background.src})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
    >
      <motion.div
        className='flex sm:px-[2%] lg:px-[7%] md:px-[4%] px-[7%] py-[5%]  h-screen  bg-white shadow-lg items-center justify-center'
        
        initial={{ opacity: 0, display: 'none', width:'0%' }}
        animate={{ display: 'flex', opacity: 1, width: '40%' }}
        transition={{ duration: 1 , delay: 1.5 }}
      >
        <div className='bg-white w-full h-fit p-4 flex flex-col justify-start rounded-lg '>

          {/* Logo and text animation */}
          <motion.div
            className='flex w-full mb-[8%]'
              initial={{ opacity: 0  }}
              animate={{ opacity: 1}}
              transition={{ duration: 1, ease: 'easeInOut', delay: 2 }}
          >
            <motion.img
              src={gigbudslogo.src}
              alt="Logo"
              className='h-full w-[15%] '
            />
            <div className='font-bold text-4xl text-[#2558B6] px-[3%]'>GigBuds</div>
          </motion.div>

          <motion.div
            className='flex flex-col justify-center w-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 2 }}
          >
            <div className='text-2xl font-bold text-[#2558B6]'>Bắt đầu ngay</div>
            <div className='text-sm font-semibold text-[#2558B6]'>
              Đăng nhập hoặc tạo tài khoản để tìm kiếm ứng viên tiềm năng nhanh chóng!
            </div>
            <motion.div className='flex w-full flex-col items-center justify-center mt-[5%]'>
              <Tabs defaultValue="signin" className='w-full'>
                <TabsList className='w-full flex'>
                  <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="signup">Tạo tài khoản</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <LoginInput />
                </TabsContent>
                <TabsContent value="signup">
                  <RegisterInput/>
                </TabsContent>
              </Tabs>
            </motion.div>
            

            
          </motion.div>
          
        </div>
      </motion.div>
      <motion.div
        className='h-screen w-[50%] rounded-lg shadow-lg flex items-center justify-center'
        initial={{ width: '100%', backgroundColor: '#000' }}
        animate={{ width: '60%', backgroundColor: 'rgba(0,0,0,0.0)' }}
        transition={{ duration: 1, ease: 'easeInOut', delay: 1.5 }}>
        <motion.img
          src={logo.src}
          alt="Logo"
          className='h-2/6 '
          initial={{ opacity: 0, width: '1/6' }}
          animate={{ opacity: 1, width: '2/6' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </motion.div>
      
      
    </motion.div>
  )
}

export default page