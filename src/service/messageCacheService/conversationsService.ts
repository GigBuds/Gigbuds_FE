import { databaseInitializer, STORE_NAMES } from "./databaseInitializer";
import { Conversation } from "@/types/messaging.types";

class ConversationsService {

    public async getAllConversations(): Promise<Conversation[]> {
        try {
            const db = await databaseInitializer.getDatabase();
            const conversations = await db.getAll(STORE_NAMES.CONVERSATIONS);
            
            // Sort by timestamp (most recent first)
            const sortedConversations = conversations.sort((a, b) => b.timestamp - a.timestamp);
            console.log('All conversations retrieved successfully', sortedConversations);
            return sortedConversations;
        } catch (error) {
            console.error('Failed to get all conversations:', error);
            throw error;
        }
    }

    public async getConversation(conversationId: number): Promise<Conversation | undefined> {
        try {
            const db = await databaseInitializer.getDatabase();
            const conversation = await db.get(STORE_NAMES.CONVERSATIONS, conversationId);
            console.log('Conversation retrieved successfully', conversation);
            return conversation;
        } catch (error) {
            console.error('Failed to get conversation:', error);
            throw error;
        }
    }

    public async addConversation(conversation: Conversation): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.add(STORE_NAMES.CONVERSATIONS, conversation);
            console.log('Conversation added successfully', conversation);
        } catch (error) {
            console.error('Failed to add conversation:', error);
            throw error;
        }
    }

    public async updateConversation(conversation: Conversation): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.CONVERSATIONS, conversation);
            console.log('Conversation updated successfully', conversation);
        } catch (error) {
            console.error('Failed to update conversation:', error);
            throw error;
        }
    }

    public async upsertConversation(conversation: Conversation): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.CONVERSATIONS, conversation);
            console.log('Conversation upserted successfully', conversation);
        } catch (error) {
            console.error('Failed to upsert conversation:', error);
            throw error;
        }
    }

    /**
     * Update the last message and timestamp for a conversation
     * Call this when a new message is added to chat history
     */
    public async updateLastMessage(conversationId: number, lastMessage: string, timestamp: number): Promise<void> {
        try {
            const conversation = await this.getConversation(conversationId);
            if (conversation) {
                const updatedConversation: Conversation = {
                    ...conversation,
                    lastMessage,
                    timestamp,
                };
                await this.updateConversation(updatedConversation);
                console.log(`Last message updated for conversation ${conversationId}`);
            } else {
                console.warn(`Conversation ${conversationId} not found when updating last message`);
            }
        } catch (error) {
            console.error('Failed to update last message:', error);
            throw error;
        }
    }

    /**
     * Update online status for a conversation participant
     */
    public async updateOnlineStatus(conversationId: number, isOnline: boolean): Promise<void> {
        try {
            const conversation = await this.getConversation(conversationId);
            if (conversation) {
                const updatedConversation: Conversation = {
                    ...conversation,
                    isOnline,
                };
                await this.updateConversation(updatedConversation);
                console.log(`Online status updated for conversation ${conversationId}: ${isOnline}`);
            }
        } catch (error) {
            console.error('Failed to update online status:', error);
            throw error;
        }
    }

    /**
     * Update typing status for a conversation
     */
    public async updateTypingStatus(conversationId: number, isTyping: boolean): Promise<void> {
        try {
            const conversation = await this.getConversation(conversationId);
            if (conversation) {
                const updatedConversation: Conversation = {
                    ...conversation,
                    isTyping,
                };
                await this.updateConversation(updatedConversation);
                console.log(`Typing status updated for conversation ${conversationId}: ${isTyping}`);
            }
        } catch (error) {
            console.error('Failed to update typing status:', error);
            throw error;
        }
    }

    /**
     * Delete a conversation and optionally clean up related data
     */
    public async deleteConversation(conversationId: number, cleanupRelatedData: boolean = false): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.delete(STORE_NAMES.CONVERSATIONS, conversationId);

            if (cleanupRelatedData) {
                // Import here to avoid circular dependency
                const { chatHistoryService } = await import('./chatHistoryService');
                const { chatHistoryCacheService } = await import('./chatHistoryCacheService');
                const { draftsService } = await import('./draftsService');

                // Clean up related data
                await Promise.all([
                    chatHistoryService.clearConversationHistory(conversationId),
                    chatHistoryCacheService.clearConversationCache(conversationId),
                    draftsService.deleteDraft(conversationId),
                ]);

                console.log(`Conversation ${conversationId} and all related data deleted`);
            } else {
                console.log(`Conversation ${conversationId} deleted (related data preserved)`);
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
            throw error;
        }
    }

    /**
     * Sync conversations with server data
     * Replace all conversations with fresh data from server
     */
    public async syncConversations(serverConversations: Conversation[]): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            
            // Clear existing conversations
            await db.clear(STORE_NAMES.CONVERSATIONS);
            
            // Add new conversations
            const tx = db.transaction(STORE_NAMES.CONVERSATIONS, 'readwrite');
            for (const conversation of serverConversations) {
                await tx.store.add(conversation);
            }
            await tx.done;
            
            console.log(`Synced ${serverConversations.length} conversations from server`);
        } catch (error) {
            console.error('Failed to sync conversations:', error);
            throw error;
        }
    }

    /**
     * Get conversations that have unread messages
     * This would need integration with message read status
     */
    public async getConversationsWithUnreadMessages(): Promise<Conversation[]> {
        try {
            // This is a placeholder - you'd need to cross-reference with chat history
            // to determine which conversations have unread messages
            const allConversations = await this.getAllConversations();
            
            // For now, return all conversations
            // In real implementation, you'd check chat history for unread messages
            console.log('Getting conversations with unread messages (placeholder implementation)');
            return allConversations;
        } catch (error) {
            console.error('Failed to get conversations with unread messages:', error);
            throw error;
        }
    }
}

export const conversationsService = new ConversationsService(); 