// Database initialization
export { databaseInitializer, STORE_NAMES } from './databaseInitializer';

// Service exports
export { draftsService } from './draftsService';
export { chatHistoryService } from './chatHistoryService';
export { chatHistoryCacheService } from './chatHistoryCacheService';
export { conversationsService } from './conversationsService';

// Seed data exports
export { seedChatHistory, reseedChatHistory, addRecentMessages, SAMPLE_USERS, seedConversations, seedAllData } from './seedData';

// Type exports for convenience
export type { Drafts, ChatHistory, ChatHistoryCache, Conversation } from '@/types/messaging.types';

// Import services for utility functions
import { chatHistoryCacheService } from './chatHistoryCacheService';

// Utility function for tab unload cleanup
export const cleanupOnTabUnload = async () => {
    try {
        await chatHistoryCacheService.clearCache();
        console.log('Cleanup completed on tab unload');
    } catch (error) {
        console.error('Failed to cleanup on tab unload:', error);
    }
};

// Utility function for logout cleanup
export const cleanupOnLogout = async () => {
    try {
        await Promise.all([
            chatHistoryCacheService.clearCache(),
            // Note: We keep drafts and chat history on logout
            // They persist until next login/page refresh
        ]);
        console.log('Cleanup completed on logout');
    } catch (error) {
        console.error('Failed to cleanup on logout:', error);
    }
}; 