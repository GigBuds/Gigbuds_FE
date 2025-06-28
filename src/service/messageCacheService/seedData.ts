import { chatHistoryService } from './chatHistoryService';
import { conversationsService } from './conversationsService';
import { ChatHistory, Conversation } from '@/types/messaging.types';

// Sample users for realistic conversations
const SAMPLE_USERS = {
    USER_1: { id: 1, name: 'Alice Johnson' },
    USER_2: { id: 2, name: 'Bob Smith' },
    USER_3: { id: 3, name: 'Charlie Brown' },
    USER_4: { id: 4, name: 'Diana Prince' },
    CURRENT_USER: { id: 5, name: 'You' },
};

// Helper function to create a message
const createMessage = (
    messageId: number,
    conversationId: number,
    senderId: number,
    content: string,
    minutesAgo: number,
    deliveryStatus: 'sending' | 'delivered' | 'read',
    readByIds: number[] = []
): ChatHistory => ({
    messageId,
    conversationId,
    senderId,
    readByIds,
    sentDate: Date.now() - (minutesAgo * 60 * 1000), // Convert minutes to milliseconds ago
    deliveryStatus,
    content,
});

// Sample conversations data
const getSampleMessages = (): ChatHistory[] => [
    // Conversation 1: Job discussion with Alice Johnson
    createMessage(1001, 1, SAMPLE_USERS.USER_1.id, "Hey! Are you still available for the graphic design gig this weekend?", 120, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(1002, 1, SAMPLE_USERS.CURRENT_USER.id, "Yes, absolutely! What time works best for you?", 115, 'read', [SAMPLE_USERS.USER_1.id]),
    createMessage(1003, 1, SAMPLE_USERS.USER_1.id, "Perfect! How about Saturday morning around 9 AM?", 110, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(1004, 1, SAMPLE_USERS.CURRENT_USER.id, "That works perfectly. Should I bring my own laptop?", 105, 'read', [SAMPLE_USERS.USER_1.id]),
    createMessage(1005, 1, SAMPLE_USERS.USER_1.id, "Yes please, and if you have Adobe Creative Suite that would be great!", 100, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(1006, 1, SAMPLE_USERS.CURRENT_USER.id, "Got it! I have the full Adobe suite. What's the project about?", 95, 'read', [SAMPLE_USERS.USER_1.id]),
    createMessage(1007, 1, SAMPLE_USERS.USER_1.id, "It's a logo design for a local coffee shop. They want something modern but cozy.", 90, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(1008, 1, SAMPLE_USERS.CURRENT_USER.id, "Sounds exciting! Do they have any specific colors or themes in mind?", 85, 'read', [SAMPLE_USERS.USER_1.id]),
    createMessage(1009, 1, SAMPLE_USERS.USER_1.id, "They mentioned earth tones and maybe incorporating a coffee bean or cup element.", 80, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(1010, 1, SAMPLE_USERS.CURRENT_USER.id, "Perfect! I'll start brainstorming some ideas. What's the budget range?", 75, 'delivered'),

    // Conversation 2: Quick gig coordination with Bob Smith
    createMessage(2001, 2, SAMPLE_USERS.USER_2.id, "Quick question - can you help with moving tomorrow?", 60, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(2002, 2, SAMPLE_USERS.CURRENT_USER.id, "Sure! What time and how many hours?", 58, 'read', [SAMPLE_USERS.USER_2.id]),
    createMessage(2003, 2, SAMPLE_USERS.USER_2.id, "Around 2 PM, probably 3-4 hours max. It's just a studio apartment.", 55, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(2004, 2, SAMPLE_USERS.CURRENT_USER.id, "No problem! What's the rate?", 52, 'read', [SAMPLE_USERS.USER_2.id]),
    createMessage(2005, 2, SAMPLE_USERS.USER_2.id, "$25/hour plus pizza and drinks 😄", 50, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(2006, 2, SAMPLE_USERS.CURRENT_USER.id, "Deal! Send me the address and I'll be there", 48, 'delivered'),
    
    // Conversation 3: Event setup with Charlie Brown
    createMessage(3001, 3, SAMPLE_USERS.USER_3.id, "Hey! We need extra hands for the wedding setup this Saturday", 45, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(3002, 3, SAMPLE_USERS.CURRENT_USER.id, "I'm interested! What does it involve?", 42, 'read', [SAMPLE_USERS.USER_3.id]),
    createMessage(3003, 3, SAMPLE_USERS.USER_3.id, "Setting up tables, chairs, decorations. Pretty straightforward stuff.", 40, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(3004, 3, SAMPLE_USERS.CURRENT_USER.id, "How early do we need to start?", 38, 'read', [SAMPLE_USERS.USER_3.id]),
    createMessage(3005, 3, SAMPLE_USERS.USER_3.id, "Setup starts at 7 AM, wedding is at 2 PM. We should be done by noon.", 35, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(3006, 3, SAMPLE_USERS.CURRENT_USER.id, "That's early but doable! What's the pay?", 33, 'read', [SAMPLE_USERS.USER_3.id]),
    createMessage(3007, 3, SAMPLE_USERS.USER_3.id, "$30/hour and we usually finish early. Plus free breakfast!", 30, 'delivered'),

    // Conversation 4: Photography gig with Diana Prince
    createMessage(4001, 4, SAMPLE_USERS.USER_4.id, "Looking for a photographer for a birthday party next weekend", 25, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(4002, 4, SAMPLE_USERS.CURRENT_USER.id, "I'd love to help! What kind of photography style are you looking for?", 22, 'read', [SAMPLE_USERS.USER_4.id]),
    createMessage(4003, 4, SAMPLE_USERS.USER_4.id, "Candid shots mostly, some group photos. It's for my daughter's sweet 16.", 20, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(4004, 4, SAMPLE_USERS.CURRENT_USER.id, "That sounds wonderful! How many hours and how many guests?", 18, 'read', [SAMPLE_USERS.USER_4.id]),
    createMessage(4005, 4, SAMPLE_USERS.USER_4.id, "About 4 hours, roughly 50 guests. It's at our backyard.", 15, 'read', [SAMPLE_USERS.CURRENT_USER.id]),
    createMessage(4006, 4, SAMPLE_USERS.CURRENT_USER.id, "Perfect! I have experience with outdoor events. Do you need edited photos delivered?", 12, 'read', [SAMPLE_USERS.USER_4.id]),
    createMessage(4007, 4, SAMPLE_USERS.USER_4.id, "Yes, edited photos would be great! What's your rate?", 10, 'delivered'),
    createMessage(4008, 4, SAMPLE_USERS.CURRENT_USER.id, "For 4 hours plus editing, I charge $200 total. Does that work?", 8, 'delivered'),
    createMessage(4009, 4, SAMPLE_USERS.USER_4.id, "That sounds reasonable! Can you send me some samples of your work?", 5, 'sending'),
    createMessage(4010, 4, SAMPLE_USERS.CURRENT_USER.id, "Absolutely! I'll send you a link to my portfolio in a few minutes", 2, 'sending'),
];

/**
 * Seeds the database with sample chat history data
 */
export const seedChatHistory = async (): Promise<void> => {
    try {
        console.log('🌱 Starting chat history seeding...');
        
        const sampleMessages = getSampleMessages();
        
        // Group messages by conversation and add them
        const conversationGroups = sampleMessages.reduce((acc, message) => {
            if (!acc[message.conversationId]) {
                acc[message.conversationId] = [];
            }
            acc[message.conversationId].push(message);
            return acc;
        }, {} as Record<number, ChatHistory[]>);

        // Add each conversation's messages
        for (const [conversationId, messages] of Object.entries(conversationGroups)) {
            await chatHistoryService.replaceConversationHistory(Number(conversationId), messages);
            console.log(`✅ Added ${messages.length} messages for conversation ${conversationId}`);
        }

        console.log('🎉 Chat history seeding completed successfully!');
        console.log(`📊 Total: ${sampleMessages.length} messages across ${Object.keys(conversationGroups).length} conversations`);
        
    } catch (error) {
        console.error('❌ Failed to seed chat history:', error);
        throw error;
    }
};

/**
 * Clears all chat history and reseeds with fresh data
 */
export const reseedChatHistory = async (): Promise<void> => {
    try {
        console.log('🧹 Clearing existing chat history...');
        await chatHistoryService.clearAllHistory();
        
        console.log('🌱 Reseeding with fresh data...');
        await seedChatHistory();
        
    } catch (error) {
        console.error('❌ Failed to reseed chat history:', error);
        throw error;
    }
};

/**
 * Quick function to add a few more recent messages to conversation 1
 */
export const addRecentMessages = async (): Promise<void> => {
    try {
        const recentMessages: ChatHistory[] = [
            createMessage(1011, 1, SAMPLE_USERS.USER_1.id, "The budget is $500 for the complete logo package", 2, 'delivered'),
            createMessage(1012, 1, SAMPLE_USERS.CURRENT_USER.id, "That works great! I'll have some initial concepts ready by Saturday", 1, 'delivered'),
        ];

        for (const message of recentMessages) {
            await chatHistoryService.addMessage(message);
        }

        console.log('✅ Added recent messages to conversation 1');
    } catch (error) {
        console.error('❌ Failed to add recent messages:', error);
        throw error;
    }
};

/**
 * Generate sample conversations metadata based on the chat history
 */
const getSampleConversations = (): Conversation[] => [
    {
        id: 1,
        name: SAMPLE_USERS.USER_1.name,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        lastMessage: "Perfect! I'll start brainstorming some ideas. What's the budget range?",
        timestamp: Date.now() - (75 * 60 * 1000), // 75 minutes ago
        isOnline: true,
        isTyping: false,
    },
    {
        id: 2,
        name: SAMPLE_USERS.USER_2.name,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        lastMessage: "Deal! Send me the address and I'll be there",
        timestamp: Date.now() - (48 * 60 * 1000), // 48 minutes ago
        isOnline: false,
        isTyping: false,
    },
    {
        id: 3,
        name: SAMPLE_USERS.USER_3.name,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
        lastMessage: "$30/hour and we usually finish early. Plus free breakfast!",
        timestamp: Date.now() - (30 * 60 * 1000), // 30 minutes ago
        isOnline: true,
        isTyping: false,
    },
    {
        id: 4,
        name: SAMPLE_USERS.USER_4.name,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
        lastMessage: "Absolutely! I'll send you a link to my portfolio in a few minutes",
        timestamp: Date.now() - (2 * 60 * 1000), // 2 minutes ago
        isOnline: true,
        isTyping: true, // Currently typing
    },
];

/**
 * Seeds the database with sample conversation metadata
 */
export const seedConversations = async (): Promise<void> => {
    try {
        console.log('🌱 Starting conversations seeding...');
        
        const sampleConversations = getSampleConversations();
        
        // Add each conversation
        for (const conversation of sampleConversations) {
            await conversationsService.upsertConversation(conversation);
        }
        
        console.log('🎉 Conversations seeding completed successfully!');
        console.log(`📊 Total: ${sampleConversations.length} conversations added`);
        
    } catch (error) {
        console.error('❌ Failed to seed conversations:', error);
        throw error;
    }
};

/**
 * Seeds both conversations and chat history
 */
export const seedAllData = async (): Promise<void> => {
    try {
        console.log('🌱 Starting complete data seeding...');
        
        // Seed conversations first
        await seedConversations();
        
        // Then seed chat history
        await seedChatHistory();
        
        console.log('🎉 Complete data seeding finished!');
        
    } catch (error) {
        console.error('❌ Failed to seed all data:', error);
        throw error;
    }
};

// Export sample data for external use
export { SAMPLE_USERS, getSampleMessages, getSampleConversations }; 