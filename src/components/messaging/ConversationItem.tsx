'use client'

import { cn } from '@/lib/utils'
import UserAvatar from './UserAvatar'
import OnlineStatus from './OnlineStatus'
import TypingIndicator from './TypingIndicator'
import { Conversation } from '@/types/messaging.types'

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg transition-all duration-200 text-left",
        "hover:bg-gray-50",
        isSelected 
          ? "bg-orange-50 border border-orange-200" 
          : "hover:bg-gray-50"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with status */}
        <div className="relative">
          <UserAvatar 
            src={conversation.avatar}
            alt={conversation.name}
            size="md"
          />
          <OnlineStatus 
            status={conversation.isOnline ? 'online' : 'offline'} 
            size="sm" 
            className="absolute -bottom-1 -right-1" 
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={cn(
              "font-medium truncate",
              isSelected ? "text-orange-600" : "text-gray-900"
            )}>
              {conversation.name}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {conversation.timestamp}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {conversation.isTyping ? (
                <div className="flex items-center gap-2">
                  <TypingIndicator size="xs" />
                  <span className="text-orange-500 text-sm">typing...</span>
                </div>
              ) : (
                <p className={cn(
                  "text-sm truncate",
                  isSelected ? "text-gray-700" : "text-gray-600"
                )}>
                  {conversation.lastMessage}
                </p>
              )}
            </div>

            {/* Unread count */}
            {conversation.unreadCount > 0 && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0 min-w-[20px] text-center">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

export default ConversationItem 