import { databaseInitializer, STORE_NAMES } from "./databaseInitializer";
import { ChatHistory } from "@/types/messaging.types";

class ChatHistoryService {
    public async upsertChatHistory(message: ChatHistory): Promise<void> {
        if (!message) {
            throw new Error('[ChatHistoryService] upsertChatHistory: Invalid message object.');
        }
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
            message.timestamp = new Date(message.timestamp!);
            message.conversationId = Number(message.conversationId);
            console.log('[ChatHistoryService] upsertChatHistory: Message to be added/updated:', message);
            await tx.store.put(message);
            console.log(`[ChatHistoryService] upsertChatHistory: Message with messageId=${message.messageId} added/updated successfully.`);
        } catch (error) {
            console.error('[ChatHistoryService] upsertChatHistory: Failed to add message:', error);
            throw error;
        }
    }

    public async getChatHistory(): Promise<ChatHistory[]> {
        console.log('[ChatHistoryService] getChatHistory: Initiating fetch of all chat history...');
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[ChatHistoryService] getChatHistory: Database instance acquired:', db);
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readonly');
            console.log('[ChatHistoryService] getChatHistory: Transaction started on store:', STORE_NAMES.CHAT_HISTORY);
            const index = tx.store.index('conversationId');
            console.log('[ChatHistoryService] getChatHistory: Index "conversationId" accessed.');
            const messages = (await index.getAll()) as ChatHistory[];
            console.log(`[ChatHistoryService] getChatHistory: Retrieved ${messages.length} messages from index.`);

            // Sort by timestamp to maintain chronological order
            const sortedMessages = messages.toSorted((a, b) => (b.timestamp!.getTime()) - (a.timestamp!.getTime()));
            console.log('[ChatHistoryService] getChatHistory: Messages sorted by timestamp.', sortedMessages);
            console.log('[ChatHistoryService] getChatHistory: Chat history fetched successfully.');
            return sortedMessages;
        } catch (error) {
            console.error('[ChatHistoryService] getChatHistory: Failed to fetch chat history:', error);
            throw error;
        }
    }

    public async getChatHistoryOfAConversation(conversationId: number): Promise<ChatHistory[]> {
        console.log(`[ChatHistoryService] getChatHistoryOfAConversation: Fetching messages for conversationId=${conversationId}...`);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[ChatHistoryService] getChatHistoryOfAConversation: Database instance acquired:', db);

            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readonly');

            console.log('[ChatHistoryService] getChatHistoryOfAConversation: Transaction started on store:', STORE_NAMES.CHAT_HISTORY);
            const index = tx.store.index("conversationId");
            
            const messages = (await index.getAll(conversationId));
            console.log('[ChatHistoryService] getChatHistoryOfAConversation: messages', messages);

            // Defensive: Ensure chronological order even if DB index is not sorted
            const sortedMessages = messages.toSorted((a, b) => (a.timestamp!.getTime()) - (b.timestamp!.getTime()));
            console.log('[ChatHistoryService] getChatHistoryOfAConversation: Sorted messages:', sortedMessages);

            console.log('[ChatHistoryService] getChatHistoryOfAConversation: Chat history for conversation fetched successfully.');
            return sortedMessages;
        } catch (error) {
            console.error('[ChatHistoryService] getChatHistoryOfAConversation: Failed to get messages:', error);
            throw error;
        }
    }

    public async refreshChatHistory(messages: ChatHistory[]): Promise<void> {
        console.log(`[ChatHistoryService] refreshConversationHistory: Refreshing conversation history with ${messages.length} messages...`);
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[ChatHistoryService] refreshConversationHistory: Database instance acquired:', db);
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
            console.log('[ChatHistoryService] refreshConversationHistory: Transaction started on store:', STORE_NAMES.CHAT_HISTORY);

            for (const message of messages) {
                message.timestamp = new Date(message.timestamp!);
                message.conversationId = Number(message.conversationId);
                console.log('[ChatHistoryService] refreshConversationHistory: Putting message:', message);
                await tx.store.put(message);
            }

            await tx.done;
            console.log('[ChatHistoryService] refreshConversationHistory: Transaction committed. Chat history updated successfully.', messages);
        } catch (error) {
            console.error('[ChatHistoryService] refreshConversationHistory: Failed to update chat history:', error);
            throw error;
        }
    }

    public async clearHistoryOfAConversation(conversationId: number): Promise<void> {
        console.log(`[ChatHistoryService] clearHistoryOfAConversation: Clearing chat history for conversationId=${conversationId}...`);
        try {
            const db = await databaseInitializer.getDatabase();
            const tx = db.transaction(STORE_NAMES.CHAT_HISTORY, 'readwrite');
            await tx.store.delete(conversationId);
            console.log(`[ChatHistoryService] clearHistoryOfAConversation: Chat history for conversationId=${conversationId} cleared successfully.`);
        } catch (error) {
            console.error(`[ChatHistoryService] clearHistoryOfAConversation: Failed to clear chat history for conversationId=${conversationId}:`, error);
            throw error;
        }
    }

    public async clearAllHistory(): Promise<void> {
        console.log('[ChatHistoryService] clearAllHistory: Clearing all chat history...');
        try {
            const db = await databaseInitializer.getDatabase();
            console.log('[ChatHistoryService] clearAllHistory: Database instance acquired:', db);
            await db.clear(STORE_NAMES.CHAT_HISTORY);
            console.log('[ChatHistoryService] clearAllHistory: All chat history cleared successfully.');
        } catch (error) {
            console.error('[ChatHistoryService] clearAllHistory: Failed to clear chat history:', error);
            throw error;
        }
    }

    /**
     * Update conversation metadata when a new message is added
     * References the conversations collection to maintain consistency
     */
    private async updateConversationLastMessage(message: ChatHistory): Promise<void> {
        console.log('[ChatHistoryService] updateConversationLastMessage: Updating last message for conversationId:', message.conversationId);
        try {
            // Dynamic import to avoid circular dependency
            const { conversationMetaDatasService } = await import('./conversationsService');
            console.log('[ChatHistoryService] updateConversationLastMessage: conversationMetaDatasService imported.');
            await conversationMetaDatasService.updateLastMessage(
                message.conversationId,
                message.content,
                message.timestamp!.getTime()
            );
            console.log('[ChatHistoryService] updateConversationLastMessage: Last message updated for conversationId:', message.conversationId);
        } catch (error) {
            console.error('[ChatHistoryService] updateConversationLastMessage: Failed to update conversation last message:', error);
            // Don't throw here - this is auxiliary functionality
        }
    }
}

export const chatHistoryService = new ChatHistoryService();