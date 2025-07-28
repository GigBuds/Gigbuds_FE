'use client'

import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import { ChatHistory, TypingIndicator as TypingIndicatorType } from '@/types/messaging.types'
import { formatTypingText } from '@/utils/chatUtils'
import TypingIndicator from './TypingIndicator'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import { useScrollToTop } from '@/hooks/useScrollToTop'

interface MessageListProps {
  messages: ChatHistory[]
  typingIndicator: TypingIndicatorType
  conversationId: number
  onLoadMoreMessages?: () => void
  isLoadingOlderMessages?: boolean
  hasMoreMessages?: boolean
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>
  onDeleteMessage?: (messageId: string) => void
}

const MessageList = ({ 
  messages, 
  typingIndicator, 
  conversationId,
  onLoadMoreMessages,
  isLoadingOlderMessages = false,
  hasMoreMessages = true,
  onEditMessage,
  onDeleteMessage
} : MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [triggerInMiddleZone, setTriggerInMiddleZone] = useState(false)
  const previousScrollHeight = useRef<number>(0)
  const typingText = formatTypingText(typingIndicator.typerNames)
  
  console.log('messages', messages, typingIndicator, conversationId)

  // Scroll to top detection for loading older messages
  const { scrollElementRef, triggerElementRef } = useScrollToTop({
    threshold: 100,
    throttleMs: 500,
    onScrollToTop: () => {
      if (onLoadMoreMessages && hasMoreMessages && !isLoadingOlderMessages) {
        console.log('Loading more messages...')
        onLoadMoreMessages()
      }
    },
    enabled: hasMoreMessages && !isLoadingOlderMessages,
    onMiddleZoneChange: (inZone) => {
      setTriggerInMiddleZone(inZone)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Preserve scroll position when loading older messages
  useEffect(() => {
    const container = scrollElementRef.current
    if (!container || !isLoadingOlderMessages) return

    previousScrollHeight.current = container.scrollHeight
  }, [isLoadingOlderMessages])

  // Restore scroll position after older messages are loaded
  useEffect(() => {
    const container = scrollElementRef.current
    if (!container || isLoadingOlderMessages) return

    const newScrollHeight = container.scrollHeight
    const heightDifference = newScrollHeight - previousScrollHeight.current

    if (heightDifference > 0) {
      // Move scroll position down to preserve user's place + add buffer to hide trigger element
      const bufferOffset = 150 // Extra pixels to ensure trigger element is out of view
      container.scrollTop = heightDifference + bufferOffset
      setShouldAutoScroll(false)
    }
  }, [messages.length, isLoadingOlderMessages])

  // Auto-scroll to bottom for new messages (but not when loading older ones)
  useEffect(() => {
    if (shouldAutoScroll && !isLoadingOlderMessages) {
      scrollToBottom()
    }
  }, [messages, typingIndicator, shouldAutoScroll, isLoadingOlderMessages])

  // Detect if user is near bottom to enable auto-scroll
  useEffect(() => {
    const container = scrollElementRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShouldAutoScroll(isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      ref={scrollElementRef}
      className="h-full overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 custom-scrollbar"
    >
      {/* Trigger element for intersection observer */}
      {hasMoreMessages && (
        <div 
          ref={triggerElementRef} 
          className="h-8 w-full flex items-center justify-center transition-all duration-300"
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          <div className={`rounded-full transition-all duration-300 ${
            triggerInMiddleZone 
              ? 'w-20 h-1 bg-orange-400 opacity-80 shadow-lg' 
              : 'w-12 h-0.5 bg-gray-300 opacity-50'
          }`}></div>
          {triggerInMiddleZone && (
            <span className="ml-2 text-xs text-orange-500 font-medium animate-pulse">
              Thả để tải thêm
            </span>
          )}
        </div>
      )}

      {/* Loading indicator for older messages */}
      {isLoadingOlderMessages && (
        <div className="flex items-center justify-center py-4">
          <LoadingComponent 
            size={24}
            showText={true}
            loadingText="Đang tải tin nhắn cũ..."
            animationType="outline"
          />
        </div>
      )}

      {/* No more messages indicator */}
      {!hasMoreMessages && messages.length > 0 && (
        <div className="flex items-center justify-center py-2">
          <div className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Bắt đầu cuộc trò chuyện
          </div>
        </div>
      )}
      {/* Date separator */}
      <div className="flex items-center justify-center">
        <div className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          Hôm nay
        </div>
      </div>

      {/* Messages */}
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1]
        const isGrouped = previousMessage && 
          previousMessage.senderId === message.senderId 

        return (
          <MessageBubble
            key={message.messageId}
            message={message}
            isGrouped={isGrouped}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
          />
        )
      })}

      {/* Typing indicator */}
      {(typingIndicator.typerNames.length > 0 && typingIndicator.conversationId === conversationId) && (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <TypingIndicator variant="bubble" size="sm" />
        </div>
        <span className="text-gray-500 text-sm">{typingText}</span>
      </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList 