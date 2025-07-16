import { ChatHistory, ConversationMetadata } from '@/types/messaging.types';
import { IDBPDatabase, openDB } from 'idb';

const DATABASE_NAME = 'messageCache';
const DATABASE_VERSION = 1;

export const STORE_NAMES = {
    CHAT_HISTORY: 'chatHistory',
    CONVERSATIONS: 'conversations',
} as const;

// Define the database schema type
export interface MessageCacheDB {
    [STORE_NAMES.CHAT_HISTORY]: {
        key: string; // messageId
        value: ChatHistory;
        indexes: { 'conversationId': number };
    };
    [STORE_NAMES.CONVERSATIONS]: {
        key: number; // conversationId
        value: ConversationMetadata;
        indexes: { 'id': number };
    };
}

class DatabaseInitializer {
    private db: IDBPDatabase<MessageCacheDB> | null = null;
    // promise to avoid race condition: if the database is already opening, retrun  
    private dbPromise: Promise<IDBPDatabase<MessageCacheDB>> | null = null;

    private async initializeDatabase(): Promise<IDBPDatabase<MessageCacheDB>> {
        if (this.db) {
            return this.db;
        }

        if (this.dbPromise) {
            return this.dbPromise;
        }

        try {
            this.dbPromise = openDB<MessageCacheDB>(DATABASE_NAME, DATABASE_VERSION, {
                upgrade(db) {
                    // Create chat history store
                    if (!db.objectStoreNames.contains(STORE_NAMES.CHAT_HISTORY)) {
                        const chatHistoryStore = db.createObjectStore(STORE_NAMES.CHAT_HISTORY, { keyPath: 'messageId' });
                        chatHistoryStore.createIndex('conversationId', 'conversationId', { unique: false });
                    }

                    // Create conversations store
                    if (!db.objectStoreNames.contains(STORE_NAMES.CONVERSATIONS)) {
                        const conversationsStore = db.createObjectStore(STORE_NAMES.CONVERSATIONS, { keyPath: 'id' });
                        conversationsStore.createIndex('id', 'id', { unique: true });
                    }

                    console.log('Database schema created successfully');
                },
            });
            console.log('Database opened successfully');
            return this.dbPromise;
        } catch (error) {
            this.dbPromise = null;
            this.db = null;
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    public async getDatabase(): Promise<IDBPDatabase<MessageCacheDB>> {
        this.db ??= await this.initializeDatabase();
        return this.db;
    }
}

export const databaseInitializer = new DatabaseInitializer();