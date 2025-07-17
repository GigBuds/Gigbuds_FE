'use client'

import { cn } from '@/lib/utils'
import { formatRelativeTime, formatTypingText } from '@/utils'
import UserAvatar from './UserAvatar'
import OnlineStatus from './OnlineStatus'
import TypingIndicator from './TypingIndicator'
import { ConversationMetadata } from '@/types/messaging.types'
import { selectUser } from '@/lib/redux/features/userSlice'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectMessagingMetadata } from '@/lib/redux/features/messagingMetadataSlice'
import { useEffect, useState } from 'react'
import { conversationMetaDatasService } from '@/service/messageCacheService'
import { checkIfTargetOnline } from '@/utils/checkIfConversationOnline'

interface ConversationItemProps {
  conversation: ConversationMetadata
  isSelected: boolean
  onClick: () => void
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const user = useAppSelector(selectUser)
  const messagingMetadata = useAppSelector(selectMessagingMetadata);
  const isTyping = conversation.whosTyping && conversation.whosTyping.length > 0;

  useEffect(() => {
    const onlineCheck = checkIfTargetOnline(conversation.members, messagingMetadata.onlineUsers);
    setIsOnline(onlineCheck);
    if (onlineCheck) {
      conversationMetaDatasService.upsertConversationMetaData({
        ...conversation,
        isOnline: true,
      });
    }
  }, [conversation, messagingMetadata.onlineUsers]);

  const typingText = isTyping ? formatTypingText(conversation.whosTyping.map(x => x.userName)) : '';

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg transition-all duration-200 text-left",
        "hover:bg-gray-50",
        isSelected 
          ? "bg-orange-50 border border-orange-200" 
          : conversation.newMessageUnread
            ? "border-2 border-blue-400 bg-blue-50/30"
            : "hover:bg-gray-50"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with status */}
        <div className="relative">
          <UserAvatar 
            src={conversation.creatorId === user.id ? conversation.avatarTwo : conversation.avatarOne}
            alt={(conversation.creatorId === user.id ? conversation.nameTwo : conversation.nameOne) || "User avatar"}
            size="md"
          />
          <OnlineStatus 
            status={isOnline ? 'online' : 'offline'} 
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
              {conversation.creatorId === user.id ? conversation.nameTwo : conversation.nameOne}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatRelativeTime(conversation.timestamp!.getTime())}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {isTyping ? (
                <div className="flex items-center gap-2">
                  <TypingIndicator size="xs" />
                  <span className="text-orange-500 text-sm">{typingText}</span>
                </div>
              ) : (
                <p className={cn(
                  "text-sm truncate",
                  isSelected ? "text-gray-700" : "text-gray-600"
                )}>
                  {conversation.lastMessageSenderName === user.name ? "Bạn" : conversation.lastMessageSenderName}: {conversation.lastMessage}
                </p>
              )}
            </div>

            {/* Unread count */}
            {messagingMetadata.unreadMessages.find(x => x.conversationId === conversation.id) && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0 min-w-[20px] text-center">
                {messagingMetadata.unreadMessages.find(x => x.conversationId === conversation.id)?.messageId}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

export default ConversationItem 