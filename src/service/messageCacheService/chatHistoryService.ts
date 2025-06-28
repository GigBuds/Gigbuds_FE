import { databaseInitializer, STORE_NAMES } from "./databaseInitializer";
import { ChatHistory } from "@/types/messaging.types";

class ChatHistoryService {

    public async getChatHistory(): Promise<ChatHistory[]> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readonly');
            const index = tx.store.index('conversationId');
            const messages = await index.getAll();
            
            // Sort by sentDate to maintain chronological order
            const sortedMessages = messages.sort((a, b) => a.sentDate - b.sentDate);
            console.log('Chat history fetched successfully', sortedMessages);
            return sortedMessages;
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
            throw error;
        }
    }

    public async updateConversationHistory(messages: ChatHistory[]): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
            for (const message of messages) {
                await tx.store.put(message);
            }
            await tx.done;
            console.log('Chat history updated successfully', messages);
        } catch (error) {
            console.error('Failed to update chat history:', error);
            throw error;
        }
    }

    public async replaceConversationHistory(conversationId: number, messages: ChatHistory[]): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
            
            // First, delete all existing messages for this conversation
            const index = tx.store.index('conversationId');
            const existingMessages = await index.getAll(conversationId);
            
            for (const message of existingMessages) {
                await tx.store.delete(message.messageId);
            }
            
            // Then add the new messages (limit to last 50)
            const limitedMessages = messages.slice(-50); // Keep only last 50 messages
            for (const message of limitedMessages) {
                await tx.store.add(message);
            }
            
            await tx.done;
            console.log('Chat history replaced successfully', limitedMessages);
        } catch (error) {
            console.error('Failed to replace chat history:', error);
            throw error;
        }
    }

    // public async addMessage(message: ChatHistory): Promise<void> {
    //     try {
    //         const db = await databaseInitializer.getDatabase();
    //         await db.add(STORE_NAMES.CHAT_HISTORY, message);
            
    //         // Maintain the 50 message limit per conversation
    //         await this.enforceMessageLimit(message.conversationId);
            
    //         // Update conversation metadata with the latest message
    //         await this.updateConversationLastMessage(message);
            
    //         console.log('Message added to chat history successfully', message);
    //     } catch (error) {
    //         console.error('Failed to add message to chat history:', error);
    //         throw error;
    //     }
    // }

    public async updateMessage(message: ChatHistory): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.CHAT_HISTORY, message);
            console.log('Message updated in chat history successfully', message);
        } catch (error) {
            console.error('Failed to update message in chat history:', error);
            throw error;
        }
    }

    // private async enforceMessageLimit(conversationId: number): Promise<void> {
    //     try {
    //         const db = await databaseInitializer.getDatabase();
    //         const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
    //         const index = tx.store.index('conversationId');
    //         const messages = await index.getAll(conversationId);
            
    //         // Sort by sentDate and keep only the latest 50
    //         const sortedMessages = messages.sort((a, b) => a.sentDate - b.sentDate);
            
    //         if (sortedMessages.length > 50) {
    //             const messagesToDelete = sortedMessages.slice(0, sortedMessages.length - 50);
    //             for (const message of messagesToDelete) {
    //                 await tx.store.delete(message.messageId);
    //             }
    //             console.log(`Removed ${messagesToDelete.length} old messages for conversation ${conversationId}`);
    //         }
            
    //         await tx.done;
    //     } catch (error) {
    //         console.error('Failed to enforce message limit:', error);
    //         throw error;
    //     }
    // }

    public async clearAllHistory(): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.clear(STORE_NAMES.CHAT_HISTORY);
            console.log('All chat history cleared successfully');
        } catch (error) {
            console.error('Failed to clear chat history:', error);
            throw error;
        }
    }

    public async clearConversationHistory(conversationId: number): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
            const index = tx.store.index('conversationId');
            const messages = await index.getAll(conversationId);
            
            for (const message of messages) {
                await tx.store.delete(message.messageId);
            }
            
            await tx.done;
            console.log(`Chat history cleared for conversation ${conversationId}`);
        } catch (error) {
            console.error('Failed to clear conversation history:', error);
            throw error;
        }
    }

    /**
     * Update conversation metadata when a new message is added
     * References the conversations collection to maintain consistency
     */
    private async updateConversationLastMessage(message: ChatHistory): Promise<void> {
        try {
            // Dynamic import to avoid circular dependency
            const { conversationsService } = await import('./conversationsService');
            await conversationsService.updateLastMessage(
                message.conversationId,
                message.content,
                message.sentDate
            );
        } catch (error) {
            console.error('Failed to update conversation last message:', error);
            // Don't throw here - this is auxiliary functionality
        }
    }
}

export const chatHistoryService = new ChatHistoryService();