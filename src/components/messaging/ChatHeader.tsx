'use client'

import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { cn } from '@/lib/utils'
import { ConversationMetadata } from '@/types/messaging.types'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectUser } from '@/lib/redux/features/userSlice'

interface ChatHeaderProps {
  metadata: ConversationMetadata 
  onBack?: () => void
}

const ChatHeader = ({ metadata, onBack }: ChatHeaderProps) => {
  
  const user = useAppSelector(selectUser)
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Conversation Info */}
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
              src={metadata.creatorId === user.id ? metadata.avatarTwo : metadata.avatarOne}
              alt={(metadata.creatorId === user.id ? metadata.nameTwo : metadata.nameOne) || "User avatar"}
              size="lg"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">{metadata.creatorId === user.id ? metadata.nameTwo : metadata.nameOne}</h2>
            <p className={cn(
              "text-sm",
              metadata.isOnline ? "text-green-500" : "text-gray-500"
            )}>
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