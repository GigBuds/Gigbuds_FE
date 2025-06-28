'use client'

import { Search, Plus } from 'lucide-react'
import ConversationItem from './ConversationItem'
import { Conversation } from '@/types/messaging.types'

interface ConversationListProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
  conversations: Conversation[]
}

const ConversationList = ({ selectedChat, onSelectChat, conversations }: ConversationListProps) => {
  // Mock conversation data
  const mockConversations = [
    {
      id: 'user-1',
      name: 'Minh Luong',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Hey, how are you doing?',
      timestamp: '2m ago',
      unreadCount: 2,
      isOnline: true,
      isTyping: false
    },
    {
      id: 'user-2',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'See you tomorrow!',
      timestamp: '1h ago',
      unreadCount: 0,
      isOnline: true,
      isTyping: true
    },
    {
      id: 'user-3',
      name: 'Alex Johnson',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Thanks for the help',
      timestamp: '3h ago',
      unreadCount: 0,
      isOnline: false,
      isTyping: false
    },
    {
      id: 'user-4',
      name: 'Emily Davis',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Great work on the project!',
      timestamp: '1d ago',
      unreadCount: 1,
      isOnline: true,
      isTyping: false
    }
  ]

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedChat === conversation.id}
              onClick={() => onSelectChat(conversation.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConversationList 