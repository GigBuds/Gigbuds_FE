import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
    id: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
    profilePicture: string | null;
}

const initialState: UserState = {
    id: null,
    email: null,
    phone: null,
    name: null,
    profilePicture: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        clearUserId(state) {
            state.id = null;
        }
    },
})

export const { setUser, clearUserId } = userSlice.actions;
export const selectUser = (store: RootState) => store.persistedReducer.user;
export default userSlice.reducer;
