import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "@/types/sidebar.types";

export interface UserState {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    birthDate: Date | null;
    isMale: boolean | null;
    name: string | null;
    email: string | null;
    role: string[] | null;
}

const initialState: UserState = {
    id: null,
    firstName: null,
    lastName: null,
    phone: null,
    birthDate: null,
    isMale: null,
    name: null,
    email: null,
    role: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.phone = action.payload.phone;
            state.birthDate = action.payload.birthDate;
            state.isMale = action.payload.isMale;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role || [];
        },
        clearUserState(state) {
            state.id = null;
            state.firstName = null;
            state.lastName = null;
            state.phone = null;
            state.birthDate = null;
            state.isMale = null;
            state.name = null;
            state.email = null;
            state.role = null;
        }
    },
})

export const { setUser, clearUserState } = userSlice.actions;
export const selectUser = (store: RootState) => store.persistedReducer.user;
export default userSlice.reducer;
