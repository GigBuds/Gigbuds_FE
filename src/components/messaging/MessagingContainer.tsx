'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ChatContainer from './ChatContainer'
import ConversationList from './ConversationList'
import { ConversationMetadata, conversationMetaDatasService, refreshConversationHistory } from '@/service/messageCacheService'
import fetchApi from '@/api/api'
import messagingSignalRService from '@/service/signalrService/messaging/messagingSignalRService'
import { selectUser } from '@/lib/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { clearUnreadMessages, selectMessagingMetadata } from '@/lib/redux/features/messagingMetadataSlice'
import { ON_CONVERSATION_CHECKIN, ON_CONVERSATION_CHECKOUT } from '@/service/signalrService/messaging/messagingInvokeMethods'

const MessagingContainer = () => {
  const [selectedConversation, setSelectedConversation] = useState<ConversationMetadata | null>(null) // set the latest conversation as selectedConversation
  const selectedConversationRef = useRef<ConversationMetadata | null>(null);
  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const { lastMessageTimestamp } = useAppSelector(selectMessagingMetadata);
  const dispatch = useAppDispatch();
  console.log("messaging container mounted");

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Clear unread messages when entering messages page
  useEffect(() => {
    // Clear all unread messages since user is now in the messages page
    const conversations = async () => {
      const allConversations = await conversationMetaDatasService.getAllConversationMetaDatas();
      for (const conv of allConversations) {
        dispatch(clearUnreadMessages(conv.id));
      }
    };
    conversations();
  }, [dispatch]);
  
  // Callback to update conversation list from ChatContainer after user send a messages or new message is received
  const handleConversationChange = useCallback(async () => {
    const conversations = await conversationMetaDatasService.getAllConversationMetaDatas();
    setConversations(conversations);
  }, []);

  useEffect(() => {
    if (lastMessageTimestamp > 0) {
      handleConversationChange();
    }
  }, [lastMessageTimestamp, handleConversationChange]);

  useEffect(() => {
    console.log(user.id);
    setConversationsLoading(true);
    const getConversations = async () => {
      try {
        const conversationMetadata = await fetchApi.get("messages/conversation-metadata?userId=" + user.id);
        console.log(conversationMetadata.data);
        await refreshConversationHistory(conversationMetadata.data);

        const fetchedConversations = await conversationMetaDatasService.getAllConversationMetaDatas();
        setConversations(fetchedConversations);
      } finally {
        setConversationsLoading(false);
      }
    }

    if (!messagingSignalRService.IsConnected) {
      messagingSignalRService.registerCallback("onConnected", async () => {
        await getConversations();
      })
    } else {
      getConversations();
    }

    return () => {
      messagingSignalRService.removeCallback("onConnected", async () => {
        await getConversations();
      });
      messagingSignalRService.SendHubMethod(
        ON_CONVERSATION_CHECKOUT, 
        Number(selectedConversationRef.current?.id)).catch(error => {
        console.error("Error sending conversation checkout", error);
      });
    }
  }, [user.id, selectedConversation]);

  // Handle conversation selection and trigger messages loading
  const handleConversationSelect = useCallback((conversation: ConversationMetadata) => {
    console.log("conversation selected", conversation);
    messagingSignalRService.SendHubMethod(
      ON_CONVERSATION_CHECKIN, 
      Number(conversation.id)).catch(error => {
      console.error("Error sending conversation checkin", error);
    });
    setSelectedConversation(conversation);
  }, []);

  // Callback to update messages loading state from ChatContainer
  const handleMessagesLoadingChange = useCallback((loading: boolean) => {
    setMessagesLoading(loading);
  }, []);

  return (
    <div className="h-full bg-[#F3F7FF] flex overflow-hidden">
      <div className="w-full max-w-[400px] border-r border-gray-200 bg-white overflow-hidden">
        <ConversationList 
          selectedConversation={selectedConversation}
          setSelectedConversation={handleConversationSelect}
          conversations={conversations}
          conversationsLoading={conversationsLoading}
          onConversationChange={handleConversationChange}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        {selectedConversation ? (
          <ChatContainer 
            metadata={selectedConversation} 
            handleConversationChange={handleConversationChange}
            messagesLoading={messagesLoading}
            setMessagesLoading={handleMessagesLoadingChange}
          />
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