'use client'

import { useState } from 'react'
import ChatContainer from './ChatContainer'
import ConversationList from './ConversationList'

const MessagingContainer = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('user-1')

  return (
    <div className="h-full bg-[#F3F7FF] flex overflow-hidden">
      <div className="w-full max-w-[400px] border-r border-gray-200 bg-white overflow-hidden">
        <ConversationList 
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        {selectedChat ? (
          <ChatContainer chatId={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium mb-2 text-gray-700">Select a conversation</h3>
              <p className="text-sm text-gray-500">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagingContainer 