import { ChatHistory, ChatHistoryCache, Conversation, Drafts } from '@/types/messaging.types';
import { IDBPDatabase, openDB } from 'idb';

const DATABASE_NAME = 'messageCache';
const DATABASE_VERSION = 1;

export const STORE_NAMES = {
    DRAFTS: 'drafts',
    CHAT_HISTORY: 'chatHistory',
    CHAT_HISTORY_CACHE: 'chatHistoryCache',
    CONVERSATIONS: 'conversations',
} as const;

// Define the database schema type
interface MessageCacheDB {
    [STORE_NAMES.DRAFTS]: {
        key: number; // conversationId
        value: Drafts;
    };
    [STORE_NAMES.CHAT_HISTORY]: {
        key: number; // messageId
        value: ChatHistory;
        indexes: { 'conversationId': number };
    };
    [STORE_NAMES.CHAT_HISTORY_CACHE]: {
        key: number; // messageId
        value: ChatHistoryCache;
        indexes: { 'conversationId': number };
    };
    [STORE_NAMES.CONVERSATIONS]: {
        key: number; // conversationId
        value: Conversation;
        indexes: { 'id': number };
    };
}

class DatabaseInitializer {
    private dbPromise: Promise<IDBPDatabase<MessageCacheDB>>;

    constructor() {
        this.dbPromise = this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<IDBPDatabase<MessageCacheDB>> {
        try {
            const db = await openDB<MessageCacheDB>(DATABASE_NAME, DATABASE_VERSION, {
                upgrade(db) {
                    // Create drafts store
                    if (!db.objectStoreNames.contains(STORE_NAMES.DRAFTS)) {
                        db.createObjectStore(STORE_NAMES.DRAFTS, { keyPath: 'conversationId' });
                    }

                    // Create chat history store
                    if (!db.objectStoreNames.contains(STORE_NAMES.CHAT_HISTORY)) {
                        const chatHistoryStore = db.createObjectStore(STORE_NAMES.CHAT_HISTORY, { keyPath: 'messageId' });
                        chatHistoryStore.createIndex('conversationId', 'conversationId', { unique: false });
                    }

                    // Create chat history cache store
                    if (!db.objectStoreNames.contains(STORE_NAMES.CHAT_HISTORY_CACHE)) {
                        const cacheStore = db.createObjectStore(STORE_NAMES.CHAT_HISTORY_CACHE, { keyPath: 'messageId' });
                        cacheStore.createIndex('conversationId', 'conversationId', { unique: false });
                    }

                    // Create conversations store
                    if (!db.objectStoreNames.contains(STORE_NAMES.CONVERSATIONS)) {
                        const conversationsStore = db.createObjectStore(STORE_NAMES.CONVERSATIONS, { keyPath: 'id' });
                        // Index for quick lookups (though not strictly necessary with primary key)
                        conversationsStore.createIndex('id', 'id', { unique: true });
                    }

                    console.log('Database schema created successfully');
                },
            });

            console.log('Database opened successfully');
            return db;
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    public async getDatabase(): Promise<IDBPDatabase<MessageCacheDB>> {
        return this.dbPromise;
    }
}

export const databaseInitializer = new DatabaseInitializer();