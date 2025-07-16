export interface ConversationMetadata {
    id: number;
    nameOne: string; // name of the first user in the conversation (if it's a group conversation, it will be the group name)
    nameTwo: string; // name of the second user in the conversation
    avatarOne: string; // avatar of the first user in the conversation (if it's a group conversation, it will be the group avatar)
    avatarTwo: string; // avatar of the second user in the conversation
    creatorId: number; // id of the user who initiated the conversation
    lastMessageSenderName: string;
    lastMessage: string;
    timestamp: Date | null; // last message timestamp, depicts last activity (will be converted to mins ago, days ago,...)
    whosTyping: ConversationMember[]; // [userId, userName]
    members: ConversationMember[]; // [userId, userName]
    newMessageUnread: boolean; // if true, the conversation has a new message
    isOnline: boolean;
}

export interface ConversationMember {
    userId: number;
    userName: string;
}

export interface Drafts {
    conversationId: number;
    content: string;
}

export interface ChatHistory {
    conversationId: number;
    messageId: string;
    senderId: number;
    senderName: string;
    senderAvatar: string; 
    readByNames: string[];
    timestamp: Date | null; // message sent date
    deliveryStatus: 'sending' | 'delivered' | 'read' | 'failed';
    content: string;
    isDeleted?: boolean; // if true, show "Message deleted" placeholder
}

export interface TypingIndicator {
    isTyping: boolean;
    typerNames: string[];
    conversationId: number;
}