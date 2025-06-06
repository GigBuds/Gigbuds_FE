import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "@/types/sidebar.types";

export interface UserState {
    id: number | null;
    sub: string | null;
    email: string | null;
    roles: string[] | null;
}

const initialState: UserState = {
    id: null,
    sub: null,
    email: null,
    roles: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.sub = action.payload.sub;
            state.email = action.payload.email;
            state.roles = action.payload.roles || [];
        },
        clearUserId(state) {
            state.id = null;
        }
    },
})

export const { setUser, clearUserId } = userSlice.actions;
export const selectUser = (store: RootState) => store.persistedReducer.user;
export default userSlice.reducer;
