'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, User } from 'lucide-react'
import fetchApi from '@/api/api'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import toast from 'react-hot-toast'

interface JobSeeker {
  userId: number
  fullName: string
  avatar?: string
}

interface CreateConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateConversation: (id: number, fullName: string, avatar: string) => void
}

const CreateConversationModal = ({ isOpen, onClose, onCreateConversation }: CreateConversationModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<JobSeeker[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastUserElementRef = useRef<HTMLButtonElement | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setUsers([])
      setCurrentPage(1)
      setHasMore(true)
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [isOpen])

  // Search users API call
  const searchUsers = useCallback(async (query: string, page: number, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const response = await fetchApi.get(
        `job-seekers/names?name=${encodeURIComponent(query)}&pageIndex=${page}&pageSize=10`
      )

      const newUsers = response.data ?? []
      
      if (reset) {
        setUsers(newUsers)
      } else {
        setUsers(prev => [...prev, ...newUsers])
      }
      
      // Check if there are more users to load
      setHasMore(newUsers.length === 10)
      
    } catch (error) {
      console.error('Error searching users:', error)
      if (reset) {
        setUsers([])
      }
      toast.error('Không thể tìm kiếm người dùng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        searchUsers(searchQuery, 1, true)
        setCurrentPage(1)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isOpen, searchUsers])

  // Intersection observer for pagination
  useEffect(() => {
    if (!isOpen) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isLoadingMore) {
          const nextPage = currentPage + 1
          setCurrentPage(nextPage)
          searchUsers(searchQuery, nextPage, false)
        }
      },
      { threshold: 0.1 }
    )

    if (lastUserElementRef.current) {
      observerRef.current.observe(lastUserElementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [users, hasMore, loading, isLoadingMore, searchQuery, currentPage, searchUsers, isOpen])

  const handleUserSelect = (user: JobSeeker) => {
    console.log('user', user)
    onCreateConversation(user.userId, user.fullName, user.avatar ?? '')
    onClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setUsers([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tạo cuộc trò chuyện mới</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingComponent 
                size={32}
                showText={true}
                loadingText="Đang tìm kiếm..."
                animationType="outline"
              />
            </div>
          ) : users.length > 0 ? (
            <div className="p-2">
              {users.map((user, index) => (
                <button
                  key={user.userId}
                  ref={index === users.length - 1 ? lastUserElementRef : null}
                  onClick={() => handleUserSelect(user)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full text-left"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName}
                    </p>
                  </div>
                </button>
              ))}
              
              {/* Loading more indicator */}
              {isLoadingMore && (
                <div className="flex items-center justify-center p-4">
                  <LoadingComponent 
                    size={24}
                    showText={true}
                    loadingText="Đang tải thêm..."
                    animationType="outline"
                  />
                </div>
              )}
            </div>
          ) : searchQuery && !loading ? (
            <div className="flex items-center justify-center h-32 text-center text-gray-500 p-4">
              <div>
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm">Không tìm thấy người dùng nào</p>
                <p className="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-center text-gray-500 p-4">
              <div>
                <div className="text-3xl mb-2">👋</div>
                <p className="text-sm">Nhập tên để tìm kiếm người dùng</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateConversationModal 