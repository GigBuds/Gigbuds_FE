'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  PieChart,
  BarChart3,
} from 'lucide-react'
import transactionService, { Transaction } from '@/service/transactionService/transactionService'
import { Skeleton } from 'antd' 
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { Button } from '../../../../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select'
import { Input } from '../../../../ui/input'
import { Badge } from '../../../../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../ui/table'

// Statistics Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = "blue" 
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down'
  trendValue?: string
  color?: 'blue' | 'green' | 'yellow' | 'red'
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-sm sm:text-xl lg:text-xl font-bold text-gray-900 mt-1 break-words">{value}</p>
            
          </div>
          <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]} flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
        {trend && trendValue && (
              <div className={`flex items-center mt-2 text-xs sm:text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />}
                <span className="truncate">{trendValue}</span>
              </div>
            )}
      </CardContent>
    </Card>
  )
}

// Transaction Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>
      {status}
    </Badge>
  )
}

// Simple Chart Component (since we don't have chart library)
const SimpleChart = ({ 
  data, 
  title, 
  type = 'bar' 
}: { 
  data: { label: string; value: number }[]
  title: string
  type?: 'bar' | 'pie'
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          {type === 'bar' ? <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : <PieChart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium truncate pr-2">{item.label}</span>
                <span className="text-gray-600 flex-shrink-0">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [gatewayFilter, setGatewayFilter] = useState<string>('all')
  const [membershipFilter, setMembershipFilter] = useState<string>('all')

  // Fetch transactions data
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await transactionService.getTransactions()
      
      if (response.success && response.data) {
        setTransactions(response.data)
        setFilteredTransactions(response.data)
      } else {
        // Fallback to mock data if API fails
        const mockData: Transaction[] = Array.from({ length: 50 }, () => ({
          revenue: Math.floor(Math.random() * 1000000),
          transactionStatus: ['Completed', 'Pending', 'Cancelled'][Math.floor(Math.random() * 3)],
          content: `Membership payment for ${['Gói Miễn phí', 'Gói Cơ bản', 'Gói Cao Cấp'][Math.floor(Math.random() * 3)]}`,
          gateway: ['PayOS', 'VNPay', 'Momo', 'ZaloPay'][Math.floor(Math.random() * 4)],
          referenceCode: Math.floor(Math.random() * 1000000000),
          membershipId: Math.floor(Math.random() * 5) + 1,
          membershipName: ['Gói Miễn phí', 'Gói Cơ bản', 'Gói Cao Cấp'][Math.floor(Math.random() * 3)],
          accountId: Math.floor(Math.random() * 100) + 1
        }))
        setTransactions(mockData)
        setFilteredTransactions(mockData)
        toast.error('Không thể tải dữ liệu từ API, hiển thị dữ liệu mẫu')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu giao dịch')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Filter transactions
  useEffect(() => {
    let filtered = transactions

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(transaction =>
        transaction.content.toLowerCase().includes(term) ||
        transaction.referenceCode.toString().includes(term) ||
        transaction.membershipName.toLowerCase().includes(term) ||
        transaction.accountId.toString().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.transactionStatus.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Gateway filter
    if (gatewayFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.gateway.toLowerCase() === gatewayFilter.toLowerCase()
      )
    }

    // Membership filter
    if (membershipFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.membershipName.toLowerCase() === membershipFilter.toLowerCase()
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter, gatewayFilter, membershipFilter])

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = transactions.length
    const completed = transactions.filter(t => t.transactionStatus.toLowerCase() === 'completed').length
    const pending = transactions.filter(t => t.transactionStatus.toLowerCase() === 'pending').length
    const cancelled = transactions.filter(t => t.transactionStatus.toLowerCase() === 'cancelled').length
    
    const totalRevenue = transactions
      .filter(t => t.transactionStatus.toLowerCase() === 'completed')
      .reduce((sum, t) => sum + t.revenue, 0)
    
    const pendingRevenue = transactions
      .filter(t => t.transactionStatus.toLowerCase() === 'pending')
      .reduce((sum, t) => sum + t.revenue, 0)

    return {
      total,
      completed,
      pending,
      cancelled,
      totalRevenue,
      pendingRevenue,
      successRate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0'
    }
  }, [transactions])

  // Chart data
  const statusChartData = useMemo(() => [
    { label: 'Hoàn thành', value: statistics.completed },
    { label: 'Đang chờ', value: statistics.pending },
    { label: 'Hủy', value: statistics.cancelled }
  ], [statistics])

  const gatewayChartData = useMemo(() => {
    const gateways: Record<string, number> = {}
    transactions.forEach(t => {
      gateways[t.gateway] = (gateways[t.gateway] || 0) + 1
    })
    return Object.entries(gateways).map(([label, value]) => ({ label, value }))
  }, [transactions])
  const membershipChartData = useMemo(() => {
    const memberships: Record<string, number> = {}
    transactions.forEach(t => {
      memberships[t.membershipName] = (memberships[t.membershipName] || 0) + 1
    })
    return Object.entries(memberships).map(([label, value]) => ({ label, value }))
  }, [transactions])

  // Get unique filter options from transactions data
  const uniqueStatuses = useMemo(() => {
    return [...new Set(transactions.map(t => t.transactionStatus))].sort()
  }, [transactions])

  const uniqueGateways = useMemo(() => {
    return [...new Set(transactions.map(t => t.gateway))].sort()
  }, [transactions])

  const uniqueMemberships = useMemo(() => {
    return [...new Set(transactions.map(t => t.membershipName))].sort()
  }, [transactions])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }


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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý Giao dịch</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Theo dõi và quản lý tất cả giao dịch trong hệ thống</p>
        </div>
      </div>


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Tổng giao dịch"
          value={statistics.total.toLocaleString()}
          icon={CreditCard}
          trend="up"
          trendValue="+12% so với tháng trước"
          color="blue"
        />
        <StatCard
          title="Doanh thu hoàn thành"
          value={formatCurrency(statistics.totalRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue="+8.2% so với tháng trước"
          color="green"
        />
        <StatCard
          title="Đang chờ xử lý"
          value={statistics.pending.toLocaleString()}
          icon={Users}
          trend="down"
          trendValue="-2.1% so với tuần trước"
          color="yellow"
        />
        <StatCard
          title="Tỷ lệ thành công"
          value={`${statistics.successRate}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+1.2% so với tháng trước"
          color="green"
        />
      </div>      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <SimpleChart
          data={statusChartData}
          title="Phân bố trạng thái"
          type="bar"
        />
        <SimpleChart
          data={gatewayChartData}
          title="Gateway thanh toán"
          type="bar"
        />
        <SimpleChart
          data={membershipChartData}
          title="Gói thành viên"
          type="bar"
        />
      </div>      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Bộ lọc và Tìm kiếm</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Gateway</SelectItem>
                {uniqueGateways.map((gateway) => (
                  <SelectItem key={gateway} value={gateway.toLowerCase()}>
                    {gateway}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Gói thành viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả gói</SelectItem>
                {uniqueMemberships.map((membership) => (
                  <SelectItem key={membership} value={membership.toLowerCase()}>
                    {membership}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <CardTitle className="text-lg">Danh sách Giao dịch</CardTitle>
            <Badge variant="outline" className="self-start sm:self-center">
              {filteredTransactions.length} / {transactions.length} giao dịch
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="min-w-full px-6 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Mã giao dịch</TableHead>
                    <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                    <TableHead className="min-w-[100px]">Số tiền</TableHead>
                    <TableHead className="min-w-[150px]">Nội dung</TableHead>
                    <TableHead className="min-w-[100px]">Gateway</TableHead>
                    <TableHead className="min-w-[120px]">Gói thành viên</TableHead>
                    <TableHead className="min-w-[100px]">Tài khoản</TableHead>
                    <TableHead className="text-right min-w-[100px]">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs sm:text-sm">
                        {transaction.referenceCode}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.transactionStatus} />
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatCurrency(transaction.revenue)}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-sm">
                        {transaction.content}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.gateway}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{transaction.membershipName}</TableCell>
                      <TableCell className="text-sm">#{transaction.accountId}</TableCell>                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Xem tài khoản
                          </DropdownMenuItem>
                          {transaction.transactionStatus.toLowerCase() === 'pending' && (
                            <DropdownMenuItem>
                              Xử lý giao dịch
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy giao dịch nào phù hợp với bộ lọc</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminTransactionsPage