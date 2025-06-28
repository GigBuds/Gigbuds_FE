'use client'

import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react'
import UserAvatar from './UserAvatar'
import OnlineStatus from './OnlineStatus'
import { cn } from '@/lib/utils'

interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen: string
}

interface ChatHeaderProps {
  user: User
  onBack?: () => void
}

const ChatHeader = ({ user, onBack }: ChatHeaderProps) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          <div className="relative">
            <UserAvatar 
              src={user.avatar}
              alt={user.name}
              size="lg"
            />
            <OnlineStatus 
              status={user.isOnline ? 'online' : 'offline'} 
              size="md" 
              className="absolute -bottom-1 -right-1" 
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className={cn(
              "text-sm",
              user.isOnline ? "text-green-500" : "text-gray-500"
            )}>
              {user.isOnline ? 'Active now' : user.lastSeen}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
            <Phone className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
            <Video className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
            <MoreVertical className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader 