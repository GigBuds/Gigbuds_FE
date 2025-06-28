'use client'

import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
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

interface MessageListProps {
  chatId: string
}

const MessageList = ({ chatId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock messages data
  const messages: Message[] = [
    {
      id: '1',
      content: 'Hey! How are you doing today?',
      senderId: 'user-1',
      senderName: 'Minh Luong',
      senderAvatar: '/api/placeholder/40/40',
      timestamp: '10:30 AM',
      isOwn: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished working on the new messaging feature.',
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      timestamp: '10:32 AM',
      isOwn: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      content: 'That sounds awesome! Can\'t wait to see it in action. 🚀',
      senderId: 'user-1',
      senderName: 'Minh Luong',
      senderAvatar: '/api/placeholder/40/40',
      timestamp: '10:33 AM',
      isOwn: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      content: 'The UI looks really clean with the black and orange gradient theme. What do you think?',
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      timestamp: '10:35 AM',
      isOwn: true,
      status: 'delivered',
      type: 'text'
    },
    {
      id: '5',
      content: 'Absolutely love it! The gradient gives it a modern feel.',
      senderId: 'user-1',
      senderName: 'Minh Luong',
      senderAvatar: '/api/placeholder/40/40',
      timestamp: '10:36 AM',
      isOwn: false,
      status: 'read',
      type: 'text'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-full overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 custom-scrollbar">
      {/* Date separator */}
      <div className="flex items-center justify-center">
        <div className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          Today
        </div>
      </div>

      {/* Messages */}
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1]
        const isGrouped = previousMessage && 
          previousMessage.senderId === message.senderId &&
          previousMessage.isOwn === message.isOwn

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isGrouped={isGrouped}
          />
        )
      })}

      {/* Typing indicator */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <UserAvatar 
            src="/api/placeholder/40/40"
            alt="User typing"
            size="sm"
          />
        </div>
        <TypingIndicator variant="bubble" size="sm" />
      </div>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList 