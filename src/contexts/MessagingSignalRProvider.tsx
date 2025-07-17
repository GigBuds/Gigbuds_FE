"use client";
import { addOnlineUsers, addUnreadMessage, emptyOnlineUsers, OnlineUser, setUserOfflineStatus, setUserOnlineStatus, conversationUpdated } from "@/lib/redux/features/messagingMetadataSlice";
import { selectUser } from "@/lib/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ON_USER_DISCONNECTED, ON_USER_ONLINE, ON_MESSAGE_RECEIVED, ON_MESSAGE_EDITED, ON_MESSAGE_DELETED } from "@/service/signalrService/messaging/handleMessagingCallbacks";
import { GET_ONLINE_USERS } from "@/service/signalrService/messaging/messagingInvokeMethods";
import messagingSignalRService from "@/service/signalrService/messaging/messagingSignalRService";
import { ChatHistory, ConversationMetadata } from "@/types/messaging.types";
import { conversationMetaDatasService, chatHistoryService } from "@/service/messageCacheService";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

export function MessagingSignalRProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const handleConnected = useCallback(async (data: unknown) => {
        console.log("onConnectedAsync", data);
        const onlineUsers = (await messagingSignalRService.InvokeHubMethod(GET_ONLINE_USERS)) as OnlineUser[];
        console.log("onlineUsers", onlineUsers);

        dispatch(emptyOnlineUsers());
        dispatch(addOnlineUsers(onlineUsers));
    }, [dispatch]);

    const handleUserOnline = useCallback((data: unknown) => {
        console.log("onUserOnlineStatusUpdated", data);
        const userId = data as number;
        if (userId !== user.id) {
            dispatch(setUserOnlineStatus(userId));
        }
    }, [dispatch, user.id]);

    const handleUserDisconnected = useCallback((data: unknown) => {
        console.log("onUserDisconnected", data);
        const disconnectedUser = data as { userId: number, lastActive: number };
        if (disconnectedUser.userId !== user.id) {
            dispatch(setUserOfflineStatus({ userId: disconnectedUser.userId, lastActive: disconnectedUser.lastActive }));
        }
    }, [dispatch, user.id]);

    // Global message received callback for app-wide notifications
    const handleGlobalMessageReceived = useCallback(async (data: unknown) => {
        const message = data as { conversation: ConversationMetadata, chatHistory: ChatHistory };
        console.log("Global message received in provider", message);
        
        // Always update the message in IndexedDB
        chatHistoryService.upsertChatHistory(message.chatHistory);
        
        // Update conversation metadata
        await conversationMetaDatasService.upsertConversationMetaData({
            ...message.conversation,
            newMessageUnread: pathname !== '/messages', // Mark as unread if not currently in messages page
        });
        
        // Add to unread messages for Sidebar notification if not in messages page
        if (pathname !== '/messages') {
            dispatch(addUnreadMessage({
                conversationId: message.conversation.id,
                messageId: message.chatHistory.messageId
            }));
        }

        dispatch(conversationUpdated());
    }, [dispatch, pathname]);

    // Global message edited callback for conversation metadata updates
    const handleGlobalMessageEdited = useCallback(async (data: unknown) => {
        const { messageId, conversationId, newContent } = data as { 
            messageId: string, 
            conversationId: number, 
            newContent: string
        };
        console.log("Global message edited in provider", { messageId, conversationId, newContent });
        
        // Get the latest messages for this conversation to check if edited message is the latest
        const conversationMessages = await chatHistoryService.getChatHistoryOfAConversation(conversationId);
        if (conversationMessages.length === 0) return;
        
        // Sort messages by timestamp to find the latest one
        const sortedMessages = conversationMessages.sort((a, b) => 
            new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
        );
        const latestMessage = sortedMessages[0];
        
        // If the edited message is the latest one, update conversation metadata
        if (latestMessage && latestMessage.messageId === messageId) {
            // Get current conversation metadata
            const currentConversations = await conversationMetaDatasService.getAllConversationMetaDatas();
            const targetConversation = currentConversations.find(conv => conv.id === conversationId);
            
            if (targetConversation) {
                // Update conversation metadata with the edited content
                await conversationMetaDatasService.upsertConversationMetaData({
                    ...targetConversation,
                    lastMessage: newContent,
                    // Keep the original sender name and timestamp
                });

                dispatch(conversationUpdated());
            }
        }
    }, []);

    // Global message deleted callback for conversation metadata updates
    const handleGlobalMessageDeleted = useCallback(async (data: unknown) => {
        const { messageId, conversationId } = data as { messageId: string, conversationId: number };
        console.log("Global message deleted in provider", { messageId, conversationId });
        
        // Get the latest messages for this conversation to check if deleted message was the latest
        const conversationMessages = await chatHistoryService.getChatHistoryOfAConversation(conversationId);
        if (conversationMessages.length === 0) return;
        
        // Sort messages by timestamp to find the latest one
        const sortedMessages = conversationMessages.sort((a, b) => 
            new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
        );
        const latestMessage = sortedMessages[0];
        
        // If the deleted message was the latest one, update conversation metadata with the new latest message
        if (latestMessage && latestMessage.messageId === messageId) {
            // Find the next latest message (if any)
            const newLatestMessage = sortedMessages[1]; // Second most recent message
            
            // Get current conversation metadata
            const currentConversations = await conversationMetaDatasService.getAllConversationMetaDatas();
            const targetConversation = currentConversations.find(conv => conv.id === conversationId);
            
            if (targetConversation) {
                if (newLatestMessage) {
                    // Update with the new latest message
                    await conversationMetaDatasService.upsertConversationMetaData({
                        ...targetConversation,
                        lastMessage: newLatestMessage.isDeleted ? 'Tin nhắn này đã bị xóa' : newLatestMessage.content,
                        lastMessageSenderName: newLatestMessage.senderName,
                        timestamp: new Date(newLatestMessage.timestamp!),
                    });
                } else {
                    // No messages left, update with empty state
                    await conversationMetaDatasService.upsertConversationMetaData({
                        ...targetConversation,
                        lastMessage: '',
                        lastMessageSenderName: '',
                        timestamp: null,
                    });
                }
                dispatch(conversationUpdated());
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (user.id !== null) {
            messagingSignalRService.StartConnection().then(() => {
                console.log("connection started");
            });

            console.log("registering callbacks");
            messagingSignalRService.registerCallback("onConnected", handleConnected);
            messagingSignalRService.registerCallback(ON_USER_ONLINE, handleUserOnline);
            messagingSignalRService.registerCallback(ON_USER_DISCONNECTED, handleUserDisconnected);
            messagingSignalRService.registerCallback(ON_MESSAGE_RECEIVED, handleGlobalMessageReceived);
            messagingSignalRService.registerCallback(ON_MESSAGE_EDITED, handleGlobalMessageEdited);
            messagingSignalRService.registerCallback(ON_MESSAGE_DELETED, handleGlobalMessageDeleted);
        }

        return () => {
            messagingSignalRService.removeCallback("onConnected", handleConnected);
            messagingSignalRService.removeCallback(ON_USER_ONLINE, handleUserOnline);
            messagingSignalRService.removeCallback(ON_USER_DISCONNECTED, handleUserDisconnected);
            messagingSignalRService.removeCallback(ON_MESSAGE_RECEIVED, handleGlobalMessageReceived);
            messagingSignalRService.removeCallback(ON_MESSAGE_EDITED, handleGlobalMessageEdited);
            messagingSignalRService.removeCallback(ON_MESSAGE_DELETED, handleGlobalMessageDeleted);
        };
    }, [user.id, dispatch, handleConnected, handleUserOnline, handleUserDisconnected, handleGlobalMessageReceived, handleGlobalMessageEdited, handleGlobalMessageDeleted]);

    useEffect(() => {
        return () => {
            messagingSignalRService.StopConnection();
        };
    }, []);

    return <>{children}</>;
}
