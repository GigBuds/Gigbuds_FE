import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface DraftState {
    conversationId: number;
    content: string;
}

const initialState: DraftState[] = []

const draftSlice = createSlice({
    name: "draft",
    initialState,
    reducers: {
        upsertDraft: (state, action: PayloadAction<DraftState>) => {
            const existingDraft = state.find(x => x.conversationId === action.payload.conversationId);
            if (existingDraft) {
                existingDraft.content = action.payload.content;
                return state;
            }

            return [...state, action.payload];
        },
        clearDrafts: () => {
            return [];
        }
    },
}
)

export const { upsertDraft, clearDrafts } = draftSlice.actions;
export const selectDraft = (store: RootState) => store.tempReducer.draft;
export default draftSlice.reducer;
