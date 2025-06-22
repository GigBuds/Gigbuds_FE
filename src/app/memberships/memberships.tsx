'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Crown, 
  Star, 
  Briefcase, 
  CheckCircle, 
  Zap, 
  Shield, 
  Users,
  Calendar,
  Award,
  AlertTriangle,
  X
} from 'lucide-react'
import { Badge } from '../../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog'
import { Membership, UserMembership } from '@/types/membership.types'
import { useLoading } from '@/contexts/LoadingContext'
import { MembershipService } from '@/service/membershipService/membershipService'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/redux/features/userSlice'
import toast from 'react-hot-toast'

const Memberships = () => {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([])
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [processingPayment, setProcessingPayment] = useState<number | null>(null)
  const [membershipToRevoke, setMembershipToRevoke] = useState<{
    current: UserMembership,
    new: Membership
  } | null>(null)
  const [isRevoking, setIsRevoking] = useState(false)
  const { setIsLoading } = useLoading()
  const [error, setError] = useState<string | null>(null)
  const user = useSelector(selectUser)

  // Data fetching functions remain the same
  const fetchMemberships = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await MembershipService.getMemberships()
      
      if (response.success && response.data) {
        setMemberships(response.data)
      } else if (Array.isArray(response)) {
        setMemberships(response)
      } else {
        setError(response.message || 'Không thể tải thông tin gói thành viên')
      }
    } catch (error) {
      console.error('Error fetching memberships:', error)
      setError('Không thể tải thông tin gói thành viên')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])

  const checkMembership = useCallback(async () => {
    try {
      if (!user?.id) return

      const response = await MembershipService.checkMembershipByUserId(user.id)
      
      if (Array.isArray(response)) {
        setUserMemberships(response)
      } else {
        setUserMemberships([])
      }
    } catch (error) {
      console.error('Error checking membership:', error)
      setUserMemberships([])
    }
  }, [user?.id])

  const revokeMembership = useCallback(async (membershipId: number) => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để hủy gói thành viên')
      return
    }

    try {
      setIsRevoking(true)
      await MembershipService.revokeMembership(user.id, membershipId)
      toast.success('Gói thành viên đã được hủy thành công!')
      setTimeout(() => checkMembership(), 1000)
    } catch (error) {
      console.error('Error revoking membership:', error)
      toast.error('Không thể hủy gói thành viên. Vui lòng thử lại.')
      throw error
    } finally {
      setIsRevoking(false)
    }
  }, [user?.id, checkMembership])

  useEffect(() => {
    fetchMemberships()
    if (user?.id) {
      checkMembership()
    }
  }, [user?.id, fetchMemberships, checkMembership])

  const formatPrice = (price: number) => {
    if (price === 0) return 'MIỄN PHÍ'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getCardIcon = (title: string, isActive: boolean = false) => {
    if (isActive) return <CheckCircle className="w-5 h-5" />
    if (title.includes('Miễn phí')) return <Shield className="w-5 h-5" />
    if (title.includes('Cơ bản')) return <Star className="w-5 h-5" />
    if (title.includes('Cao cấp')) return <Crown className="w-5 h-5" />
    return <Briefcase className="w-5 h-5" />
  }

  const getCardTheme = (title: string, isActive: boolean = false) => {
    if (isActive) {
      return {
        gradient: 'from-emerald-50 via-green-50 to-teal-50',
        border: 'border-emerald-300',
        button: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-emerald-200',
        badge: 'bg-emerald-500 text-white',
        glow: 'shadow-emerald-100 shadow-2xl',
        icon: 'text-emerald-600'
      }
    }
    
    if (title.includes('Miễn phí')) return {
      gradient: 'from-slate-50 via-gray-50 to-zinc-50',
      border: 'border-slate-200',
      button: 'bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 shadow-lg',
      badge: 'bg-slate-100 text-slate-800',
      glow: 'shadow-slate-100 shadow-lg',
      icon: 'text-slate-600'
    }
    
    if (title.includes('Cơ bản')) return {
      gradient: 'from-blue-50 via-indigo-50 to-cyan-50',
      border: 'border-blue-300',
      button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-200',
      badge: 'bg-blue-500 text-white',
      glow: 'shadow-blue-100 shadow-xl',
      icon: 'text-blue-600'
    }
    
    if (title.includes('Cao cấp')) return {
      gradient: 'from-orange-50 via-red-50 to-pink-50',
      border: 'border-orange-300',
      button: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-xl hover:shadow-orange-200',
      badge: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      glow: 'shadow-orange-100 shadow-2xl',
      icon: 'text-orange-600'
    }
    
    return {
      gradient: 'from-gray-50 to-slate-50',
      border: 'border-gray-200',
      button: 'bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 shadow-lg',
      badge: 'bg-gray-500 text-white',
      glow: 'shadow-gray-100 shadow-lg',
      icon: 'text-gray-600'
    }
  }

  const getActiveMembership = (membershipId: number) => {
    return userMemberships.find(
      userMembership => 
        userMembership.membershipId === membershipId && 
        userMembership.status.toLowerCase() === 'active'
    )
  }

  const getCurrentActiveMembership = () => {
    return userMemberships.find(
      userMembership => userMembership.status.toLowerCase() === 'active'
    )
  }

  const handleRevokeConfirm = async () => {
    if (!membershipToRevoke) return

    try {
      await revokeMembership(membershipToRevoke.current.membershipId)
      
      // Close dialog
      setShowRevokeDialog(false)
      setMembershipToRevoke(null)
      
      // After successful revoke, proceed with new membership purchase
      setTimeout(() => {
        handlePurchase(membershipToRevoke.new, true)
      }, 1500)
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is already handled in revokeMembership function
      setShowRevokeDialog(false)
      setMembershipToRevoke(null)
    }
  }

  const handleRevokeCancel = () => {
    setShowRevokeDialog(false)
    setMembershipToRevoke(null)
  }

  const handlePurchase = async (membership: Membership, skipRevokeCheck: boolean = false) => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để đăng ký gói thành viên')
      return
    }

    if (!membership.id) {
      toast.error('Thông tin gói thành viên không hợp lệ')
      return
    }

    const activeMembership = getActiveMembership(membership.id)
    if (activeMembership) {
      toast('Bạn đã có gói thành viên này đang hoạt động', { 
        icon: '✅',
        style: { background: '#10b981', color: 'white' }
      })
      return
    }

    // Check if user has any active membership and wants to change
    const currentActiveMembership = getCurrentActiveMembership()
    if (currentActiveMembership && !skipRevokeCheck) {
      const currentMembership = memberships.find(m => m.id === currentActiveMembership.membershipId)
      
      if (currentMembership) {
        setMembershipToRevoke({
          current: currentActiveMembership,
          new: membership
        })
        setShowRevokeDialog(true)
        return
      }
    }

    if (membership.price === 0) {
      toast.success('🎉 Gói miễn phí đã được kích hoạt!', {
        style: { background: '#10b981', color: 'white' }
      })
      setTimeout(() => checkMembership(), 1000)
      return
    }

    setProcessingPayment(membership.id)

    try {
      const paymentData = {
        membershipId: membership.id,
        userId: user.id,
        isMobile: false
      }

      const response = await MembershipService.paymentMembership(paymentData)
      
      if (response.success) {
        toast.success('🚀 Đang chuyển hướng đến trang thanh toán...')
        
        if (response.data?.checkoutUrl) {
          window.location.href = response.data.checkoutUrl
        } else {
          toast.success(response.message || 'Thanh toán đã được khởi tạo thành công!')
        }
      } else {
        toast.error(response.message || 'Khởi tạo thanh toán thất bại. Vui lòng thử lại.')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Payment error:', error)
      
      let errorMessage = 'Thanh toán thất bại. Vui lòng thử lại.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setProcessingPayment(null)
    }
  }

  const employerMemberships = memberships.filter(m => m.membershipType === 'Employer')

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white p-6 rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <p className="text-red-600 mb-4 text-base">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-2"
          >
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full ">
      {/* Revoke Confirmation Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-orange-100">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                Xác nhận thay đổi gói thành viên
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              {membershipToRevoke && (
                <div className="space-y-3">
                  <p>
                    Bạn hiện đang sử dụng gói <span className="font-semibold text-gray-900">
                      {memberships.find(m => m.id === membershipToRevoke.current.membershipId)?.title}
                    </span> sẽ hết hạn vào <span className="font-semibold text-gray-900">
                      {formatDate(membershipToRevoke.current.endDate)}
                    </span>.
                  </p>
                  <p>
                    Để chuyển sang gói <span className="font-semibold text-blue-600">
                      {membershipToRevoke.new.title}
                    </span>, chúng tôi cần hủy gói hiện tại trước.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Việc hủy gói sẽ có hiệu lực ngay lập tức và không thể hoàn tác.
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 ">
            <Button
              variant="outline"
              onClick={handleRevokeCancel}
              disabled={isRevoking}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Hủy bỏ
            </Button>
            <Button
              onClick={handleRevokeConfirm}
              disabled={isRevoking}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
            >
              {isRevoking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Xác nhận thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container py-5 px-3">
        {/* Hero Section - Same as before */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
            Gói Thành Viên
          </h1>
          
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
            Dành Cho Nhà Tuyển Dụng Chuyên Nghiệp
          </h2>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600 text-sm">Nhà tuyển dụng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">95%</div>
              <div className="text-gray-600 text-sm">Tỷ lệ hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">50%</div>
              <div className="text-gray-600 text-sm">Tiết kiệm thời gian</div>
            </div>
          </div>
        </motion.div>

        {/* Membership Cards - Same as before but with updated handlePurchase call */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl ">
          {employerMemberships.map((membership, index) => {
            const activeMembership = getActiveMembership(membership.id!)
            const isActive = !!activeMembership
            const theme = getCardTheme(membership.title, isActive)
            const isPopular = membership.title.includes('Cao cấp')
            const isProcessing = processingPayment === membership.id
            
            return (
              <motion.div
                key={membership.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Popular Badge */}
                {isPopular && !isActive && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-xs font-bold shadow-lg">
                        🔥 PHỔ BIẾN NHẤT
                      </Badge>
                    </motion.div>
                  </div>
                )}

                {/* Active Badge */}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Badge className="bg-emerald-500 text-white px-4 py-1 text-xs font-bold shadow-lg">
                        ✅ ĐANG HOẠT ĐỘNG
                      </Badge>
                    </motion.div>
                  </div>
                )}
                
                <Card className={`h-full ${theme.border} border-2 ${theme.glow} hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${theme.gradient} relative overflow-hidden group-hover:scale-[1.01]`}>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="text-center relative z-10">
                    <div className="flex justify-center mb-2">
                      <motion.div 
                        className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg ${theme.icon}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {getCardIcon(membership.title, isActive)}
                      </motion.div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold text-gray-900 mb-3">
                      {membership.title}
                    </CardTitle>
                    
                    <div className="text-center mb-3">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatPrice(membership.price)}
                      </div>
                      {membership.price > 0 && (
                        <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {membership.duration} ngày
                        </div>
                      )}
                    </div>

                    {activeMembership && (
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        Hết hạn: {formatDate(activeMembership.endDate)}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="h-full flex justify-between flex-col relative z-10">
                    <div className="space-y-3 mb-6 ">
                      {membership.description.split('\n').map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex} 
                          className="flex items-start gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * featureIndex }}
                        >
                          <div className="bg-green-500 rounded-full p-0.5 flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium leading-relaxed text-sm">
                            {feature.replace('- ', '')}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={() => handlePurchase(membership)}
                        disabled={isProcessing || !user || isActive}
                        className={`w-full py-3 text-white font-bold text-sm rounded-lg transition-all duration-300 ${theme.button} hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden`}
                        size="sm"
                      >
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        {isActive ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Đang Hoạt Động
                          </span>
                        ) : isProcessing ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Đang xử lý...
                          </span>
                        ) : !user ? (
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Đăng nhập để đăng ký
                          </span>
                        ) : membership.price === 0 ? (
                          <span className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Kích Hoạt Miễn Phí
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Nâng Cấp Ngay
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Section - Same as before */}
        <motion.div 
          className="text-center mt-12  bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Cam Kết Chất Lượng & Bảo Mật
          </h3>
          
          <p className="text-gray-600 text-base mb-4">
            Tất cả các gói thành viên đều có thể hủy bỏ bất cứ lúc nào. 
            <span className="font-bold text-blue-600"> Không có phí ẩn, bảo mật tuyệt đối.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Bảo mật SSL
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Hoàn tiền 100%
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              Hỗ trợ 24/7
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Memberships