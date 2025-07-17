"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { Button } from '../../../../ui/button'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
  Receipt,
  CheckCircle
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"
import accountService from '../../../service/accountService/accountService'
import transactionService from '../../../service/transactionService/transactionService'

// Interfaces
interface DashboardStatistics {
  accounts: {
    total: number
    active: number
    inactive: number
    jobSeekers: number
    employers: number
    growth: number
  }
  transactions: {
    total: number
    totalAmount: string
    successful: number
    failed: number
    pending: number
    growth: number
    membershipDistribution: { label: string; value: number }[]
  }
}

interface ChartData {
  date: string
  accounts?: number
  transactions?: number
  amount?: number
  membership1?: number
  membership2?: number
  membership3?: number
}

// StatCard Component
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
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]} flex-shrink-0`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Button Group Component
const ButtonGroup = ({ 
  options, 
  selected, 
  onChange, 
  className = "" 
}: {
  options: { value: string; label: string }[]
  selected: string
  onChange: (value: string) => void
  className?: string
}) => (
  <div className={`inline-flex rounded-lg border border-gray-200 ${className}`}>
    {options.map((option, index) => (
      <Button
        key={option.value}
        variant={selected === option.value ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange(option.value)}
        className={`
          ${index === 0 ? 'rounded-r-none' : index === options.length - 1 ? 'rounded-l-none' : 'rounded-none'}
          ${selected === option.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
          border-0 px-3 py-1.5 text-sm font-medium
        `}
      >
        {option.label}
      </Button>
    ))}
  </div>
)

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)  // Chart controls
  const [dataType, setDataType] = useState<'accounts' | 'transactions'>('accounts')
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly' | 'custom'>('weekly')
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string
    endDate: string
  }>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  })

  // Mock data for fallback
  const mockStatistics = useMemo(() => ({
    accounts: {
      total: 1250,
      active: 1050,
      inactive: 200,
      jobSeekers: 800,
      employers: 450,
      growth: 12.5
    },
    transactions: {
      total: 3420,
      totalAmount: "₫125,430,000",
      successful: 3180,
      failed: 140,
      pending: 100,
      growth: 8.7,
      membershipDistribution: [
        { label: 'Basic Pack', value: 45 },
        { label: 'Standard Pack', value: 35 },
        { label: 'Premium Pack', value: 20 }
      ]
    }
  }), [])  // Generate chart data based on current statistics and time range
  const generateChartData = useCallback((stats: DashboardStatistics, timeRange: 'weekly' | 'monthly' | 'yearly' | 'custom', customRange?: { startDate: string; endDate: string }) => {    const now = new Date()
    let periods: number
    const data: ChartData[] = []
    
    // Get membership distribution for calculations
    const membershipDist = stats.transactions.membershipDistribution || []
    const membership1 = membershipDist[0]?.value || 0
    const membership2 = membershipDist[1]?.value || 0
    const membership3 = membershipDist[2]?.value || 0
    
    if (timeRange === 'custom' && customRange) {
      // Handle custom date range
      const startDate = new Date(customRange.startDate)
      const endDate = new Date(customRange.endDate)
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Determine interval based on date range span
      let interval: number
      if (daysDiff <= 14) {
        interval = 1 // Daily for 2 weeks or less
      } else if (daysDiff <= 90) {
        interval = 7 // Weekly for 3 months or less
      } else {
        interval = 30 // Monthly for longer periods
      }
      
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        const daysSinceStart = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const growthFactor = Math.max(0.3, Math.min(1, 0.5 + (daysSinceStart / daysDiff) * 0.5))
        const variance = (Math.random() - 0.5) * 0.15
        const finalGrowthFactor = Math.max(0.2, growthFactor + variance)
        
        const accountValue = Math.round(stats.accounts.total * finalGrowthFactor)
        const transactionValue = Math.round(stats.transactions.total * finalGrowthFactor)
        const totalAmountNumber = parseInt(stats.transactions.totalAmount.replace(/[^\d]/g, '')) || 0
        const amountValue = Math.round(totalAmountNumber * finalGrowthFactor)
        
        const membershipVariance1 = (Math.random() - 0.5) * 0.1
        const membershipVariance2 = (Math.random() - 0.5) * 0.1
        const membershipVariance3 = (Math.random() - 0.5) * 0.1
        
        const membership1Value = Math.max(5, Math.round((membership1 + membershipVariance1 * 10) * finalGrowthFactor))
        const membership2Value = Math.max(5, Math.round((membership2 + membershipVariance2 * 10) * finalGrowthFactor))
        const membership3Value = Math.max(5, Math.round((membership3 + membershipVariance3 * 10) * finalGrowthFactor))
        
        data.push({
          date: currentDate.toISOString().split('T')[0],
          accounts: accountValue,
          transactions: transactionValue,
          amount: amountValue,
          membership1: membership1Value,
          membership2: membership2Value,
          membership3: membership3Value
        })
        
        currentDate.setDate(currentDate.getDate() + interval)
      }
    } else {
      // Handle predefined ranges (existing logic)
      if (timeRange === 'weekly') {
        periods = 12 // 12 weeks
      } else if (timeRange === 'monthly') {
        periods = 6 // 6 months
      } else {
        periods = 3 // 3 years
      }
      
      for (let i = periods - 1; i >= 0; i--) {
        const date = new Date(now)
        
        if (timeRange === 'weekly') {
          date.setDate(date.getDate() - (i * 7))
        } else if (timeRange === 'monthly') {
          date.setMonth(date.getMonth() - i)
        } else {
          date.setFullYear(date.getFullYear() - i)
        }
        
        // Simulate realistic growth over time with some variance
        let baseGrowthFactor: number
        
        if (timeRange === 'yearly') {
          baseGrowthFactor = 1 - (i * 0.15) // 15% less for each year back
        } else {
          baseGrowthFactor = 1 - (i * 0.08) // 8% less for each period back
        }
        
        const variance = (Math.random() - 0.5) * 0.2 // ±10% random variance
        const growthFactor = Math.max(0.2, Math.min(1, baseGrowthFactor + variance))
        
        const accountValue = Math.round(stats.accounts.total * growthFactor)
        const transactionValue = Math.round(stats.transactions.total * growthFactor)
        const totalAmountNumber = parseInt(stats.transactions.totalAmount.replace(/[^\d]/g, '')) || 0
        const amountValue = Math.round(totalAmountNumber * growthFactor)
        
        const membershipVariance1 = (Math.random() - 0.5) * 0.1
        const membershipVariance2 = (Math.random() - 0.5) * 0.1
        const membershipVariance3 = (Math.random() - 0.5) * 0.1
        
        const membership1Value = Math.max(5, Math.round((membership1 + membershipVariance1 * 10) * growthFactor))
        const membership2Value = Math.max(5, Math.round((membership2 + membershipVariance2 * 10) * growthFactor))
        const membership3Value = Math.max(5, Math.round((membership3 + membershipVariance3 * 10) * growthFactor))
        
        data.push({
          date: date.toISOString().split('T')[0],
          accounts: accountValue,
          transactions: transactionValue,
          amount: amountValue,
          membership1: membership1Value,
          membership2: membership2Value,
          membership3: membership3Value
        })
      }
    }
    
    return data
  }, [])

  // Data type options
  const dataTypeOptions = [
    { value: 'accounts', label: 'Tài khoản' },
    { value: 'transactions', label: 'Giao dịch' }
  ]  // Time range options
  const timeRangeOptions = [
    { value: 'weekly', label: 'Theo tuần' },
    { value: 'monthly', label: 'Theo tháng' },
    { value: 'yearly', label: 'Theo năm' },
    { value: 'custom', label: 'Tùy chọn' }
  ]

  // Validate custom date range
  const isValidDateRange = useMemo(() => {
    if (timeRange !== 'custom') return true
    const start = new Date(customDateRange.startDate)
    const end = new Date(customDateRange.endDate)
    return start <= end && start <= new Date() // Start should be before or equal to end, and not in the future
  }, [timeRange, customDateRange])

  // Calculate date range description for custom range
  const getDateRangeDescription = useMemo(() => {
    if (timeRange !== 'custom') return ''
    const start = new Date(customDateRange.startDate)
    const end = new Date(customDateRange.endDate)
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `${daysDiff + 1} ngày (${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')})`
  }, [timeRange, customDateRange])

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch real data, but use mock data as fallback
      let combinedStats: DashboardStatistics = mockStatistics

      try {
        // Fetch account data and calculate statistics
        const accountResponse = await accountService.getAllAccounts()
        if (accountResponse.success && accountResponse.data) {
          const accounts = accountResponse.data
          const totalAccounts = accounts.length
          const activeAccounts = accounts.filter(acc => acc.isEnabled).length
          const inactiveAccounts = totalAccounts - activeAccounts
          const jobSeekers = accounts.filter(acc => 
            acc.roles.some(role => 
              role.toUpperCase() === 'JOB_SEEKER' || 
              role.toUpperCase() === 'JOBSEEKER' ||
              role === 'JobSeeker'
            )
          ).length
          const employers = accounts.filter(acc => 
            acc.roles.some(role => 
              role.toUpperCase() === 'EMPLOYER' ||
              role === 'Employer'
            )
          ).length

          combinedStats = {
            ...combinedStats,
            accounts: {
              total: totalAccounts,
              active: activeAccounts,
              inactive: inactiveAccounts,
              jobSeekers,
              employers,
              growth: 12.5 // Mock growth rate
            }
          }
        }
      } catch {
        console.warn('Account data not available, using mock data for accounts')
      }

      try {
        // Fetch transaction data and calculate statistics
        const transactionResponse = await transactionService.getTransactions()
        if (transactionResponse.success && transactionResponse.data) {
          const transactions = transactionResponse.data
          const totalTransactions = transactions.length
          const successfulTransactions = transactions.filter(t => 
            t.transactionStatus?.toLowerCase() === 'success' ||
            t.transactionStatus?.toLowerCase() === 'completed' ||
            t.transactionStatus?.toLowerCase() === 'thành công'
          ).length
          const failedTransactions = transactions.filter(t => 
            t.transactionStatus?.toLowerCase() === 'failed' ||
            t.transactionStatus?.toLowerCase() === 'error' ||
            t.transactionStatus?.toLowerCase() === 'thất bại'
          ).length
          const pendingTransactions = totalTransactions - successfulTransactions - failedTransactions
          const totalAmount = transactions.reduce((sum, t) => sum + (t.revenue || 0), 0)

          // Calculate membership distribution
          const membershipCounts: { [key: string]: number } = {}
          transactions.forEach(t => {
            if (t.membershipName) {
              membershipCounts[t.membershipName] = (membershipCounts[t.membershipName] || 0) + 1
            }
          })
          
          const membershipDistribution = Object.entries(membershipCounts).map(([label, count]) => ({
            label,
            value: Math.round((count / totalTransactions) * 100)
          }))

          combinedStats = {
            ...combinedStats,
            transactions: {
              total: totalTransactions,
              totalAmount: new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }).format(totalAmount),
              successful: successfulTransactions,
              failed: failedTransactions,
              pending: pendingTransactions,
              growth: 8.7, // Mock growth rate
              membershipDistribution
            }
          }
        }
      } catch {
        console.warn('Transaction data not available, using mock data for transactions')
      }      setStatistics(combinedStats)

      // Generate chart data based on current statistics and time range
      if (timeRange !== 'custom' || isValidDateRange) {
        setChartData(generateChartData(combinedStats, timeRange, timeRange === 'custom' ? customDateRange : undefined))
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Không thể tải dữ liệu dashboard')
      // Use mock data as fallback
      setStatistics(mockStatistics)
      if (timeRange !== 'custom' || isValidDateRange) {
        setChartData(generateChartData(mockStatistics, timeRange, timeRange === 'custom' ? customDateRange : undefined))
      }
    } finally {
      setLoading(false)
    }
  }, [mockStatistics, generateChartData, timeRange, customDateRange, isValidDateRange])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])  // Update chart data when time range changes
  useEffect(() => {
    if (statistics && (timeRange !== 'custom' || isValidDateRange)) {
      setChartData(generateChartData(statistics, timeRange, timeRange === 'custom' ? customDateRange : undefined))
    }
  }, [timeRange, statistics, generateChartData, customDateRange, isValidDateRange])

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ payload: ChartData }>
    label?: string
  }) => {
    if (active && payload && payload.length && label) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-600">
            {new Date(label).toLocaleDateString('vi-VN')}
          </p>
          {dataType === 'accounts' ? (
            <p className="text-sm font-bold text-blue-600">
              Tài khoản: {data.accounts}
            </p>
          ) : (
            <>
              <p className="text-sm font-bold text-green-600">
                Giao dịch: {data.transactions}
              </p>
              <p className="text-sm font-bold text-purple-600">
                Số tiền: {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(data.amount || 0)}
              </p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Tổng quan hệ thống quản lý
          </p>
        </div>
        <Button 
          onClick={fetchDashboardData}
          variant="outline"
          className="w-fit"
        >
          <Activity className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Account Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê tài khoản</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng tài khoản"
            value={statistics?.accounts.total || 0}
            icon={Users}
            color="blue"
            trend="up"
            trendValue={`+${statistics?.accounts.growth || 0}%`}
          />
          <StatCard
            title="Tài khoản hoạt động"
            value={statistics?.accounts.active || 0}
            icon={UserCheck}
            color="green"
          />
          <StatCard
            title="Tài khoản không hoạt động"
            value={statistics?.accounts.inactive || 0}
            icon={UserX}
            color="red"
          />
          <StatCard
            title="Người tìm việc"
            value={statistics?.accounts.jobSeekers || 0}
            icon={Activity}
            color="yellow"
          />
        </div>
      </div>

      {/* Transaction Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê giao dịch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng giao dịch"
            value={statistics?.transactions.total || 0}
            icon={Receipt}
            color="blue"
            trend="up"
            trendValue={`+${statistics?.transactions.growth || 0}%`}
          />
          <StatCard
            title="Tổng doanh thu"
            value={statistics?.transactions.totalAmount || "₫0"}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Giao dịch thành công"
            value={statistics?.transactions.successful || 0}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Giao dịch thất bại"
            value={statistics?.transactions.failed || 0}
            icon={CreditCard}
            color="red"
          />
        </div>
      </div>

      {/* Interactive Chart */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              Biểu đồ thống kê {dataType === 'accounts' ? 'tài khoản' : 'giao dịch'}
            </CardTitle>            <p className="text-sm text-gray-600 mt-1">
              Dữ liệu {timeRange === 'weekly' ? 'theo tuần' : timeRange === 'monthly' ? 'theo tháng' : timeRange === 'yearly' ? 'theo năm' : getDateRangeDescription}
              {timeRange === 'custom' && !isValidDateRange && (
                <span className="text-red-500 ml-2">⚠️ Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc</span>
              )}
            </p>
          </div>
            <div className="flex flex-col sm:flex-row gap-3">
            <ButtonGroup
              options={dataTypeOptions}
              selected={dataType}
              onChange={(value) => setDataType(value as 'accounts' | 'transactions')}
            />            <ButtonGroup
              options={timeRangeOptions}
              selected={timeRange}
              onChange={(value) => setTimeRange(value as 'weekly' | 'monthly' | 'yearly' | 'custom')}
            />
            {timeRange === 'custom' && (
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">đến</span>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillAccounts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    if (timeRange === 'yearly') {
                      return date.getFullYear().toString()
                    } else if (timeRange === 'custom') {
                      // For custom ranges, determine format based on data span
                      const daysDiff = chartData.length > 1 ? 
                        Math.ceil((new Date(chartData[chartData.length - 1].date).getTime() - new Date(chartData[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0
                      
                      if (daysDiff <= 14) {
                        return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
                      } else if (daysDiff <= 90) {
                        return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
                      } else {
                        return date.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" })
                      }
                    } else {
                      return date.toLocaleDateString("vi-VN", {
                        month: "short",
                        day: timeRange === 'weekly' ? "numeric" : undefined,
                      })
                    }
                  }}
                  className="text-xs"
                />
                <Tooltip content={<CustomTooltip />} />
                
                {dataType === 'accounts' ? (
                  <Area
                    type="monotone"
                    dataKey="accounts"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#fillAccounts)"
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#fillTransactions)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Membership Distribution Chart */}
      {statistics?.transactions.membershipDistribution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Phân bổ gói thành viên
            </CardTitle>            <p className="text-sm text-gray-600">
              Tỷ lệ phần trăm các gói thành viên được mua (dữ liệu hiện tại)
            </p>
          </CardHeader>          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.transactions.membershipDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ label, value }) => `${label}: ${value}%`}
                    labelLine={false}
                  >
                    {statistics.transactions.membershipDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Tỷ lệ']}
                    labelFormatter={(label: string) => `Gói: ${label}`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value: string) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
