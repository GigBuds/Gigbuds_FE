'use client'

import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface ChatContainerProps {
  chatId: string
}

const ChatContainer = ({ chatId }: ChatContainerProps) => {
  // Mock user data for the active chat
  const activeUser = {
    id: chatId,
    name: 'Minh Luong',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    lastSeen: 'Active now'
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <ChatHeader user={activeUser} />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <MessageList chatId={chatId} />
      </div>
      
      {/* Message Input */}
      <MessageInput />
    </div>
  )
}

export default ChatContainer 