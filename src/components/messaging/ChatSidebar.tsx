'use client'

import { Search, Plus, Settings } from 'lucide-react'
import ConversationItem from './ConversationItem'
import OnlineStatus from './OnlineStatus'
import UserAvatar from './UserAvatar'

interface ChatSidebarProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

const ChatSidebar = ({ selectedChat, onSelectChat }: ChatSidebarProps) => {
  // Mock conversation data
  const conversations = [
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
    <div className="h-full bg-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-orange-800/30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">Messages</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-orange-800/20 transition-colors">
              <Plus className="w-5 h-5 text-orange-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-orange-800/20 transition-colors">
              <Settings className="w-5 h-5 text-orange-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-orange-800/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-600"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-orange-800/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar 
              src="/api/placeholder/40/40"
              alt="Your profile"
              size="md"
            />
            <OnlineStatus status="online" size="sm" className="absolute -bottom-1 -right-1" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">You</h3>
            <p className="text-sm text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
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

export default ChatSidebar 