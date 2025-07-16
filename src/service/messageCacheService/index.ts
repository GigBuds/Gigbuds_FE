// Database initialization
export { databaseInitializer, STORE_NAMES } from './databaseInitializer';

// Service exports
export { chatHistoryService } from './chatHistoryService';
export { conversationMetaDatasService } from './conversationsService';

// Type exports for convenience
export type { Drafts, ChatHistory, ConversationMetadata } from '@/types/messaging.types';

import { ConversationMetadata } from '@/types/messaging.types';
// Import services for utility functions
import { conversationMetaDatasService } from './conversationsService';
import { chatHistoryService } from './chatHistoryService';


export const refreshConversationHistory = async (conversations: ConversationMetadata[]) => {
    try {
        // reset conversation meta data
        await chatHistoryService.clearAllHistory();
        await conversationMetaDatasService.clearAllConversationMetaDatas();
        await conversationMetaDatasService.updateConversationMetaData(conversations);
    } catch (error) {
        console.error('Failed to refresh conversation history:', error);
    }
}