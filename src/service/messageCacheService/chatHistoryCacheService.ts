import { databaseInitializer, STORE_NAMES } from "./databaseInitializer";
import { ChatHistoryCache } from "@/types/messaging.types";

class ChatHistoryCacheService {

    public async addOlderMessages(conversationId: number, messages: ChatHistoryCache[]): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY_CACHE, 'readwrite');
            
            for (const message of messages) {
                // use put instead of add to handle duplicates gracefully
                await tx.store.put(message);
            }
            
            await tx.done;
            console.log('Older messages added to cache successfully', messages);
        } catch (error) {
            console.error('Failed to add older messages to cache:', error);
            throw error;
        }
    }

    public async getOlderMessages(conversationId: number): Promise<ChatHistoryCache[]> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY_CACHE, 'readonly');
            const index = tx.store.index('conversationId');
            const messages = await index.getAll(conversationId);
            
            // Sort by sentDate to maintain chronological order
            const sortedMessages = messages.sort((a, b) => a.sentDate - b.sentDate);
            console.log('Older messages fetched successfully', sortedMessages);
            return sortedMessages;
        } catch (error) {
            console.error('Failed to fetch older messages:', error);
            throw error;
        }
    }

    public async addSingleMessage(message: ChatHistoryCache): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.CHAT_HISTORY_CACHE, message);
            console.log('Single message added to cache successfully', message);
        } catch (error) {
            console.error('Failed to add single message to cache:', error);
            throw error;
        }
    }

    public async updateMessage(message: ChatHistoryCache): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.CHAT_HISTORY_CACHE, message);
            console.log('Message updated in cache successfully', message);
        } catch (error) {
            console.error('Failed to update message in cache:', error);
            throw error;
        }
    }

    public async getMessage(messageId: number): Promise<ChatHistoryCache | undefined> {
        try {
            const db = await databaseInitializer.getDatabase();
            const message = await db.get(STORE_NAMES.CHAT_HISTORY_CACHE, messageId);
            console.log('Message retrieved from cache successfully', message);
            return message;
        } catch (error) {
            console.error('Failed to get message from cache:', error);
            throw error;
        }
    }

    /**
     * Clear all cache data - called when user logs out/closes tab/tab unloads
     * This is critical for the cache cleanup requirement
     */
    public async clearCache(): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.clear(STORE_NAMES.CHAT_HISTORY_CACHE);
            console.log('Chat history cache cleared successfully');
        } catch (error) {
            console.error('Failed to clear chat history cache:', error);
            throw error;
        }
    }

    /**
     * Clear cache for a specific conversation
     */
    public async clearConversationCache(conversationId: number): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY_CACHE, 'readwrite');
            const index = tx.store.index('conversationId');
            const messages = await index.getAll(conversationId);
            
            for (const message of messages) {
                await tx.store.delete(message.messageId);
            }
            
            await tx.done;
            console.log(`Cache cleared for conversation ${conversationId}`);
        } catch (error) {
            console.error('Failed to clear conversation cache:', error);
            throw error;
        }
    }

    /**
     * Get count of cached messages for a conversation
     */
    public async getCacheCount(conversationId: number): Promise<number> {
        try {
            const messages = await this.getOlderMessages(conversationId);
            return messages.length;
        } catch (error) {
            console.error('Failed to get cache count:', error);
            throw error;
        }
    }

    /**
     * Get all cached conversations (for debugging/monitoring)
     */
    public async getAllCachedConversations(): Promise<number[]> {
        try {
            const db = await databaseInitializer.getDatabase();
            const messages = await db.getAll(STORE_NAMES.CHAT_HISTORY_CACHE);
            const conversationIds = [...new Set(messages.map(msg => msg.conversationId))];
            console.log('All cached conversations retrieved', conversationIds);
            return conversationIds;
        } catch (error) {
            console.error('Failed to get all cached conversations:', error);
            throw error;
        }
    }
}

export const chatHistoryCacheService = new ChatHistoryCacheService();