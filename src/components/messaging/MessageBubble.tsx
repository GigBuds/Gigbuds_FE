'use client'

import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import UserAvatar from './UserAvatar'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar: string
  timestamp: string
  isOwn: boolean
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file'
}

interface MessageBubbleProps {
  message: Message
  isGrouped?: boolean
}

const MessageBubble = ({ message, isGrouped = false }: MessageBubbleProps) => {
  const { content, timestamp, isOwn, status, senderAvatar, senderName } = message

  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-4 h-4 text-orange-500" />
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "flex gap-3",
      isOwn ? "justify-end" : "justify-start",
      isGrouped && "mt-1"
    )}>
      {/* Avatar for other users */}
      {!isOwn && !isGrouped && (
        <div className="flex-shrink-0 mt-1">
          <UserAvatar 
            src={senderAvatar}
            alt={senderName}
            size="sm"
          />
        </div>
      )}

      {/* Spacer for grouped messages */}
      {!isOwn && isGrouped && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[70%] flex flex-col",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender name for other users (only if not grouped) */}
        {!isOwn && !isGrouped && (
          <span className="text-xs text-gray-500 mb-1 ml-3">
            {senderName}
          </span>
        )}

        {/* Message bubble */}
        <div className={cn(
          "relative px-4 py-3 rounded-2xl break-words shadow-sm",
          isOwn 
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm" 
            : "bg-white text-gray-900 rounded-bl-sm border border-gray-200",
          "max-w-full"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        {/* Timestamp and status */}
        <div className={cn(
          "flex items-center gap-1 mt-1 px-2",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs text-gray-400">
            {timestamp}
          </span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble 