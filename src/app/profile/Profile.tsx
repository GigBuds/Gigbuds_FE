'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '../../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui//label'
import { Textarea } from '../../../ui/textarea'
import { Badge } from '../../../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar'
import { toast } from 'react-hot-toast'
import { 
  Building2, 
  Mail, 
  MapPin, 
  FileText, 
  Hash, 
  Edit3, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import profileService, { Profile } from '@/service/profileService/profileService'
import { useSelector } from 'react-redux'
import { selectUser } from '@/lib/redux/features/userSlice'
import { Image } from 'antd'

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Form states
  const [companyAddress, setCompanyAddress] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [businessLicense, setBusinessLicense] = useState<File | null>(null)
  const [companyLogo, setCompanyLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const user = useSelector(selectUser)
    console.log("User from Redux:", user)
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        // Replace 'user-id' with actual user ID from auth context
        if (!user?.id) {
          toast.error('Không tìm thấy thông tin người dùng')
          return
        }
        const response = await profileService.getEmployerProfileById(user.id)
        
        if (response.success && response.data) {
          setProfile(response.data)
          setCompanyAddress(response.data.companyAddress)
          setTaxNumber(response.data.taxNumber)
          setLogoPreview(response.data.companyLogo)
        } else {
          toast.error('Không thể tải thông tin hồ sơ')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Có lỗi xảy ra khi tải thông tin')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

  // Handle file uploads
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setCompanyLogo(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Vui lòng chọn file hình ảnh')
      }
    }
  }

  const handleBusinessLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setBusinessLicense(file)
      } else {
        toast.error('Vui lòng chọn file PDF')
      }
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsUpdating(true)
      
      if (!user?.id || !profile) {
        toast.error('Không tìm thấy thông tin người dùng')
        return
      }

      // Check if there are file uploads
      const hasFileUploads = businessLicense || companyLogo

      if (hasFileUploads) {
        // Use FormData for file uploads
        const formData = new FormData()
        formData.append('companyAddress', companyAddress)
        formData.append('taxNumber', taxNumber)
        formData.append('companyEmail', profile.companyEmail)
        formData.append('companyName', profile.companyName)
        
        if (businessLicense) {
          formData.append('businessLicense', businessLicense)
        }
        if (companyLogo) {
          formData.append('companyLogo', companyLogo)
        }

        const response = await profileService.updateEmployerProfile(user.id, formData)
        
        if (response.success && response.data) {
          setProfile(response.data)
          toast.success('Cập nhật thông tin thành công')
          setIsDialogOpen(false)
        } else {
          toast.error(response.error || 'Có lỗi xảy ra khi cập nhật')
        }
      } else {
        // Use regular JSON update for text fields only
        const updatedProfileData: Profile = {
          ...profile,
          companyAddress,
          taxNumber,
        }

        const response = await profileService.updateEmployerProfile(user.id, updatedProfileData)
        
        if (response.success && response.data) {
          setProfile(response.data)
          toast.success('Cập nhật thông tin thành công')
          setIsDialogOpen(false)
        } else {
          toast.error(response.error || 'Có lỗi xảy ra khi cập nhật')
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật')
    } finally {
      setIsUpdating(false)
    }
  }

  // Reset form when dialog closes
  const handleDialogClose = () => {
    if (!isUpdating) {
      setIsDialogOpen(false)
      if (profile) {
        setCompanyAddress(profile.companyAddress)
        setTaxNumber(profile.taxNumber)
        setLogoPreview(profile.companyLogo)
        setBusinessLicense(null)
        setCompanyLogo(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy thông tin</h2>
          <p className="text-gray-600">Không thể tải thông tin hồ sơ của bạn</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ công ty</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin công ty của bạn</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.companyLogo} alt={profile.companyName} />
                  <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                    {profile.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.companyName}</CardTitle>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.companyEmail}
                  </div>
                </div>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Cập nhật thông tin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cập nhật thông tin công ty</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Company Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ công ty</Label>
                      <Textarea
                        id="address"
                        placeholder="Nhập địa chỉ công ty"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Tax Number */}
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Mã số thuế</Label>
                      <Input
                        id="taxNumber"
                        placeholder="Nhập mã số thuế"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)}
                      />
                    </div>

                    {/* Business License */}
                    <div className="space-y-2">
                      <Label htmlFor="businessLicense">Giấy phép kinh doanh (PDF)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="businessLicense"
                          type="file"
                          accept=".pdf"
                          onChange={handleBusinessLicenseChange}
                          className="flex-1"
                        />
                        {businessLicense && (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {businessLicense.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo công ty</Label>
                      <div className="space-y-3">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                        {logoPreview && (
                          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                            {companyLogo && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => {
                                  setCompanyLogo(null)
                                  setLogoPreview(profile.companyLogo)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleDialogClose} disabled={isUpdating}>
                      Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang cập nhật...
                        </>
                      ) : (
                        'Cập nhật'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Company Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ công ty
                </div>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[50px]">
                  {profile.companyAddress || 'Chưa cập nhật địa chỉ'}
                </p>
              </div>

              {/* Tax Number */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Hash className="h-4 w-4" />
                  Mã số thuế
                </div>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {profile.taxNumber || 'Chưa cập nhật mã số thuế'}
                </p>
              </div>

              {/* Business License */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  Giấy phép kinh doanh
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {profile.businessLicense ? (
                    <Button variant="outline" size="sm" className="h-8">
                      <FileText className="h-3 w-3 mr-2" />
                      Xem giấy phép
                    </Button>
                  ) : (
                    <span className="text-gray-500">Chưa tải lên giấy phép</span>
                  )}
                </div>
              </div>

              {/* Company Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 className="h-4 w-4" />
                  Trạng thái hồ sơ
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Badge 
                    variant={profile.companyAddress && profile.taxNumber ? "default" : "secondary"}
                    className={
                      profile.companyAddress && profile.taxNumber 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {profile.companyAddress && profile.taxNumber ? 'Hoàn thiện' : 'Chưa hoàn thiện'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage