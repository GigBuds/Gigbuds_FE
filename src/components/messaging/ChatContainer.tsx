'use client'

import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import DeleteMessageModal from './DeleteMessageModal'
import { ChatHistory, ConversationMetadata, TypingIndicator } from '@/types/messaging.types'
import { useEffect, useState } from 'react'
import { chatHistoryService, conversationMetaDatasService } from '@/service/messageCacheService'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import fetchApi from '@/api/api'
import messagingSignalRService from '@/service/signalrService/messaging/messagingSignalRService'
import { selectUser } from '@/lib/redux/features/userSlice'
import { useAppSelector } from '@/lib/redux/hooks'
import { DELETE_MESSAGE, EDIT_MESSAGE, SEND_MESSAGE } from '@/service/signalrService/messaging/messagingInvokeMethods'
import { ON_MESSAGE_RECEIVED, ON_TYPING_INDICATOR_RECEIVED, ON_MESSAGE_EDITED, ON_MESSAGE_DELETED } from '@/service/signalrService/messaging/handleMessagingCallbacks'

interface ChatContainerProps {
  metadata: ConversationMetadata
  handleConversationChange: () => void
  messagesLoading: boolean
  setMessagesLoading: (loading: boolean) => void
}

const ChatContainer = ({ metadata, handleConversationChange, messagesLoading, setMessagesLoading }: ChatContainerProps) => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [userSendingMessage, setUserSendingMessage] = useState<boolean>(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [typingIndicator, setTypingIndicator] = useState<TypingIndicator>({
    isTyping: false,
    typerNames: [],
    conversationId: 0,
  });

  const sortMessages = (newMessages: ChatHistory[]) => {
    return newMessages.sort((a, b) => Number(a.messageId) - Number(b.messageId));
  }

  useEffect(() => {
    setMessages(sortMessages(messages));
    // console.log("messages", messages);
  }, [messages]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    messageId: string | null;
    messageContent: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    messageId: null,
    messageContent: '',
    isDeleting: false,
  });

  console.log("chat container mounted");

  useEffect(() => {
    const getConversationMesssages = async (conversationId: number, reset: boolean = true) => {
      if (userSendingMessage) {
        return;
      }
      try {
        if (reset) {
          setMessagesLoading(true);
          setCurrentPage(1);
          setHasMoreMessages(true);
        }
        console.log("getting messages for conversation", conversationId);
        let fetchedMessages = await chatHistoryService.getChatHistoryOfAConversation(conversationId);
        if (fetchedMessages.length === 0) {
          const result = await fetchApi.get(`messages/conversation-messages?conversationId=${conversationId}&pageSize=15&pageIndex=1`);
          await chatHistoryService.refreshChatHistory(result.data);
          fetchedMessages = await chatHistoryService.getChatHistoryOfAConversation(conversationId);
        }
        return fetchedMessages;
      } catch (error) {
        console.error('Error fetching conversation messages:', error);
      }
      finally {
        if (reset) {
          setMessagesLoading(false);
        }
      }
    }

    getConversationMesssages(metadata.id, true).then((fetchedMessages) => {
      if (fetchedMessages) {
        setMessages(fetchedMessages);
      }
    });
  }, [metadata.id, setMessagesLoading, userSendingMessage]);

  // Load more messages function
  const loadMoreMessages = async () => {
    if (isLoadingOlderMessages || !hasMoreMessages) return;

    try {
      setIsLoadingOlderMessages(true);
      const nextPage = currentPage + 1;
      
      // API call to get older messages with pagination
      console.log('result load more result', nextPage, metadata.id);
      const result = await fetchApi.get(
        `messages/conversation-messages?conversationId=${metadata.id}&pageIndex=${nextPage}&pageSize=10`
      );
      
      console.log("result.data", result.data);
      if (result.data && result.data.length > 0) {
        // Add older messages to the beginning of the list
        setMessages(prevMessages => {
          const newMessages = [...result.data, ...prevMessages];
          return sortMessages(newMessages);
        });

        setCurrentPage(nextPage);
        
        // Update IndexedDB cache
        await chatHistoryService.refreshChatHistory(result.data);
      } else {
        // No more messages available
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingOlderMessages(false);
    }
  };

  const handleSend = async (content: string) => {
    // send to server -> add to indexed db (refresh chat history) -> update message list (show as sending status) -> update typing indicator
    const message: ChatHistory = {
        content: content,
        messageId: '0',
        conversationId: Number(metadata.id),
        senderId: Number(user.id),
        senderName: user.name ?? '',
        senderAvatar: user.avatar ?? '',
        readByNames: [],
        timestamp: null,
        deliveryStatus: 'sending'
    };
    console.log('Sending message:', message);
    try {
      chatHistoryService.upsertChatHistory(message);
      const newMessage = (await messagingSignalRService.InvokeHubMethod(
        SEND_MESSAGE, 
        message)) as ChatHistory;

      console.log('New message:', newMessage);

      await chatHistoryService.upsertChatHistory(newMessage);
      await conversationMetaDatasService.upsertConversationMetaData({
        ...metadata, 
        id: Number(metadata.id), 
        timestamp: new Date(newMessage.timestamp!), 
        lastMessage: newMessage.content, 
        lastMessageSenderName: newMessage.senderName,
      });
      handleConversationChange();
      setMessages([...messages, newMessage]);
      setUserSendingMessage(true);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setUserSendingMessage(false);
    }
  }

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      // Create updated message object
      const updatedMessage: ChatHistory = {
        messageId: messageId,
        content: newContent,
        conversationId: metadata.id,
        senderId: user.id ?? 0,
        senderName: user.name ?? '',
        senderAvatar: user.avatar ?? '',
        readByNames: [],
        timestamp: new Date(),
        deliveryStatus: 'sending',
        isDeleted: false,
      };

      // Call API to update message
      await fetchApi.put('messages/conversation-messages', updatedMessage);

      await messagingSignalRService.SendHubMethod(EDIT_MESSAGE, messageId, metadata.id, newContent);
      await chatHistoryService.clearHistoryOfAConversation(metadata.id);

      // Update local state immediately for better UX
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.messageId === messageId 
            ? { ...msg, content: newContent }
            : msg
        )
      );

      // Update IndexedDB
      await chatHistoryService.upsertChatHistory({
        ...messages.find(m => m.messageId === messageId)!,
        content: newContent
      });

      // Check if this is the latest message and update conversation metadata
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
      );
      const latestMessage = sortedMessages[0];
      
      if (latestMessage && latestMessage.messageId === messageId) {
        // Update conversation metadata with the edited content
        await conversationMetaDatasService.upsertConversationMetaData({
          ...metadata,
          lastMessage: newContent,
          lastMessageSenderName: user.name ?? '',
          timestamp: new Date(latestMessage.timestamp!),
        });
        handleConversationChange();
      }

      console.log('Message edited successfully');
    } catch (error) {
      console.error('Failed to edit message:', error);
      throw error; // Re-throw to let the component handle the error
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    const message = messages.find(m => m.messageId === messageId);
    if (!message) return;

    setDeleteModal({
      isOpen: true,
      messageId,
      messageContent: message.content,
      isDeleting: false,
    });
  }

  const confirmDeleteMessage = async () => {
    if (!deleteModal.messageId) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      // Call API to delete message
      await fetchApi.delete(`messages/conversation-messages/${deleteModal.messageId}`);

      await messagingSignalRService.SendHubMethod(DELETE_MESSAGE, deleteModal.messageId, metadata.id);

      // Update local state immediately for better UX
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.messageId === deleteModal.messageId 
            ? { ...msg, isDeleted: true, content: 'Tin nhắn này đã bị xóa' }
            : msg
        )
      );

      // Update IndexedDB
      await chatHistoryService.upsertChatHistory({
        ...messages.find(m => m.messageId === deleteModal.messageId)!,
        isDeleted: true,
        content: 'Tin nhắn này đã bị xóa'
      });

      // Check if this was the latest message and update conversation metadata
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
      );
      const latestMessage = sortedMessages[0];
      
      if (latestMessage && latestMessage.messageId === deleteModal.messageId) {
        // Find the next latest message (if any)
        const newLatestMessage = sortedMessages[1];
        
        if (newLatestMessage) {
          // Update conversation metadata with the new latest message
          await conversationMetaDatasService.upsertConversationMetaData({
            ...metadata,
            lastMessage: newLatestMessage.isDeleted ? 'Tin nhắn này đã bị xóa' : newLatestMessage.content,
            lastMessageSenderName: newLatestMessage.senderName,
            timestamp: new Date(newLatestMessage.timestamp!),
          });
        } else {
          // No messages left, update with empty state
          await conversationMetaDatasService.upsertConversationMetaData({
            ...metadata,
            lastMessage: '',
            lastMessageSenderName: '',
            timestamp: null,
          });
        }
        handleConversationChange();
      }

      console.log('Message deleted successfully');
      
      // Close modal
      setDeleteModal({
        isOpen: false,
        messageId: null,
        messageContent: '',
        isDeleting: false,
      });
    } catch (error) {
      console.error('Failed to delete message:', error);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  }

  const cancelDeleteMessage = () => {
    setDeleteModal({
      isOpen: false,
      messageId: null,
      messageContent: '',
      isDeleting: false,
    });
  }

  useEffect(() => {
    const messageReceivedCallback = (data: unknown) => {
      const message = data as { conversation: ConversationMetadata, chatHistory: ChatHistory };
      console.log("message received callback", message);
      
      // Only handle messages for the currently selected conversation
      if (metadata.id === message.conversation.id) {
        // Update the messages list for the current conversation
        setMessages(prevMessages => [...prevMessages, message.chatHistory]);
        // Note: Global conversation metadata updates are handled by MessagingContainer
      }
      // The global callback in MessagingContainer handles conversation list updates
    };

    const typingIndicatorCallback = (data: unknown) => {
      console.log("typing indicator callback", data);
      const { isTyping, typerName, conversationId } = data as { isTyping: boolean, typerName: string, conversationId: number };
      console.log("typing indicator callback", isTyping, typerName, conversationId, metadata.id);
      if (conversationId !== metadata.id) return;
      if (typerName !== user.name && isTyping) {
        setTypingIndicator(prev => ({
          ...prev,
          typerNames: [...prev.typerNames, typerName],
          conversationId: conversationId,
        }));
      } 
      else if (!isTyping) {
        setTypingIndicator(prev => ({
          ...prev,
          typerNames: prev.typerNames.filter(name => name !== typerName),
          conversationId: conversationId,
        }));
      }
    };

    const messageEditedCallback = (data: unknown) => {
      console.log("message edited callback", data);
      const { messageId, conversationId, newContent } = data as { 
        messageId: string, 
        conversationId: number, 
        newContent: string
      };
      
      if (conversationId !== metadata.id) return;
      
      // Update local state for the current conversation
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(msg => 
          msg.messageId === messageId 
            ? { ...msg, content: newContent }
            : msg
        );

        // [HYP] If the edited message is the latest, update conversation metadata
        const sortedMessages = [...updatedMessages].sort((a, b) => 
          new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
        );
        const latestMessage = sortedMessages[0];
        if (latestMessage && latestMessage.messageId === messageId) {
          // [RES] Update conversation metadata with the edited content
          conversationMetaDatasService.upsertConversationMetaData({
            ...metadata,
            lastMessage: newContent,
            lastMessageSenderName: latestMessage.senderName,
            timestamp: new Date(latestMessage.timestamp!),
          });
          // [RES] Trigger conversation list refresh
          handleConversationChange();
        }
        return updatedMessages;
      });

      // Update IndexedDB for the current conversation
      const messageToUpdate = messages.find(m => m.messageId === messageId);
      if (messageToUpdate) {
        chatHistoryService.upsertChatHistory({
          ...messageToUpdate,
          content: newContent
        });
      }
      
      // Note: Global conversation metadata updates are handled by MessagingContainer
    };

    const messageDeletedCallback = (data: unknown) => {
      console.log("message deleted callback", data);
      const { messageId, conversationId } = data as { messageId: string, conversationId: number };
      
      if (conversationId !== metadata.id) return;
      
      // Update local state for the current conversation
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.messageId === messageId 
            ? { ...msg, isDeleted: true, content: 'Tin nhắn này đã bị xóa' }
            : msg
        )
      );

      // Update IndexedDB for the current conversation
      const messageToUpdate = messages.find(m => m.messageId === messageId);
      if (messageToUpdate) {
        chatHistoryService.upsertChatHistory({
          ...messageToUpdate,
          isDeleted: true,
          content: 'Tin nhắn này đã bị xóa'
        });
      }
      
      // Note: Global conversation metadata updates are handled by MessagingContainer
    };

    messagingSignalRService.registerCallback(ON_MESSAGE_RECEIVED, messageReceivedCallback);
    messagingSignalRService.registerCallback(ON_TYPING_INDICATOR_RECEIVED, typingIndicatorCallback);
    messagingSignalRService.registerCallback(ON_MESSAGE_EDITED, messageEditedCallback);
    messagingSignalRService.registerCallback(ON_MESSAGE_DELETED, messageDeletedCallback);

    return () => {
      messagingSignalRService.removeCallback(ON_MESSAGE_RECEIVED, messageReceivedCallback);
      messagingSignalRService.removeCallback(ON_TYPING_INDICATOR_RECEIVED, typingIndicatorCallback);
      messagingSignalRService.removeCallback(ON_MESSAGE_EDITED, messageEditedCallback);
      messagingSignalRService.removeCallback(ON_MESSAGE_DELETED, messageDeletedCallback);
    };
  }, [metadata.id, user.name]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <ChatHeader metadata={metadata} />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingComponent 
              size={40}
              showText={true}
              loadingText="Loading messages..."
              animationType="outline"
            />
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            typingIndicator={typingIndicator} 
            conversationId={metadata.id}
            onLoadMoreMessages={loadMoreMessages}
            isLoadingOlderMessages={isLoadingOlderMessages}
            hasMoreMessages={hasMoreMessages}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        )}
      </div>
      
      {/* Message Input */}
      <MessageInput handleSend={handleSend} selectedConversation={metadata}/>
      
      {/* Delete Confirmation Modal */}
      <DeleteMessageModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDeleteMessage}
        onConfirm={confirmDeleteMessage}
        messagePreview={deleteModal.messageContent}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  )
}

export default ChatContainer 