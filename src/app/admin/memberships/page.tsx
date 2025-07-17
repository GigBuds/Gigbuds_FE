'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { Button } from '../../../../ui/button'
import { Badge } from '../../../../ui/badge'
import { Input } from '../../../../ui/input'
import { Textarea } from '../../../../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { 
  Package, 
  Users, 
  Briefcase, 
  Edit, 
  RefreshCw,
  DollarSign
} from 'lucide-react'
import { Skeleton } from 'antd'
import { MembershipService } from '@/service/membershipService/membershipService'
import { Membership } from '@/types/membership.types'
import toast from 'react-hot-toast'

// Edit form data interface
interface EditFormData {
  title: string
  description: string
  price: number
  duration: number
}

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
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 break-words">{value}</p>
          </div>
          <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]} flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Membership Card Component
const MembershipCard = ({ 
  membership, 
  onEdit 
}: { 
  membership: Membership
  onEdit: (membership: Membership) => void 
}) => {
  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Miễn phí'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getTypeColor = (type: string) => {
    return type === 'JobSeeker' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl text-gray-900">{membership.title}</CardTitle>
            <Badge className={`${getTypeColor(membership.membershipType)} border-0 mt-2 text-xs`}>
              {membership.membershipType === 'JobSeeker' ? 'Ứng viên' : 'Nhà tuyển dụng'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(membership)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Giá:</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(membership.price)}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Thời hạn:</span>
            <span className="text-sm font-medium text-gray-900">{membership.duration} ngày</span>
          </div>

          {/* Description */}
          <div>
            <span className="text-sm text-gray-600 block mb-2">Mô tả:</span>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {membership.description.split('\n').map((line, index) => (
                <div key={index} className="mb-1 last:mb-0">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Edit Membership Dialog Component
const EditMembershipDialog = ({ 
  membership, 
  open, 
  onOpenChange, 
  onSave 
}: {
  membership: Membership | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (membershipId: number, data: EditFormData) => void
}) => {
  const [formData, setFormData] = useState<EditFormData>({
    title: '',
    description: '',
    price: 0,
    duration: 30
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (membership) {
      setFormData({
        title: membership.title,
        description: membership.description,
        price: membership.price,
        duration: membership.duration
      })
    }
  }, [membership])
  const handleSave = async () => {
    if (!membership || !membership.id) return

    setIsLoading(true)
    try {
      await onSave(membership.id, formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving membership:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Chỉnh sửa gói thành viên
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên gói</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tên gói thành viên"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Giá (VNĐ)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thời hạn (ngày)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả gói thành viên..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">Sử dụng dấu xuống dòng để tạo danh sách</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !formData.title.trim()}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const AdminMembershipsPage = () => {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'JobSeeker' | 'Employer'>('JobSeeker')
  // Fetch memberships data
  const fetchMemberships = async () => {
    try {
      setIsLoading(true)
      const response = await MembershipService.getMemberships()
      console.log('Fetched memberships:', response)
      
      if (response && response.data) {
        setMemberships(response.data)
      } else if (response && Array.isArray(response)) {
        // Handle case where API returns data directly (not wrapped in response.data)
        setMemberships(response)
      } else {
        // Fallback to mock data if API fails
        const mockMemberships: Membership[] = [
          {
            id: 1,
            title: "Gói Miễn phí",
            membershipType: "JobSeeker",
            duration: 30,
            price: 0,
            description: "- Tạo hồ sơ và nộp đơn\n- Không thể chủ động liên hệ với nhà tuyển dụng\n- Xem quảng cáo\n- Giới hạn apply 10 lượt apply job 1 tháng"
          },
          {
            id: 2,
            title: "Gói Cơ bản",
            membershipType: "JobSeeker",
            duration: 30,
            price: 99000,
            description: "- Tất cả tính năng gói miễn phí\n- Chủ động liên hệ nhà tuyển dụng\n- Ẩn quảng cáo\n- Unlimited apply job"
          },
          {
            id: 3,
            title: "Gói Premium",
            membershipType: "JobSeeker",
            duration: 30,
            price: 199000,
            description: "- Tất cả tính năng gói cơ bản\n- Ưu tiên hiển thị hồ sơ\n- Hỗ trợ 24/7\n- Phân tích chi tiết profile"
          },
          {
            id: 4,
            title: "Gói Miễn phí",
            membershipType: "Employer",
            duration: 30,
            price: 0,
            description: "- Free 1 tin\n- Không ưu tiên hiển thị tin\n- Không xem được ứng viên nổi bật"
          },
          {
            id: 5,
            title: "Gói Cơ bản",
            membershipType: "Employer",
            duration: 30,
            price: 299000,
            description: "- 10 tin tuyển dụng\n- Ưu tiên hiển thị tin\n- Xem ứng viên nổi bật\n- Hỗ trợ cơ bản"
          },
          {
            id: 6,
            title: "Gói Premium",
            membershipType: "Employer",
            duration: 30,
            price: 599000,
            description: "- Unlimited tin tuyển dụng\n- Ưu tiên cao nhất\n- Tất cả ứng viên nổi bật\n- Hỗ trợ 24/7\n- Phân tích chi tiết"
          }
        ]
        setMemberships(mockMemberships)
        toast.error('Không thể tải dữ liệu từ API, hiển thị dữ liệu mẫu')
      }
    } catch (error) {
      console.error('Error fetching memberships:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu gói thành viên')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemberships()
  }, [])

  // Handle edit membership
  const handleEditMembership = (membership: Membership) => {
    setEditingMembership(membership)
    setIsEditDialogOpen(true)
  }

  // Handle save membership changes
  const handleSaveMembership = async (membershipId: number, data: EditFormData) => {
    try {
      const response = await MembershipService.editMembership(membershipId, data)
      
      if (response.success) {        // Update the membership in the local state
        setMemberships(prev => prev.map(m => 
          m.id === membershipId 
            ? { ...m, ...data }
            : m
        ))
        toast.success('Cập nhật gói thành viên thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật gói thành viên')
      }
    } catch (error) {
      console.error('Error saving membership:', error)
      toast.error('Có lỗi xảy ra khi cập nhật gói thành viên')
    }
  }

  // Filter memberships by type
  const jobSeekerMemberships = memberships.filter(m => m.membershipType === 'JobSeeker')
  const employerMemberships = memberships.filter(m => m.membershipType === 'Employer')

  // Calculate statistics
  const totalMemberships = memberships.length
  const totalJobSeekerPackages = jobSeekerMemberships.length
  const totalEmployerPackages = employerMemberships.length
  const averagePrice = memberships.length > 0 
    ? Math.round(memberships.reduce((sum, m) => sum + m.price, 0) / memberships.length)
    : 0

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-6">
                <Skeleton className="h-16 sm:h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý Gói thành viên</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Quản lý các gói thành viên cho ứng viên và nhà tuyển dụng</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={fetchMemberships}
            className="flex items-center gap-2 text-sm"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Tổng gói thành viên"
          value={totalMemberships}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Gói ứng viên"
          value={totalJobSeekerPackages}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Gói nhà tuyển dụng"
          value={totalEmployerPackages}
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Giá trung bình"
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(averagePrice)}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Membership Packages */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Danh sách Gói thành viên</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'JobSeeker' | 'Employer')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="JobSeeker" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Ứng viên ({totalJobSeekerPackages})
              </TabsTrigger>
              <TabsTrigger value="Employer" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Nhà tuyển dụng ({totalEmployerPackages})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="JobSeeker">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {jobSeekerMemberships.map((membership) => (
                  <MembershipCard
                    key={membership.id}
                    membership={membership}
                    onEdit={handleEditMembership}
                  />
                ))}
              </div>
              {jobSeekerMemberships.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có gói thành viên nào cho ứng viên</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="Employer">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {employerMemberships.map((membership) => (
                  <MembershipCard
                    key={membership.id}
                    membership={membership}
                    onEdit={handleEditMembership}
                  />
                ))}
              </div>
              {employerMemberships.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có gói thành viên nào cho nhà tuyển dụng</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Membership Dialog */}
      <EditMembershipDialog
        membership={editingMembership}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveMembership}
      />
    </div>
  )
}

export default AdminMembershipsPage
