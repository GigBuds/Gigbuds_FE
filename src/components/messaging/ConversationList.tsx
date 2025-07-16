'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import ConversationItem from './ConversationItem'
import CreateConversationModal from './CreateConversationModal'
import { ConversationMetadata, ConversationMember } from '@/types/messaging.types'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import { ON_CONVERSATION_CHECKOUT } from '@/service/signalrService/messaging/messagingInvokeMethods'
import messagingSignalRService from '@/service/signalrService/messaging/messagingSignalRService'
import { conversationMetaDatasService } from '@/service/messageCacheService'
import fetchApi from '@/api/api'
import toast from 'react-hot-toast'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectUser } from '@/lib/redux/features/userSlice'

interface ConversationListProps {
  selectedConversation: ConversationMetadata | null
  setSelectedConversation: (conversation: ConversationMetadata) => void
  conversations: ConversationMetadata[]
  conversationsLoading: boolean
  onConversationChange: () => void
}

const ConversationList = ({ 
  selectedConversation, 
  setSelectedConversation, 
  conversations, 
  conversationsLoading,
  onConversationChange
}: ConversationListProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const currentUser = useAppSelector(selectUser)

  const handleConversationSelect = (conversation: ConversationMetadata) => {
    if (selectedConversation?.id === conversation.id) {
      return;
    }
    messagingSignalRService.SendHubMethod(
      ON_CONVERSATION_CHECKOUT, 
      Number(selectedConversation?.id)).catch(error => {
      console.error("Error sending conversation checkout", error);
    });

    if (conversation.newMessageUnread) { // if the selected conversation has a new message, mark it as read
      conversationMetaDatasService.upsertConversationMetaData({
        ...conversation,
        newMessageUnread: false,
      });
    }
    setSelectedConversation(conversation);
  }

  const handleCreateConversation = async (id: number, fullName: string, avatar: string) => {
    try {
      setIsCreatingConversation(true)
      
      // Check if conversation already exists with this user
      const existingConversation = conversations.find(conv => 
        conv.members?.some((member: ConversationMember) => member.userId === id)
      )
      
      if (existingConversation) {
        // If conversation exists, just select it
        handleConversationSelect(existingConversation)
        return
      }

      // Create the request body according to the API specification
      const members: Record<string, string> = {}
      members[currentUser.id!.toString()] = currentUser.name ?? ''
      console.log('currentUser', id, fullName, avatar)
      members[id.toString()] = fullName

      const requestBody = {
        Members: members,
        CreatorId: currentUser.id!.toString(),
        ConversationNameOne: currentUser.name ?? '',
        ConversationNameTwo: fullName,
        AvatarOne: currentUser.avatar ?? '',
        AvatarTwo: avatar,
        CreatedAt: new Date().toISOString()
      }

      // Create new conversation via API
      const response = await fetchApi.post('messages/conversation-metadata', requestBody)

      const newConversation: ConversationMetadata = response
      // Update local cache
      console.log('newConversation', newConversation)
      await conversationMetaDatasService.upsertConversationMetaData(newConversation)
      
      // Refresh conversations list
      onConversationChange()
      
      // Select the new conversation
      setSelectedConversation(newConversation)
      
      toast.success('Đã tạo cuộc trò chuyện mới thành công!')
      
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error('Không thể tạo cuộc trò chuyện. Vui lòng thử lại.')
    } finally {
      setIsCreatingConversation(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isCreatingConversation}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Tạo cuộc trò chuyện mới"
          >
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
        {conversationsLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingComponent 
              size={40}
              showText={true}
              loadingText="Loading conversations..."
              animationType="outline"
            />
          </div>
        ) : (
        <div className="p-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => handleConversationSelect(conversation)}
            />
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500 p-4">
                <div>
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click the + button to start a new conversation
                  </p>
                </div>
              </div>
            )}
        </div>
        )}
      </div>

      {/* Create Conversation Modal */}
      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  )
}

export default ConversationList 