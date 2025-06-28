import { databaseInitializer, STORE_NAMES } from "./databaseInitializer";
import { Drafts } from "@/types/messaging.types";

class DraftsService {

    public async addDraft(draft: Drafts): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.add(STORE_NAMES.DRAFTS, draft);
            console.log('Draft added successfully', draft);
        } catch (error) {
            console.error('Failed to add draft:', error);
            throw error;
        }
    }

    public async updateDraft(draft: Drafts): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.DRAFTS, draft);
            console.log('Draft updated successfully', draft);
        } catch (error) {
            console.error('Failed to update draft:', error);
            throw error;
        }
    }

    public async saveDraft(draft: Drafts): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.put(STORE_NAMES.DRAFTS, draft);
            console.log('Draft saved successfully', draft);
        } catch (error) {
            console.error('Failed to save draft:', error);
            throw error;
        }
    }

    public async getDraft(conversationId: number): Promise<Drafts | undefined> {
        try {
            const db = await databaseInitializer.getDatabase();
            const draft = await db.get(STORE_NAMES.DRAFTS, conversationId);
            console.log('Draft retrieved successfully', draft);
            return draft;
        } catch (error) {
            console.error('Failed to get draft:', error);
            throw error;
        }
    }

    public async deleteDraft(conversationId: number): Promise<void> {
        try {
            const db = await databaseInitializer.getDatabase();
            await db.delete(STORE_NAMES.DRAFTS, conversationId);
            console.log('Draft deleted successfully for conversation:', conversationId);
        } catch (error) {
            console.error('Failed to delete draft:', error);
            throw error;
        }
    }

    public async getAllDrafts(): Promise<Drafts[]> {
        try {
            const db = await databaseInitializer.getDatabase();
            const drafts = await db.getAll(STORE_NAMES.DRAFTS);
            console.log('All drafts retrieved successfully', drafts);
            return drafts;
        } catch (error) {
            console.error('Failed to get all drafts:', error);
            throw error;
        }
    }
}

export const draftsService = new DraftsService();