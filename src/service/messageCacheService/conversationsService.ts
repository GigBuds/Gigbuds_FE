import { ChatHistory, ConversationMember, ConversationMetadata } from "@/types/messaging.types";
import { databaseInitializer, STORE_NAMES } from "./databaseInitializer";

class ConversationMetaDatasService {

    public async getAllConversationMetaDatas(): Promise<ConversationMetadata[]> {
        console.log('[VERBOSE] getAllConversationMetaDatas: Initiating retrieval of all conversation metadata.');
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] getAllConversationMetaDatas: Database instance acquired.');
            const conversations = (await db.getAll(STORE_NAMES.CONVERSATIONS)) as ConversationMetadata[];
            console.log(`[VERBOSE] getAllConversationMetaDatas: Retrieved ${conversations.length} conversations from store.`);
            
            // Sort by timestamp (most recent first)
            const sortedConversationMetaDatas = conversations.toSorted((a, b) => {
                return b.timestamp!.getTime() - a.timestamp!.getTime();
            });
            console.log('[VERBOSE] getAllConversationMetaDatas: Sorted conversations by timestamp (descending).', sortedConversationMetaDatas);
            console.log('All conversations retrieved successfully', sortedConversationMetaDatas);
            return sortedConversationMetaDatas;
        } catch (error) {
            console.error('[VERBOSE] getAllConversationMetaDatas: Failed to get all conversations:', error);
            throw error;
        }
    }

    public async getConversationMetaData(conversationId: number): Promise<ConversationMetadata | undefined> {
        console.log(`[VERBOSE] getConversationMetaData: Attempting to retrieve conversation with ID ${conversationId}.`);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] getConversationMetaData: Database instance acquired.');
            const conversation = await db.get(STORE_NAMES.CONVERSATIONS, conversationId);
            if (conversation) {
                console.log(`[VERBOSE] getConversationMetaData: Conversation found for ID ${conversationId}.`, conversation);
            } else {
                console.log(`[VERBOSE] getConversationMetaData: No conversation found for ID ${conversationId}.`);
            }
            console.log('ConversationMetaData retrieved successfully', conversation);
            return conversation;
        } catch (error) {
            console.error('[VERBOSE] getConversationMetaData: Failed to get conversation:', error);
            throw error;
        }
    }

    public async addConversationMetaData(conversation: ConversationMetadata): Promise<void> {
        console.log('[VERBOSE] addConversationMetaData: Adding new conversation metadata.', conversation);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] addConversationMetaData: Database instance acquired.');

            conversation.id = Number(conversation.id);
            conversation.timestamp = new Date(conversation.timestamp!);

            await db.add(STORE_NAMES.CONVERSATIONS, conversation);
            console.log('[VERBOSE] addConversationMetaData: Conversation metadata added to store.');
            console.log('ConversationMetaData added successfully', conversation);
        } catch (error) {
            console.error('[VERBOSE] addConversationMetaData: Failed to add conversation:', error);
            throw error;
        }
    }

    public async updateConversationMetaData(conversations: ConversationMetadata[]): Promise<void> {
        console.log(`[VERBOSE] updateConversationMetaData: Updating ${conversations.length} conversation(s).`, conversations);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] updateConversationMetaData: Database instance acquired.');
            const tx = db.transaction(STORE_NAMES.CONVERSATIONS, 'readwrite');
            console.log('[VERBOSE] updateConversationMetaData: Transaction started.');


            for (const conversation of conversations) {
                // convert these to number and date specifically cause its fucking javascript
                conversation.timestamp = new Date(conversation.timestamp!);
                conversation.id = Number(conversation.id);
                console.log('[VERBOSE] updateConversationMetaData: Updating conversation:', conversation);
                await tx.store.put(conversation); 
            }

            await tx.done;
            console.log('[VERBOSE] updateConversationMetaData: Transaction committed.');
            console.log('ConversationMetaData updated successfully', conversations);
        } catch (error) {
            console.error('[VERBOSE] updateConversationMetaData: Failed to update conversation:', error);
            throw error;
        }
    }

    public async getLatestMessageOfAConversation(conversationId: number): Promise<ChatHistory | undefined> {
        console.log(`[VERBOSE] getLatestMessageOfAConversation: Attempting to retrieve latest message for conversation with ID ${conversationId}.`);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] getLatestMessageOfAConversation: Database instance acquired.');
            const latestMessage = (await db.get(STORE_NAMES.CHAT_HISTORY, conversationId));
            console.log('[VERBOSE] getLatestMessageOfAConversation: Latest message retrieved successfully.', latestMessage);
            return latestMessage;
        } catch (error) {
            console.error('[VERBOSE] getLatestMessageOfAConversation: Failed to get latest message:', error);
            throw error;
        }
    }

    public async upsertConversationMetaData(conversation: ConversationMetadata): Promise<void> {
        console.log('[VERBOSE] upsertConversationMetaData: Upserting conversation metadata.', conversation);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] upsertConversationMetaData: Database instance acquired.');

            conversation.id = Number(conversation.id);
            console.log('conversation', conversation)
            conversation.timestamp = new Date(conversation.timestamp!);

            await db.put(STORE_NAMES.CONVERSATIONS, conversation);
            console.log('[VERBOSE] upsertConversationMetaData: Conversation metadata upserted in store.');
            console.log('ConversationMetaData upserted successfully', conversation);
        } catch (error) {
            console.error('[VERBOSE] upsertConversationMetaData: Failed to upsert conversation:', error);
            throw error;
        }
    }

    /**
     * Update the last message and timestamp for a conversation
     * Call this when a new message is added to chat history
     */
    public async updateLastMessage(conversationId: number, lastMessage: string, timestamp: number): Promise<void> {
        console.log(`[VERBOSE] updateLastMessage: Updating last message for conversation ID ${conversationId}. New message: "${lastMessage}", timestamp: ${timestamp}`);
        try {
            const conversation = await this.getConversationMetaData(conversationId);
            if (conversation) {
                console.log('[VERBOSE] updateLastMessage: Conversation found. Proceeding with update.', conversation);
                const updatedConversationMetaData: ConversationMetadata = {
                    ...conversation,
                    lastMessage,
                    timestamp: new Date(timestamp),
                };
                await this.updateConversationMetaData([updatedConversationMetaData]);
                console.log(`[VERBOSE] updateLastMessage: Last message and timestamp updated for conversation ${conversationId}.`);
                console.log(`Last message updated for conversation ${conversationId}`);
            } else {
                console.warn(`[VERBOSE] updateLastMessage: ConversationMetaData ${conversationId} not found when updating last message`);
            }
        } catch (error) {
            console.error('[VERBOSE] updateLastMessage: Failed to update last message:', error);
            throw error;
        }
    }

    /**
     * Update online status for a conversation participant
     */
    public async updateOnlineStatus(conversationId: number, isOnline: boolean): Promise<void> {
        console.log(`[VERBOSE] updateOnlineStatus: Updating online status for conversation ID ${conversationId} to ${isOnline}.`);
        try {
            const conversation = await this.getConversationMetaData(conversationId);
            if (conversation) {
                console.log('[VERBOSE] updateOnlineStatus: Conversation found. Proceeding with update.', conversation);
                const updatedConversationMetaData: ConversationMetadata = {
                    ...conversation,
                    members: conversation.members.map(member => ({
                        ...member,
                        isOnline: isOnline,
                    })),
                };
                await this.updateConversationMetaData([updatedConversationMetaData]);
                console.log(`[VERBOSE] updateOnlineStatus: Online status updated for conversation ${conversationId}: ${isOnline}`);
                console.log(`Online status updated for conversation ${conversationId}: ${isOnline}`);
            } else {
                console.warn(`[VERBOSE] updateOnlineStatus: ConversationMetaData ${conversationId} not found when updating online status`);
            }
        } catch (error) {
            console.error('[VERBOSE] updateOnlineStatus: Failed to update online status:', error);
            throw error;
        }
    }

    /**
     * Update typing status for a conversation, this will be invoked inside signalr typing status update callback 
     */
    public async updateTypingStatus(conversationId: number, whosTyping: ConversationMember[]): Promise<void> {
        console.log(`[VERBOSE] updateTypingStatus: Updating typing status for conversation ID ${conversationId}. whosTyping:`, whosTyping);
        try {
            const conversation = await this.getConversationMetaData(conversationId);
            if (conversation) {
                console.log('[VERBOSE] updateTypingStatus: Conversation found. Proceeding with update.', conversation);
                const updatedConversationMetaData: ConversationMetadata = {
                    ...conversation,
                    whosTyping,
                };
                await this.updateConversationMetaData([updatedConversationMetaData]);
                console.log(`[VERBOSE] updateTypingStatus: Typing status updated for conversation ${conversationId}.`);
            } else {
                console.warn(`[VERBOSE] updateTypingStatus: ConversationMetaData ${conversationId} not found when updating typing status`);
            }
        } catch (error) {
            console.error('[VERBOSE] updateTypingStatus: Failed to update typing status:', error);
            throw error;
        }
    }

    /**
     * Get conversations that have unread messages
     * This would need integration with message read status
     */
    public async getConversationMetaDatasWithUnreadMessages(): Promise<ConversationMetadata[]> {
        console.log('[VERBOSE] getConversationMetaDatasWithUnreadMessages: Attempting to retrieve conversations with unread messages (placeholder implementation).');
        try {
            // This is a placeholder - you'd need to cross-reference with chat history
            // to determine which conversations have unread messages
            const allConversationMetaDatas = await this.getAllConversationMetaDatas();
            console.log(`[VERBOSE] getConversationMetaDatasWithUnreadMessages: Retrieved ${allConversationMetaDatas.length} conversations. Returning all as unread (placeholder).`);
            
            // For now, return all conversations
            // In real implementation, you'd check chat history for unread messages
            console.log('Getting conversations with unread messages (placeholder implementation)');
            return allConversationMetaDatas;
        } catch (error) {
            console.error('[VERBOSE] getConversationMetaDatasWithUnreadMessages: Failed to get conversations with unread messages:', error);
            throw error;
        }
    }

    public async clearAllConversationMetaDatas(): Promise<void> {
        console.log('[VERBOSE] clearAllConversationMetaDatas: Clearing all conversation metadata from store.');
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[VERBOSE] clearAllConversationMetaDatas: Database instance acquired.');
            await db.clear(STORE_NAMES.CONVERSATIONS);
            console.log('[VERBOSE] clearAllConversationMetaDatas: All conversations cleared from store.');
            console.log('All conversations cleared successfully');
        } catch (error) {
            console.error('[VERBOSE] clearAllConversationMetaDatas: Failed to clear all conversations:', error);
            throw error;
        }
    }
}

export const conversationMetaDatasService = new ConversationMetaDatasService(); 