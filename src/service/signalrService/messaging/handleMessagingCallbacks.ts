import { ChatHistory, ConversationMetadata } from "@/types/messaging.types";
import messagingSignalRService from "./messagingSignalRService";
import { OnlineUser } from "@/lib/redux/features/messagingMetadataSlice";

export function handleMessagingCallbacks() {
  const connection = messagingSignalRService.HubConnection;
  if (!connection) return;

  connection.on("ReceiveMessageAsync", (conversation: ConversationMetadata, chatHistory: ChatHistory) => {
    console.log("MessagingSignalRService: Received message", conversation, chatHistory);
    conversation.id = Number(conversation.id);
    conversation.timestamp = conversation.timestamp ? new Date(conversation.timestamp) : null;
    chatHistory.conversationId = Number(chatHistory.conversationId);
    chatHistory.senderId = Number(chatHistory.senderId);
    chatHistory.timestamp = chatHistory.timestamp ? new Date(chatHistory.timestamp) : null;
    messagingSignalRService.triggerCallback("onMessageReceived", { conversation, chatHistory });
  });

  connection.on("ReceiveTypingIndicatorAsync", (isTyping: boolean, typerName: string, conversationId: number) => {
    console.log("MessagingSignalRService: Received typing indicator", isTyping, typerName, conversationId);
    conversationId = Number(conversationId);
    messagingSignalRService.triggerCallback("onTypingIndicatorReceived", { isTyping, typerName, conversationId });
  });

  connection.on("ReceiveMessageStatusAsync", (data) => {
    console.log("MessagingSignalRService: Received message status", data);
    messagingSignalRService.triggerCallback("onMessageStatusReceived", data);
  });

  connection.on("RemovedFromConversationAsync", (data) => {
    console.log("MessagingSignalRService: Removed from conversation", data);
    messagingSignalRService.triggerCallback("onRemovedFromConversation", data);
  });

  connection.on("JoinedConversationGroupAsync", (data) => {
    console.log("MessagingSignalRService: Joined conversation group", data);
    messagingSignalRService.triggerCallback("onJoinedConversationGroup", data);
  });

  connection.on("UserOnlineAsync", (userId: number) => {
    console.log("MessagingSignalRService: User online status updated", { userId });
    messagingSignalRService.triggerCallback("onUserOnline", userId);
  });

  connection.on("UserDisconnectedAsync", (onlineUser: OnlineUser) => {
    console.log("MessagingSignalRService: User offline status updated", { onlineUser });
    messagingSignalRService.triggerCallback("onUserDisconnected", onlineUser);
  });

  connection.on("MessageEditedAsync", (messageId: string, conversationId: number, newContent: string) => {
    console.log("MessagingSignalRService: Message edited", { messageId, conversationId, newContent });
    messagingSignalRService.triggerCallback("onMessageEdited", { 
      messageId: messageId, 
      conversationId: Number(conversationId), 
      newContent
    });
  });

  connection.on("MessageDeletedAsync", (messageId: string, conversationId: number) => {
    console.log("MessagingSignalRService: Message deleted", { messageId, conversationId });
    messagingSignalRService.triggerCallback("onMessageDeleted", { 
      messageId: messageId, 
      conversationId: Number(conversationId) 
    });
  });
}

export const RECEIVE_MESSAGE_ASYNC = "ReceiveMessageAsync";
export const RECEIVE_TYPING_INDICATOR_ASYNC = "ReceiveTypingIndicatorAsync";
export const RECEIVE_MESSAGE_STATUS_ASYNC = "ReceiveMessageStatusAsync";
export const REMOVED_FROM_CONVERSATION_ASYNC = "RemovedFromConversationAsync";
export const JOINED_CONVERSATION_GROUP_ASYNC = "JoinedConversationGroupAsync";
export const USER_ONLINE_ASYNC = "UserOnlineAsync";
export const USER_DISCONNECTED_ASYNC = "UserDisconnectedAsync";
export const MESSAGE_EDITED_ASYNC = "MessageEditedAsync";
export const MESSAGE_DELETED_ASYNC = "MessageDeletedAsync";

export const ON_MESSAGE_RECEIVED = "onMessageReceived";
export const ON_TYPING_INDICATOR_RECEIVED = "onTypingIndicatorReceived";
export const ON_MESSAGE_STATUS_RECEIVED = "onMessageStatusReceived";
export const ON_REMOVED_FROM_CONVERSATION = "onRemovedFromConversation";
export const ON_JOINED_CONVERSATION_GROUP = "onJoinedConversationGroup";
export const ON_USER_ONLINE = "onUserOnline";
export const ON_USER_DISCONNECTED = "onUserDisconnected";
export const ON_MESSAGE_EDITED = "onMessageEdited";
export const ON_MESSAGE_DELETED = "onMessageDeleted";