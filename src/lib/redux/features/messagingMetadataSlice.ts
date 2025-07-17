import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UnreadMessage {
    conversationId: number;
    messageId: string;
}

export interface OnlineUser {
    userId: number;
    lastActive: number;
}

export interface MessagingMetadataState {
    unreadMessages: UnreadMessage[];
    onlineUsers: OnlineUser[];
    lastMessageTimestamp: number;
}

const initialState: MessagingMetadataState = {
    unreadMessages: [],
    onlineUsers: [],
    lastMessageTimestamp: 0,
}

const messagingMetadataSlice = createSlice({
    name: "messagingMetadata",
    initialState,
    reducers: {
        addUnreadMessage: (state, action: PayloadAction<UnreadMessage>) => {
            const newUnreadMessages = [...state.unreadMessages, action.payload];
            state.unreadMessages = newUnreadMessages;
        },
        clearUnreadMessages: (state, action: PayloadAction<number>) => {
            const newUnreadMessages = state.unreadMessages.filter(x => x.conversationId !== action.payload);
            state.unreadMessages = newUnreadMessages;
        },
        addOnlineUser: (state, action: PayloadAction<OnlineUser>) => {
            const newOnlineUsers = [...state.onlineUsers, action.payload];
            state.onlineUsers = newOnlineUsers;
        },
        addOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
            const newOnlineUsers = [...state.onlineUsers, ...action.payload];
            state.onlineUsers = newOnlineUsers;
        },
        setUserOnlineStatus: (state, action: PayloadAction<number>) => {
            console.log("setUserOnlineStatus", action.payload);
            const index = state.onlineUsers.findIndex(x => x.userId === action.payload);
            if (index !== -1) {
                state.onlineUsers[index].lastActive = -1;
            }
        },
        setUserOfflineStatus: (state, action: PayloadAction<OnlineUser>) => {
            console.log("setUserOfflineStatus", action.payload);
            const index = state.onlineUsers.findIndex(x => x.userId === action.payload.userId);
            if (index !== -1) {
                state.onlineUsers[index] = action.payload;
            }
        },
        emptyOnlineUsers: (state) => {
            state.onlineUsers = [];
        },
        conversationUpdated: (state) => {
            state.lastMessageTimestamp = Date.now();
        }
    },
})

export const { addUnreadMessage, clearUnreadMessages, addOnlineUser, addOnlineUsers, setUserOnlineStatus, setUserOfflineStatus, emptyOnlineUsers, conversationUpdated } = messagingMetadataSlice.actions;
export const selectMessagingMetadata = (state: RootState) => state.persistedReducer.messagingMetadata;
export default messagingMetadataSlice.reducer;