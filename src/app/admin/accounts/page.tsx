'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { Button } from '../../../../ui/button'
import { Badge } from '../../../../ui/badge'
import { Input } from '../../../../ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../../ui/dialog'
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  UserX, 
  Search, 
  RefreshCw,
  Calendar,
  MapPin,
  Mail,
  Building,
  IdCard,
  X
} from 'lucide-react'
import { Skeleton } from 'antd'
import accountService, { Account } from '@/service/accountService/accountService'
import toast from 'react-hot-toast'

// Statistics Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue" 
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500"
  }

  return (
    <Card className="w-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">{value}</p>
          </div>
          <div className={`p-3 sm:p-4 rounded-xl ${colorClasses[color]} flex-shrink-0 shadow-sm`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Account Card Component
const AccountCard = ({ account, onCardClick }: { account: Account, onCardClick: (account: Account) => void }) => {
  const [imageError, setImageError] = useState(false)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getRoleColor = (roles: string[]) => {
    if (roles.some(role => role.includes('EMPLOYER') || role === 'Employer')) return 'bg-green-100 text-green-800'
    if (roles.some(role => role.includes('JOB_SEEKER') || role === 'JobSeeker')) return 'bg-blue-100 text-blue-800'
    if (roles.some(role => role.includes('ADMIN') || role === 'Admin')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getRoleText = (roles: string[]) => {
    if (roles.some(role => role.includes('EMPLOYER') || role === 'Employer')) return 'Nhà tuyển dụng'
    if (roles.some(role => role.includes('JOB_SEEKER') || role === 'JobSeeker')) return 'Ứng viên'
    if (roles.some(role => role.includes('ADMIN') || role === 'Admin')) return 'Quản trị viên'
    return 'Khác'
  }

  return (
    <Card 
      className="h-full hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer"
      onClick={() => onCardClick(account)}
    >
      <CardHeader className="pb-4 px-4 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-white shadow-sm border border-gray-200">
              {account.avatarUrl && !imageError ? (
                <Image 
                  src={account.avatarUrl} 
                  alt={`${account.firstName} ${account.lastName}`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-gray-900 truncate leading-tight mb-1">
                {account.firstName} {account.lastName}
              </CardTitle>
              <p className="text-xs text-gray-500">ID: #{account.id}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            <Badge className={`${getRoleColor(account.roles)} border-0 text-xs px-2.5 py-1 font-medium rounded-full`}>
              {getRoleText(account.roles)}
            </Badge>            <Badge 
              variant={account.isEnabled ? "default" : "destructive"}
              className="text-xs px-2.5 py-1 font-medium rounded-full"
            >
              {account.isEnabled ? 'Hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          </div>
        </div></CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">{account.currentLocation || 'Chưa cập nhật'}</span>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span>Sinh: {formatDate(account.dob)}</span>
          </div>

          {/* Gender */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span>{account.isMale ? 'Nam' : 'Nữ'}</span>
          </div>          {/* Job Applications (for Job Seekers) */}
          {(account.roles.includes('JOB_SEEKER') || account.roles.includes('JobSeeker')) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span>Lượt apply còn lại: {account.availableJobApplication}</span>
            </div>
          )}          {/* Company Info (for Employers) */}
          {(account.roles.includes('EMPLOYER') || account.roles.includes('Employer')) && account.employerProfileResponseDto && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">{account.employerProfileResponseDto.companyName}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">{account.employerProfileResponseDto.companyEmail}</span>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Tạo: {formatDate(account.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const AdminAccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeRole, setActiveRole] = useState<string>('')
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handle account card click
  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account)
    setIsDialogOpen(true)
  }

  // Fetch accounts data
  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await accountService.getAllAccounts()
      
      if (response.success && response.data) {
        setAccounts(response.data)
        setFilteredAccounts(response.data)
      } else {
        // Fallback to mock data if API fails
        const mockAccounts: Account[] = Array.from({ length: 20 }, (_, index) => ({
          id: index + 1,
          firstName: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng'][Math.floor(Math.random() * 5)],
          lastName: ['Văn A', 'Thị B', 'Văn C', 'Thị D', 'Văn E'][Math.floor(Math.random() * 5)],
          dob: new Date(1990 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
          socialSecurityNumber: Math.random() > 0.5 ? `${Math.floor(Math.random() * 1000000000)}` : null,
          isMale: Math.random() > 0.5,
          availableJobApplication: Math.floor(Math.random() * 50),
          isEnabled: Math.random() > 0.2,
          refreshToken: null,
          currentLocation: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'][Math.floor(Math.random() * 5)],
          avatarUrl: Math.random() > 0.5 ? `https://i.pravatar.cc/150?img=${index + 1}` : '',
          createdAt: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
          updatedAt: new Date().toISOString(),
          roles: Math.random() > 0.5 ? ['JOB_SEEKER'] : ['EMPLOYER'],
          employerProfileResponseDto: Math.random() > 0.5 ? {
            companyEmail: `company${index}@example.com`,
            companyName: `Công ty ${index + 1}`,
            companyAddress: `Địa chỉ công ty ${index + 1}`,
            taxNumber: `${Math.floor(Math.random() * 1000000000)}`,
            businessLicense: `${Math.floor(Math.random() * 1000000000)}`,
            companyLogo: ''
          } : null
        }))
        setAccounts(mockAccounts)
        setFilteredAccounts(mockAccounts)
        toast.error('Không thể tải dữ liệu từ API, hiển thị dữ liệu mẫu')
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu tài khoản')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])
  // Get unique roles from API data
  const uniqueRoles = useMemo(() => {
    const allRoles = accounts.flatMap(account => account.roles)
    return [...new Set(allRoles)].sort()
  }, [accounts])

  // Set default active role when roles are loaded
  useEffect(() => {
    if (uniqueRoles.length > 0 && !activeRole) {
      setActiveRole(uniqueRoles[0])
    }
  }, [uniqueRoles, activeRole])

  // Filter accounts
  useEffect(() => {
    let filtered = accounts

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(account =>
        `${account.firstName} ${account.lastName}`.toLowerCase().includes(term) ||
        account.id?.toString().includes(term) ||
        account.currentLocation.toLowerCase().includes(term) ||
        (account.employerProfileResponseDto?.companyName?.toLowerCase().includes(term))
      )
    }    // Role filter
    if (activeRole) {
      filtered = filtered.filter(account => 
        account.roles.includes(activeRole)
      )
    }

    setFilteredAccounts(filtered)
  }, [accounts, searchTerm, activeRole])

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = accounts.length
    const activeAccounts = accounts.filter(a => a.isEnabled).length
    const inactiveAccounts = accounts.filter(a => !a.isEnabled).length
    
    const roleStats = uniqueRoles.reduce((stats, role) => {
      stats[role] = accounts.filter(a => a.roles.includes(role)).length
      return stats
    }, {} as Record<string, number>)

    return {
      total,
      activeAccounts,
      inactiveAccounts,
      roleStats
    }
  }, [accounts, uniqueRoles])

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'JOB_SEEKER': return 'Ứng viên'
      case 'EMPLOYER': return 'Nhà tuyển dụng'
      case 'ADMIN': return 'Quản trị viên'
      default: return role
    }
  }

  // Account Details Dialog Component
const AccountDetailsDialog = ({ account, open, onOpenChange }: { 
  account: Account | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) => {
  const [imageError, setImageError] = useState(false)
  
  if (!account) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  const getRoleColor = (roles: string[]) => {
    if (roles.some(role => role.includes('EMPLOYER') || role === 'Employer')) return 'bg-green-100 text-green-800'
    if (roles.some(role => role.includes('JOB_SEEKER') || role === 'JobSeeker')) return 'bg-blue-100 text-blue-800'
    if (roles.some(role => role.includes('ADMIN') || role === 'Admin')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getRoleText = (roles: string[]) => {
    if (roles.some(role => role.includes('EMPLOYER') || role === 'Employer')) return 'Nhà tuyển dụng'
    if (roles.some(role => role.includes('JOB_SEEKER') || role === 'JobSeeker')) return 'Ứng viên'
    if (roles.some(role => role.includes('ADMIN') || role === 'Admin')) return 'Quản trị viên'
    return 'Khác'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Chi tiết Tài khoản
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600">
            Thông tin chi tiết về tài khoản người dùng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Thông tin Cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-4 ring-white shadow-lg border border-gray-200">
                  {account.avatarUrl && !imageError ? (
                    <Image 
                      src={account.avatarUrl} 
                      alt={`${account.firstName} ${account.lastName}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {account.firstName} {account.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID</label>
                      <p className="text-lg font-semibold text-gray-900">#{account.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vai trò</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {account.roles.map((role, index) => (
                          <Badge key={index} className={`${getRoleColor([role])} border-0 text-xs px-2.5 py-1 font-medium rounded-full`}>
                            {getRoleText([role])}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                      <div className="mt-1">
                        <Badge 
                          variant={account.isEnabled ? "default" : "destructive"}
                          className="text-xs px-2.5 py-1 font-medium rounded-full"
                        >
                          {account.isEnabled ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span>Sinh: {formatDate(account.dob)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span>Giới tính: {account.isMale ? 'Nam' : 'Nữ'}</span>
                    </div>
                    {account.socialSecurityNumber && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <IdCard className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <span>CCCD: {account.socialSecurityNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{account.currentLocation || 'Chưa cập nhật'}</span>
                    </div>
                  </div>                  {/* Job Seeker specific info */}
                  {(account.roles.includes('JOB_SEEKER') || account.roles.includes('JobSeeker')) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span>Lượt apply còn lại: {account.availableJobApplication}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info for Employers */}
          {account.roles.includes('EMPLOYER') && account.employerProfileResponseDto && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Thông tin Công ty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tên công ty</label>
                    <p className="text-base font-semibold text-gray-900">
                      {account.employerProfileResponseDto.companyName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email công ty</label>
                    <p className="text-base text-gray-900">
                      {account.employerProfileResponseDto.companyEmail}
                    </p>
                  </div>
                  {account.employerProfileResponseDto.companyAddress && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Địa chỉ công ty</label>
                      <p className="text-base text-gray-900">
                        {account.employerProfileResponseDto.companyAddress}
                      </p>
                    </div>
                  )}
                  {account.employerProfileResponseDto.taxNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mã số thuế</label>
                      <p className="text-base text-gray-900">
                        {account.employerProfileResponseDto.taxNumber}
                      </p>
                    </div>
                  )}
                  {account.employerProfileResponseDto.businessLicense && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Giấy phép kinh doanh</label>
                      <p className="text-base text-gray-900">
                        {account.employerProfileResponseDto.businessLicense}
                      </p>
                    </div>
                  )}
                </div>
                
                {account.employerProfileResponseDto.companyLogo && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Logo công ty</label>
                    <div className="mt-2">
                      <Image 
                        src={account.employerProfileResponseDto.companyLogo}
                        alt={`Logo ${account.employerProfileResponseDto.companyName}`}
                        width={120}
                        height={120}
                        className="rounded-lg border border-gray-200 object-contain bg-white p-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* System Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thông tin Hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                  <p className="text-base text-gray-900">
                    {formatDate(account.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                  <p className="text-base text-gray-900">
                    {formatDate(account.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 lg:h-10 w-48 lg:w-64 mb-2" />
            <Skeleton className="h-4 w-64 lg:w-80" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Quản lý Tài khoản</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Quản lý tất cả tài khoản người dùng trong hệ thống</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={fetchAccounts}
            className="flex items-center gap-2 text-sm px-4 py-2 hover:bg-gray-100 transition-colors"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Tổng tài khoản"
          value={statistics.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Tài khoản hoạt động"
          value={statistics.activeAccounts}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Tài khoản vô hiệu hóa"
          value={statistics.inactiveAccounts}
          icon={UserX}
          color="red"
        />
        <StatCard
          title="Ứng viên"
          value={statistics.roleStats['JOB_SEEKER'] || 0}
          icon={Users}
          color="purple"
        />
      </div>{/* Search */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Tìm kiếm và Lọc</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, ID, vị trí, tên công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>


      </Card>      {/* Accounts by Role */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Danh sách Tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">          <Tabs value={activeRole} onValueChange={setActiveRole}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8 bg-gray-100 p-1 rounded-lg">
              {uniqueRoles.map((role) => (
                <TabsTrigger 
                  key={role} 
                  value={role} 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {role === 'EMPLOYER' ? <Briefcase className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  {getRoleDisplayName(role)} ({statistics.roleStats[role] || 0})
                </TabsTrigger>
              ))}
            </TabsList>{uniqueRoles.map((role) => (
              <TabsContent key={role} value={role}>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-6">
                  {filteredAccounts
                    .filter(account => account.roles.includes(role))
                    .map((account) => (
                      <AccountCard key={account.id} account={account} onCardClick={handleAccountClick} />
                    ))}
                </div>
                {filteredAccounts.filter(account => account.roles.includes(role)).length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Không tìm thấy {getRoleDisplayName(role).toLowerCase()} nào phù hợp với bộ lọc</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Account Details Dialog */}
      <AccountDetailsDialog 
        account={selectedAccount} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  )
}

export default AdminAccountsPage
