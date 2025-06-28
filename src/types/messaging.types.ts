export interface Conversation {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: number;
    isOnline: boolean;
    isTyping: boolean;
    unreadCount: number;
}

export interface Drafts {
    conversationId: number;
    content: string;
}

export interface ChatHistory {
    conversationId: number;
    messageId: number;
    senderId: number;
    readByIds: number[];
    sentDate: number;
    deliveryStatus: 'sending' | 'delivered' | 'read';
    isUnread: boolean;
    content: string;
}

export interface ChatHistoryCache {
    conversationId: number;
    messageId: number;
    senderId: number;
    readByIds: number[];
    sentDate: number;
    deliveryStatus: 'sending' | 'delivered' | 'read';
    isUnread: boolean;
    content: string;
}