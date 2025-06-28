import { seedChatHistory, reseedChatHistory, chatHistoryService } from './index';

/**
 * Test script to seed and verify the chat history data
 * Run this in browser console or call it from your component
 */
export const runSeedTest = async () => {
    try {
        console.log('🚀 Starting seed test...');
        
        // Seed the database
        await seedChatHistory();
        
        // Verify data was added
        console.log('\n📊 Verifying seeded data...');
        
        // Check conversation 1
        const conv1Messages = await chatHistoryService.getChatHistory(1);
        console.log(`Conversation 1: ${conv1Messages.length} messages`);
        console.log('Latest message:', conv1Messages[conv1Messages.length - 1]?.content);
        
        // Check conversation 2
        const conv2Messages = await chatHistoryService.getChatHistory(2);
        console.log(`Conversation 2: ${conv2Messages.length} messages`);
        
        // Check conversation 3
        const conv3Messages = await chatHistoryService.getChatHistory(3);
        console.log(`Conversation 3: ${conv3Messages.length} messages`);
        
        // Check conversation 4
        const conv4Messages = await chatHistoryService.getChatHistory(4);
        console.log(`Conversation 4: ${conv4Messages.length} messages`);
        
        console.log('\n✅ Seed test completed successfully!');
        
        return {
            conv1: conv1Messages.length,
            conv2: conv2Messages.length,
            conv3: conv3Messages.length,
            conv4: conv4Messages.length,
            total: conv1Messages.length + conv2Messages.length + conv3Messages.length + conv4Messages.length
        };
        
    } catch (error) {
        console.error('❌ Seed test failed:', error);
        throw error;
    }
};

/**
 * Quick function to clear and reseed the database
 */
export const quickReseed = async () => {
    try {
        console.log('🔄 Quick reseed starting...');
        await reseedChatHistory();
        console.log('✅ Quick reseed completed!');
    } catch (error) {
        console.error('❌ Quick reseed failed:', error);
        throw error;
    }
};

// For easy access in browser console
if (typeof window !== 'undefined') {
    (window as any).seedTest = runSeedTest;
    (window as any).quickReseed = quickReseed;
    console.log('💡 Test functions available: window.seedTest() and window.quickReseed()');
} 